import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [userName, setUserName] = useState('User');
  const [crowdCount, setCrowdCount] = useState(0);
  const [groupAuthResult, setGroupAuthResult] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null); // State for verification result

  // Example crowd count
  useEffect(() => {
    const count = Math.floor(Math.random() * 100);  // Replace with real API call
    setCrowdCount(count);
  }, []);

  // Handle face capture
  const handleCaptureFace = async () => {
    try {
      const response = await axios.post('http://localhost:5000/capture-face', { userName });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error capturing face data:', error);
    }
  };

  // Handle face verification
  const handleVerifyFace = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-face', {userName});
      const { user_name, confidence } = response.data;
      setVerificationResult(`Verified User: ${user_name} with confidence ${confidence.toFixed(2)}`);
    } catch (error) {
      console.error('Error verifying face:', error);
      setVerificationResult("Verification failed.");
    }
  };

  return (
    <Container className="py-4">
      <h1
        className="mb-4"
        style={{
          fontFamily: 'Kumbh Sans',
          color: 'whitesmoke',
          backgroundColor: 'teal',
          display: 'inline-block',
          padding: '8px 16px',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        Dashboard
      </h1>

      <Row>
        {/* Individual Face Recognition */}
        <Col md={4} className="mb-3">
          <Card className="shadow-sm equal-height">
            <Card.Body>
              <Card.Title>Individual Face Recognition</Card.Title>
              <Card.Text>Authenticated User: {userName}</Card.Text>
              <Button variant="primary" style={{ backgroundColor: 'teal' }} onClick={handleCaptureFace}>
                Capture Face
              </Button>
              <Button variant="secondary" style={{ backgroundColor: 'gray', marginLeft: '10px' }} onClick={handleVerifyFace}>
                Verify Face
              </Button>
              {verificationResult && <p>{verificationResult}</p>}
            </Card.Body>
          </Card>
        </Col>

        {/* Group Face Recognition */}
        <Col md={4} className="mb-3">
          <Card className="shadow-sm equal-height">
            <Card.Body>
              <Card.Title>Group Face Recognition</Card.Title>
              <Card.Text>Status: {groupAuthResult.length > 0 ? 'Authenticated' : 'Not Authenticated'}</Card.Text>
              <Button style={{ backgroundColor: 'teal' }} variant="primary" onClick={() => setGroupAuthResult(['Person 1', 'Person 2'])}>
                Authenticate Group
              </Button>
              <ListGroup variant="flush" className="mt-3">
                {groupAuthResult.map((person, index) => (
                  <ListGroup.Item key={index}>{person}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Crowd Analysis */}
        <Col md={4} className="mb-3">
          <Card className="shadow-sm equal-height">
            <Card.Body>
              <Card.Title>Crowd Analysis</Card.Title>
              <Card.Text>Crowd Count: {crowdCount}</Card.Text>
              <Button style={{ backgroundColor: 'teal' }} variant="primary" onClick={() => setCrowdCount(Math.floor(Math.random() * 100))}>
                Update Count
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
