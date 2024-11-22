import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
// import backdropImage from '../images/facerecs.jpg';

const Login = (props) => {
    const location = useLocation();
    const message = location.state?.message;

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // Save the authToken & redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged-in Successfully", "success");
            navigate("/dashboard");
        } else {
            props.showAlert("Invalid credentials", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const isFormValid = credentials.email && credentials.password;

    return (
        <div style={styles.container}>
            <div className="container mt-1 d-flex justify-content-center" style={{ minHeight: '79vh' }}>
                <div style={{ width: "100%", maxWidth: "400px" }}>
                    <div className='my-3 text-center' style={styles.title}>FaceRecs</div>
                    {/* Login Message */}
                    {message && <p style={{ color: 'red', fontSize: '20px', justifyContent: 'center' }}>{message}</p>}
                    <Card className="p-5 shadow-lg" style={styles.card}>
                        <form onSubmit={handleSubmit} style={{ fontSize: '1rem' }}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={credentials.email}
                                    onChange={onChange}
                                    id="email"
                                    name="email"
                                    aria-describedby="emailHelp"
                                />
                                <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={credentials.password}
                                    onChange={onChange}
                                    name="password"
                                    id="password"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="btn btn-primary"
                                style={{ ...styles.button, backgroundColor: isFormValid ? '#007bff' : '#099acb' }}
                                disabled={!isFormValid}
                            >
                                Login
                            </button>
                        </form>
                    </Card>
                    <div className="text-center mt-3">
                        <p>New User? Create an account</p>
                        <button className="btn btn-primary" onClick={() => { navigate('/signup') }} >Signup</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Kumbh Sans',
        // backgroundImage: `url(${backdropImage})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // minHeight: '100vh',
    },
    title: {
        color: 'teal',
        fontSize: '65px',
        fontFamily: 'Bruno Ace SC',
        borderBottom: "4px solid teal",  // adjusted border width
        paddingBottom: '5px',  // refined padding for border-bottom effect
    },
    card: {
        transform: 'scale(1.03)',  // slightly increases size
        maxWidth: '100%',
        minHeight: '250px',
        padding: '25px',
        borderRadius: '10px',  // added more rounding to the card corners
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',  // softened shadow
        transition: 'transform 0.3s ease-in-out',  // smooth transition for scaling
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
    },
};

// Hover effect for the card


export default Login;
