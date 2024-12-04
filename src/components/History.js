import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CSS_History'; // Import styles from styles.js
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const History = () => {
    const [verificationData, setVerificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateToggle, setDateToggle] = useState('today');

    useEffect(() => {
        const fetchVerificationData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:5000/api/face/verification-history', {
                    headers: {
                        'auth-token': token,
                    },
                });

                // console.log('Raw Data:', response.data.history); // Log raw data

                const sortedData = response.data.history.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setVerificationData(sortedData);
            } catch (error) {
                console.error('Error fetching verification data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVerificationData();
    }, []);

    // Normalize date to midnight in local time
    const normalizeToStartOfDay = (date) => {
        const newDate = new Date(date); // Create a fresh copy
        newDate.setHours(0, 0, 0, 0); // Reset to midnight
        return newDate;
    };

    const groupByDate = (data) => {
        const groupedData = {
            today: [],
            yesterday: [],
            selectedDate: [],
        };

        const today = normalizeToStartOfDay(new Date());
        const yesterday = normalizeToStartOfDay(new Date(today));
        yesterday.setDate(today.getDate() - 1); // Get yesterday's date
        const selected = normalizeToStartOfDay(selectedDate);

        // console.log('Today:', today);
        // console.log('Yesterday:', yesterday);
        // console.log('Selected Date:', selected);

        data.forEach((entry) => {
            const entryDate = normalizeToStartOfDay(new Date(entry.createdAt));

            // console.log('Entry Raw Date:', entry.createdAt);
            // console.log('Entry Date:', entryDate);

            // Compare entry date with today's, yesterday's, and selected date
            if (entryDate.getTime() === today.getTime()) {
                groupedData.today.push(entry);
            } else if (entryDate.getTime() === yesterday.getTime()) {
                groupedData.yesterday.push(entry);
            } else if (entryDate.getTime() === selected.getTime()) {
                console.log('Matched Selected Date!');
                groupedData.selectedDate.push(entry);
            }
        });

        console.log('Grouped Data:', groupedData);
        return groupedData;
    };

    const handleDateChange = (date) => {
        const normalizedDate = normalizeToStartOfDay(date);
        setSelectedDate(normalizedDate);

        // Check if the selected date is today or yesterday
        const today = normalizeToStartOfDay(new Date());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (normalizedDate.getTime() === today.getTime()) {
            setDateToggle('today');
        } else if (normalizedDate.getTime() === yesterday.getTime()) {
            setDateToggle('yesterday');
        } else {
            setDateToggle('selectedDate');
        }

        setShowCalendar(false);
    };

    // Format the date to dd-mm-yyyy
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (loading) {
        return <p style={styles.loading}>Loading verification history...</p>;
    }

    const groupedData = groupByDate(verificationData);

    const getPeriodTitleWithDate = (period) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (period === 'today') return `Today (${formatDate(today)})`;
        if (period === 'yesterday') return `Yesterday (${formatDate(yesterday)})`;
        return `Selected Date (${formatDate(selectedDate)})`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.profileTitle}>Verification History</div>

            {/* Date Selection and Toggle */}
            <div style={styles.dateToggleContainer}>
                <button
                    style={styles.dateToggleButton}
                    onClick={() => setDateToggle('today')}
                >
                    Today
                </button>
                <button
                    style={styles.dateToggleButton}
                    onClick={() => setDateToggle('yesterday')}
                >
                    Yesterday
                </button>
                <button
                    style={styles.selectDateToggleButton}
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    📅 Select Date
                </button>
            </div>

            {/* Calendar for Date Selection */}
            {showCalendar && (
                <div style={styles.calendarWrapper}>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={new Date('2024-08-30')} // Adjust based on your data range
                        maxDate={new Date()} // Current date as max date
                    />
                </div>
            )}

            {/* Display Verification Data */}
            <div style={styles.historySection}>
                <h3 style={styles.historyTitle}>{getPeriodTitleWithDate(dateToggle)}</h3>
                {groupedData[dateToggle].length > 0 ? (
                    <ul style={styles.labelList}>
                        {groupedData[dateToggle].map((entry, index) => (
                            <li key={index} style={styles.labelItem}>
                                <div style={styles.labelTextWrapper}>
                                    <p style={styles.labelText}>
                                        <strong>Label:</strong> {entry.labelName}
                                    </p>
                                    <p style={styles.labelTime}>
                                        <strong>Time:</strong>{' '}
                                        {new Date(entry.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={styles.noData}>
                        No verifications for this period.
                    </p>
                )}
            </div>
        </div>
    );
};

export default History;
