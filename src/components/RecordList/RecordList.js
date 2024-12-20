import React from 'react';

const RecordList = ({ records, onPlay, onDelete, onEdit }) => {
  return (
    <div className="record-list">
      <h2>Saved Records</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.name}>
              <td>
                <input
                  type="text"
                  value={record.name}
                  onChange={(e) => onEdit(record.name, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => onPlay(record.actions)}>Play</button>
                <button onClick={() => onDelete(record.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordList;
