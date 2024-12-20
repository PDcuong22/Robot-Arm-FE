import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import ControlPanel from './components/ControlPanel/ControlPanel';
import RecordList from './components/RecordList/RecordList';
import imgRobotArm from './assets/images/RobotArm.PNG'

const socket = io('http://localhost:5000');

// Main App Component
const App = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch records from backend
    socket.on('record-list', (data) => {
      setRecords(data);
    });
    return () => socket.off('record-list');
  }, []);

  const handleRecordSave = (name, actions) => {
    socket.emit('save-record', { name, actions }, (response) => {
      if (response.success) {
        setRecords([...records, { name, actions }]);
      } else {
        alert('Failed to save record: ' + response.error);
      }
    });
  };

  const handlePlayRecord = (actions) => {
    socket.emit('play-actions', actions);
  };

  const handleDeleteRecord = (name) => {
    socket.emit('delete-record', name, (response) => {
      if (response.success) {
        setRecords(records.filter((record) => record.name !== name));
      } else {
        alert('Failed to delete record: ' + response.error);
      }
    });
  };

  const handleEditRecord = (oldName, newName) => {
    socket.emit('edit-record', { oldName, newName }, (response) => {
      if (response.success) {
        setRecords(
          records.map((record) =>
            record.name === oldName ? { ...record, name: newName } : record
          )
        );
      } else {
        alert('Failed to edit record: ' + response.error);
      }
    });
  };

  return (
    <div className="app-container" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px"
    }}>
      <div className="left-panel" style={{ width: "20%", paddingRight: "10px" }}>
        <RecordList
          records={records}
          onPlay={handlePlayRecord}
          onDelete={handleDeleteRecord}
          onEdit={handleEditRecord}
        />
      </div>
      <div className="middle-panel" style={{ padding: "20px", width: "30%", textAlign: "left" }}>
        <ControlPanel onRecordSave={handleRecordSave} />
      </div>
      <div className="right-panel" style={{ position: "relative", width: "40%", textAlign: "right" }}>
        <img src={imgRobotArm} alt="Robot Arm" style={{ width: "70%", height: "90%" }}/>
      </div>
    </div>
  );
};

export default App;