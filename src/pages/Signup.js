import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    const [showPassword, setShowPassword] = useState(false); //default: hide password
    let navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            props.showAlert("Already Logged-in! (Logout to switch account)", 'info');
            navigate('/dashboard');
        }
    }, [navigate, props]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); //toggle state
    }

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
            sessionStorage.setItem('token', json.authToken);
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
            <div className='container d-flex justify-content-center align-items-center' style={styles.innerContainer}>
                <div style={styles.formContainer}>
                    <h2 className='my-3 text-center' style={styles.title}>FaceRecs</h2>
                    <Card className="p-5 shadow-lg" style={styles.card}>
                        <form onSubmit={handleSubmit} style={{ fontSize: '1.1rem' }}>
                            <div className="my-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input style={styles.inputForm} type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="nameHelp" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input style={styles.inputForm} type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                                <div style={{ fontSize: '0.85rem' }} id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    style={styles.inputForm}
                                    type={showPassword ? 'text' : "password"}
                                    className="form-control"
                                    value={credentials.password}
                                    onChange={onChange}
                                    name="password"
                                    id="password"
                                />
                                {/* Eye icon for showing/hiding password */}
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={styles.eyeIcon}
                                    role="button"
                                    aria-label={showPassword ? "Hide Password" : "Show Password"}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                <input style={styles.inputForm} type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" style={styles.button}>Signup</button>
                        </form>
                    </Card>

                    {/* Already have an account link */}
                    <div className="text-center mt-3">
                        <p>Have an Account?
                            <Link to='/login'>Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Kumbh Sans',
        display: 'flex',
        justifyContent: 'center', // horizontally center
        alignItems: 'center', // vertically center
        height: '100vh', // 100vh
        margin: 0,
        padding: 0,
        marginTop: '0px'
    },
    innerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
    },
    formContainer: {
        width: '100%',
        maxWidth: '400px', // Set max width to ensure the form is responsive
    },
    title: {
        color: 'teal',
        fontSize: '65px',
        fontFamily: 'Bruno Ace SC',
        borderBottom: "4px solid teal",
        paddingBottom: '5px', //for border-bottom effect
    },
    card: {
        transform: 'scale(1.03)',
        maxWidth: '100%',
        minHeight: '400px',
        padding: '25px',
        borderRadius: '50px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',  // softened shadow
        transition: 'transform 0.3s ease-in-out',  // smooth transition for scaling
        cursor: 'pointer',
    },
    inputForm: {
        borderRadius: '20px',
    },
    eyeIcon: {
        position: 'absolute',
        right: '12px',
        top: '40px',
        cursor: 'pointer',
        fontSize: '1.05rem',
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
        backgroundColor: '#007bff',
        transition: 'background-color 0.3s ease-in-out',
    },
};


// Hover effect for the card
// styles.card:hover = {
//     transform: 'scale(1.05)',  // increases size on hover
// };

// styles.button:hover = {
//     backgroundColor: '#0056b3',  // darker blue when button is hovered
// };

export default Signup;
