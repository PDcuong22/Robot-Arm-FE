import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ControlPanel = ({ onRecordSave }) => {
  const [sliders, setSliders] = useState([0, 0, 0, 0, 0, 0]);
  const [isRecording, setIsRecording] = useState(false);
  const [actions, setActions] = useState([]);

  const handleSliderChange = (index, value) => {
    const newSliders = [...sliders];
    newSliders[index] = value;
    setSliders(newSliders);
    socket.emit('servo-control', { index, value });
    if (isRecording) {
      setActions([...actions, { index, value }]);
    }
  };

  const handleRecord = () => {
    setIsRecording(true);
    setActions([]);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
  };

  const handlePlay = () => {
    if (actions.length > 0) {
      socket.emit('play-actions', actions);
    }
  };

  const handleSave = () => {
    const recordName = prompt('Enter a unique name for this record:');
    if (recordName) {
      onRecordSave(recordName, actions);
    }
  };

  return (
    <div className="control-panel">
      <h2>Control Panel</h2>
      {sliders.map((value, index) => (
        <div key={index}>
          <label>Servo {index + 1}</label>
          <input
            type="range"
            min="0"
            max="180"
            value={value}
            onChange={(e) => handleSliderChange(index, parseInt(e.target.value, 10))}
          />
        </div>
      ))}
      <button onClick={isRecording ? handleStopRecord : handleRecord}>
        {isRecording ? 'Stop Recording' : 'Record'}
      </button>
      {!isRecording && actions.length > 0 && (
        <>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
};

export default ControlPanel;
