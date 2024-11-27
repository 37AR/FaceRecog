import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CSSUserProfile';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [updatedName, setUpdatedName] = useState('');
    const [showEditIcon, setShowEditIcon] = useState(false);
    const [showLabels, setShowLabels] = useState(false); // State to toggle labels visibility

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('token');

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: {
                        'auth-token': token,
                    },
                });

                setUserData(response.data.user);
                setUpdatedName(response.data.user.name);
                setLabels(response.data.labels);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateName = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(
                'http://localhost:5000/api/auth/profile/update-name',
                { name: updatedName },
                {
                    headers: {
                        'auth-token': token,
                    },
                }
            );
            setUserData({ ...userData, name: updatedName });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating name:', error);
        }
    };

    const handleDeleteLabel = async (label) => {
        try {
            const token = sessionStorage.getItem('token');
            const url = `http://localhost:5000/api/face/delete-labels/${label}`;

            await axios.delete(url, {
                headers: {
                    'auth-token': token,
                },
            });

            setLabels(labels.filter((item) => item !== label));
        } catch (error) {
            console.error('Error deleting label:', error);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    };

    if (loading) {
        return <p style={styles.loading}>Loading user data...</p>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.profileTitle}>User Profile</div>
            {userData ? (
                <div>
                    <div style={styles.profileHeader}>
                        {userData.profilePhoto ? (
                            <img
                                src={userData.profilePhoto}
                                alt="Profile"
                                style={styles.profilePhoto}
                            />
                        ) : (
                            <div style={styles.initialsCircle}>
                                {getInitials(userData.name)}
                            </div>
                        )}
                        <div
                            style={styles.profileDetails}
                            onMouseEnter={() => setShowEditIcon(true)}
                            onMouseLeave={() => setShowEditIcon(false)}
                        >
                            {editMode ? (
                                <div style={styles.editNameContainer}>
                                    <input
                                        type="text"
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                        style={styles.nameInput}
                                    />
                                    <button onClick={handleUpdateName} style={styles.saveButton}>
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div style={styles.nameContainer}>
                                    <h3 style={styles.name}>{userData.name}</h3>
                                    {showEditIcon && (
                                        <button
                                            style={styles.editButton}
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✎
                                        </button>
                                    )}
                                </div>
                            )}
                            <p style={styles.email}>Email: {userData.email}</p>
                        </div>
                        <button
                            style={styles.addLabelButton}
                            onClick={() => navigate('/solo-register')}
                        >
                            Add Label
                        </button>
                    </div>

                    <h4 style={styles.labelsHeader}>
                        Your Registered Face Labels
                        <button
                            style={styles.arrowButton}
                            onClick={() => setShowLabels(!showLabels)}
                        >
                            {showLabels ? '▲' : '▼'}
                        </button>
                    </h4>

                    {showLabels && (
                        <ul style={styles.labelList}>
                            {labels.length > 0 ? (
                                labels.map((label, index) => (
                                    <li
                                        key={index}
                                        style={{ ...styles.labelItem, ...styles.labelItemRow }}
                                    >
                                        <span style={styles.labelText}>{label}</span>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDeleteLabel(label)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p style={styles.noLabels}>No labels registered yet.</p>
                            )}
                        </ul>
                    )}
                </div>
            ) : (
                <p style={styles.noData}>No user data available.</p>
            )}
        </div>
    );
};

export default UserProfile;
