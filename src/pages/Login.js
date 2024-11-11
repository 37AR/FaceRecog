import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      // Replace with actual login logic
      if (username === 'user' && password === 'password') {
        setError(null);
        console.log('Login successful');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-4 shadow-lg rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4" style={{color: 'teal', fontFamily: 'cursive'}}>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleLogin} className="w-100" style={{backgroundColor: 'teal'}}>Login</Button>
          <div className="text-center mt-3">
            New User? <Link to="/register" style={{ color: 'darkgreen', textDecoration: 'underline' }}>REGISTER</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
