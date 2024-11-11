import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => (
  <Container className="d-flex align-items-center justify-content-center vh-100">
    <Card className="text-center p-5 shadow-lg" style={{ maxWidth: '500px' }}>
      <Card.Body>
        
        <Card.Title>Welcome to the</Card.Title>
        <Card.Header style={ {fontSize: '25px', fontFamily: 'monospace', backgroundColor: 'whitesmoke', color: 'teal', border: '40px', margin: '20px'} }>MULTI-LEVEL FACE RECOGNITION SYSTEM
        </Card.Header>
        {/* <Card.Text>
          Our system offers advanced face recognition features for individual, group, and crowd analysis.
          Experience the next generation in security and analytics.
        </Card.Text> */}
        <Link to="/login">
          <Button variant="primary" className="mt-3" style={{backgroundColor: 'teal'}}>Get Started</Button>
        </Link>
      </Card.Body>
    </Card>
  </Container>
);

export default Home;
