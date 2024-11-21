import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // Save the authToken & redirect
            localStorage.setItem('token', json.authToken);
            navigate("/");
            props.showAlert("Account created Successfully", "success");
        } else {
            props.showAlert("Invalid details", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div style={styles.container}>
            <div className='container mt-1 d-flex justify-content-center' style={{ minHeight: '110vh' }}>
                <div style={{ width: "100%", maxWidth: "400px" }}>

                    <h2 className='my-3 text-center' style={styles.title}>FaceRecs</h2>
                    <Card className="p-5 shadow-lg" style={styles.card}>
                        <form onSubmit={handleSubmit} style={{ fontSize: '1rem' }}>
                            <div className="my-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Signup</button>
                        </form>
                    </Card>

                    {/* Already have an account link */}
                    <div className="text-center mt-3">
                        <p>Already have an account?</p>
                        <button className="btn btn-primary" onClick={() => { navigate('/login') }}>Login</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Kumbh Sans',
    },
    title: {
        fontFamily: 'Lexend',
        fontSize: '60px',
    },
    card: {
        maxWidth: '100%',
        minHeight: '400px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Softer shadow
    },
};

export default Signup;
