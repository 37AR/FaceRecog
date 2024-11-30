import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ModelSelection = () => {
  const navigate = useNavigate();
  const { context } = useParams(); // Dynamically get context (e.g., "registration", "verification", etc.)

  // Determine labels and paths based on context
  const contexts = {
    registration: {
      title: 'Select a Model for Face Registration',
      cnnPath: '/solo-register',
      preTrainedPath: '/solo-register-ptm',
    },
    verification: {
      title: 'Select a Model for Face Verification',
      cnnPath: '/solo-verify',
      preTrainedPath: '/solo-verify-ptm',
    },
    group: {
      title: 'Select a Model for Group Registration',
      cnnPath: '/group-register',
      preTrainedPath: '/group-register-ptm',
    },
  };

  const { title, cnnPath, preTrainedPath } = contexts[context] || contexts.registration; // Default to registration

  const handleModelSelection = (path) => {
    navigate(path);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Kumbh Sans' }}>
      <h2>{title}</h2>
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
        onClick={() => handleModelSelection(preTrainedPath)}
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
        onClick={() => handleModelSelection(cnnPath)}
      >
        CNN Model
      </button>
    </div>
  );
};

export default ModelSelection;
