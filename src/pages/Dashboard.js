import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import soloImage from '../images/solo.jpg';
import groupImage from '../images/y_group.jpg';
import crowdImage from '../images/crowd.webp';
import styles from './CSS_Dashboard';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseEnter = (card) => {
    setHoveredCard(card);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };
  const handleOptionClick = (message, page) => {
    // alert(`${message} clicked!`);
    props.showAlert(`${message}, clicked!`, "success");
    navigate(`/${page}`);
  };

  const handleSoloRegister = () => {
    navigate('/model-selection');
  };
  const handleSoloVerify = () => {
    navigate('/solo-verify');
  }
  const handleGroupVerify = () => {
    navigate('/group-verify');
  }
  const handleCrowdCount = () => {
    navigate('/crowd-count');
  }
  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.container}>
        <h1
          style={{
            ...styles.header,
            ...styles.dashboardHeader,
            fontSize: '3em',
            fontFamily: "Aldrich",
            fontWeight: "700",
            letterSpacing: "2px",
            color: "#2c3e50", // Professional dark shade
            textDecoration: "none", // Removed underline for formality
            textAlign: "center", // Center-aligned
            borderBottom: "4px solid #3498db",
            paddingBottom: "10px",
            marginBottom: "50px",
            marginTop: '-40px'
          }}
        >
          DASHBOARD
        </h1>

        <div style={styles.cardContainer}>
          <div
            style={{ ...styles.card, ...(hoveredCard === "solo" ? styles.cardHover : {}), backgroundImage: `url(${soloImage})` }}
            onMouseEnter={() => handleMouseEnter("solo")}
            onMouseLeave={handleMouseLeave}
          >
            <p style={styles.cardTitle}>Individual Authentication</p>
            <div style={styles.buttonContainer}>
              <button onClick={handleSoloRegister} style={styles.button}>REGISTER</button>
              <button onClick={handleSoloVerify} style={styles.button}>VERIFY</button>
            </div>
          </div>
          <div
            style={{ ...styles.card, ...(hoveredCard === "group" ? styles.cardHover : {}), backgroundImage: `url(${groupImage})` }}
            onMouseEnter={() => handleMouseEnter("group")}
            onMouseLeave={handleMouseLeave}
          >
            <p style={styles.cardTitle}>Group Authentication</p>
            <div style={styles.buttonContainer}>
              <button onClick={handleGroupVerify} style={styles.button}>
                VERIFY
              </button>
            </div>
          </div>
          <div
            style={{ ...styles.card, ...(hoveredCard === "crowd" ? styles.cardHover : {}), backgroundImage: `url(${crowdImage})` }}
            onMouseEnter={() => handleMouseEnter("crowd")}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleOptionClick("Crowd Counting", "crowd-count")}
          >
            <p style={styles.cardTitle}>Crowd Counting</p>
            <div style={styles.buttonContainer}>
              <button onClick={handleCrowdCount} style={styles.button}>
                COUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
