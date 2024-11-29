import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModelSelection = () => {
  const navigate = useNavigate();

  const handleModelSelection = (path) => {
    navigate(path);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Kumbh Sans' }}>
      <h2>Select a Model to proceed...</h2>
      <button
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => handleModelSelection('/solo-register-ptm')}
      >
        Pre-Trained Model
      </button>
      <button
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => handleModelSelection('/solo-register')}
      >
        CNN Model
      </button>
    </div>
  );
};

export default ModelSelection;
