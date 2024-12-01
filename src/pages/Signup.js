import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import bg_image from '../images/facerecs_copy.jpg'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    const [showPassword, setShowPassword] = useState(false); // Default: hide password
    let navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            props.showAlert("Already Logged-in! (Logout to switch account)", 'info');
            navigate('/dashboard');
        }
    }, [navigate, props]);

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
            sessionStorage.setItem('token', json.authToken);
            navigate("/dashboard");
            props.showAlert("Account created Successfully", "success");
        } else {
            props.showAlert("Invalid details", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const isFormValid = credentials.name && credentials.email && credentials.password && credentials.cpassword && (credentials.password === credentials.cpassword);

    return (
        <div style={styles.container}>
            <div className="container mt-1 d-flex justify-content-center" style={{ minHeight: '79vh' }}>
                <div style={{ width: "100%", maxWidth: "400px" }}>

                    <Card className="p-5 shadow-lg" style={styles.card}>
                        <div className="my-3 text-center" style={styles.title}>FaceRecs</div>
                        <form onSubmit={handleSubmit} style={{ fontSize: '1.1rem' }}>
                            <div className="mb-3">
                                <input
                                    style={styles.inputForm}
                                    type="text"
                                    className="form-control custom-input"
                                    value={credentials.name}
                                    onChange={onChange}
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    style={styles.inputForm}
                                    type="email"
                                    className="form-control custom-input"
                                    value={credentials.email}
                                    onChange={onChange}
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                />
                                <div style={{ fontSize: '0.85rem', fontWeight: 'lighter', color: 'whitesmoke' }} id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div className="mb-3 position-relative">
                                <div className="input-group">
                                    <input
                                        style={styles.inputForm}
                                        type={showPassword ? "text" : "password"}
                                        className="form-control custom-input"
                                        value={credentials.password}
                                        onChange={onChange}
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        required
                                    />
                                    <span
                                        style={styles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🐵' : '🙈'}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <input
                                    style={styles.inputForm}
                                    type="password"
                                    className="form-control custom-input"
                                    value={credentials.cpassword}
                                    onChange={onChange}
                                    name="cpassword"
                                    id="cpassword"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ ...styles.button, backgroundColor: isFormValid ? '#007bff' : '#099acb' }}
                                disabled={!isFormValid}
                            >
                                Signup
                            </button>
                        </form>
                    </Card>
                    <div className="text-center mt-3">
                        <p>Already have an account?{' '}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontFamily: 'Kumbh Sans',
        // margin: 0,
        // padding: 0,
        // marginTop: '60px',
        position: 'relative',
        top: '65px',
    },
    title: {
        color: 'whitesmoke', //'teal'
        fontSize: '36px',
        fontFamily: 'Bruno Ace SC',
        borderBottom: "4px solid lightblue",
        paddingBottom: '5px',
    },
    card: {
        fontWeight: 'bold',
        transform: 'scale(1.03)',
        maxWidth: '100%',
        minHeight: '250px',
        padding: '25px',
        borderRadius: '25px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out',
        backgroundImage: `url(${bg_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    inputForm: {
        fontWeight: 'thick',
        borderRadius: '20px',
        padding: '12px 15px',
        fontSize: '16px',
        marginTop: '5px'
    },
    button: {
        fontWeight: 'bold',
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        textAlign: 'center',
    },
    passwordToggle: {
        position: 'absolute',
        right: '15px',
        top: '55%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default Signup;
