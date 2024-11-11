import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Replace with actual registration logic (e.g., API call)
      // Assume registration is successful
      setError(null);
      setSuccess('Registration successful! You can now log in.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-4 shadow-lg rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4" style={{ color: 'teal', fontFamily: 'cursive' }}>Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
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

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleRegister} className="w-100" style={{ backgroundColor: 'teal' }}>
            Register
          </Button>
          
          <div className="text-center mt-3">
            Already have an Account?
            <Link to="/login" style={{ color: 'darkgreen', textDecoration: 'underline' }}>LOGIN</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
