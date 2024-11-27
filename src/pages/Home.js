import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // Navigate to the dashboard if the token exists
    } else {
      navigate('/login'); // Otherwise, navigate to the login page
    }
  };

  return (
    <div style={{ fontFamily: 'Kumbh Sans' }}>
      <Container
        style={{ marginTop: '-100px' }}
        className="d-flex align-items-center justify-content-center vh-100"
      >
        <Card className="text-center p-5 shadow-lg" style={{ maxWidth: '500px' }}>
          <Card.Body>
            <Card.Title>Welcome to the</Card.Title>
            <Card.Header
              style={{
                fontSize: '25px',
                fontFamily: 'monospace',
                backgroundColor: 'whitesmoke',
                color: 'teal',
                border: '40px',
                margin: '20px',
              }}
            >
              MULTI-LEVEL FACE RECOGNITION SYSTEM
            </Card.Header>
            <Button
              variant="primary"
              className="mt-3"
              style={{ backgroundColor: 'teal' }}
              onClick={handleGetStarted} // Attach the click handler
            >
              Get Started
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
