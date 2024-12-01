import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bg_image from '../images/facerecs_copy.jpg'

const Login = (props) => {
    const location = useLocation();
    const message = location.state?.message;

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false); // default: hide password
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
            sessionStorage.setItem('token', json.authToken);
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

                    <Card className="p-5 shadow-lg" style={styles.card}>
                        <div className="my-3 text-center" style={styles.title}>FaceRecs</div>
                        <form onSubmit={handleSubmit} style={{ fontSize: '1.1rem' }}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label"></label>
                                <input
                                    style={styles.inputForm}
                                    type="email"
                                    className="form-control custom-input"
                                    value={credentials.email}
                                    onChange={onChange}
                                    id="email"
                                    name="email"
                                    aria-describedby="emailHelp"
                                    placeholder="Email"

                                />
                                <div style={{ fontSize: '0.85rem', fontWeight: 'lighter', color: 'whitesmoke' }} id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="password" className="form-label"></label>
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
                                    />
                                    <span
                                        style={styles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🐵' : '🙈'}
                                    </span>
                                </div>
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
                        {message && <p style={{ color: 'red', fontSize: '19px', fontWeight: 'initial', paddingTop: '40px', paddingBottom: '0', justifyContent: 'center' }}>{message}</p>}
                    </Card>
                    <div className="text-center mt-3">
                        <p>Don't Have an Account?{' '}
                            <Link to="/signup">Signup</Link>
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
        justifyContent: 'center', // horizontally center
        alignItems: 'center', // vertically center
        height: '100%', //100vh
        fontFamily: 'Kumbh Sans',
        // margin: 0,
        // padding: 0,
        // marginTop: '100px',
        position: 'relative',
        top: '100px'
    },
    title: {
        color: 'whitesmoke', //'teal'
        fontSize: '36px',
        fontFamily: 'Bruno Ace SC',
        borderBottom: "4px solid lightblue",
        paddingBottom: '5px', // for border-bottom effect
    },
    card: {
        fontWeight: 'bold',
        transform: 'scale(1.03)',
        maxWidth: '100%',
        minHeight: '250px',
        padding: '25px',
        borderRadius: '25px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out', // smooth transition for scaling
        backgroundImage: `url(${bg_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    inputForm: {
        fontWeight: 'thick',
        borderRadius: '20px',
        padding: '12px 15px',
        fontSize: '16px',
        marginTop: '-20px',
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
        top: '10%', //50%
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '18px',
        lineHeight: '1', // Aligns properly with the input field
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        fontWeight: 'bold', // Adjust font weight here
        color: '#aaa',      // Optional: Change placeholder color
    },
};

export default Login;
