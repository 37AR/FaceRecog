import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import user icon from React Icons

const Navbar = () => {
    let navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };
    let location = useLocation();

    return (
        <div style={styles.navbar}>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link style={styles.title} className="navbar-brand" to="/">FaceRecs</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                                    to="/"
                                    style={location.pathname === "/" ? styles.activeNavLink : styles.navLink}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                                    to="/dashboard"
                                    style={location.pathname === "/dashboard" ? styles.activeNavLink : styles.navLink}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                                    to="/about"
                                    style={location.pathname === "/about" ? styles.activeNavLink : styles.navLink}
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            {sessionStorage.getItem('token') ? (
                                <>
                                    <Link to="/profile" style={{ textDecoration: "none", marginRight: "10px" }}>
                                        <FaUserCircle size={50} color="teal" style={styles.userIcon} />
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-primary"
                                        style={styles.button}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <form className="d-flex" role="search">
                                    <Link
                                        className="btn btn-primary mx-1"
                                        to="/login"
                                        role="button"
                                        style={styles.button}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        className="btn btn-primary mx-1"
                                        to="/signup"
                                        role="button"
                                        style={styles.button}
                                    >
                                        Signup
                                    </Link>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

const styles = {
    navbar: {
        fontFamily: 'Lexend',
        fontSize: '20px',
    },
    title: {
        color: 'teal',
        fontSize: '40px',
        fontFamily: 'Bruno Ace SC',
        borderBottom: "4px solid teal",
    },
    navLink: {
        color: '#555',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '5px',
        transition: 'color 0.3s, border-bottom 0.3s',
    },
    activeNavLink: {
        color: '#3498db',
        borderBottom: '2px solid #3498db',
        paddingBottom: '5px',
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        transition: 'background-color 0.3s, transform 0.3s',
        cursor: 'pointer',
        margin: '10px'
    },
    userIcon: {
        margin: '10px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, color 0.3s ease', // Smoother transition with color change
        '&:hover': {
            transform: 'scale(1.1)', // Slight zoom effect on hover
            color: '#16a085', // Color change on hover (teal shade)
        },
    }
    ,
};

export default Navbar;
