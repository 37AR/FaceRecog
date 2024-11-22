import React from "react";
import { useNavigate } from "react-router-dom";
import soloImage from '../images/solo.jpg';
import groupImage from '../images/y_group.jpg';
import crowdImage from '../images/crowd.webp';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const handleOptionClick = (message, page) => {
    // alert(`${message} clicked!`);
    props.showAlert(`${message}, clicked!`, "success");
    navigate(`/${page}`);
  };

  const handleSoloRegister = () => {
    navigate('/solo-register');
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
            style={{ ...styles.card, backgroundImage: `url(${soloImage})` }}
          // onClick={() => handleOptionClick("Individual Authentication", 'solo-auth')}
          >
            <p style={styles.cardTitle}>Individual Authentication</p>
            <div style={styles.buttonContainer}>
              <button onClick={handleSoloRegister} style={styles.button}>REGISTER</button>
              <button onClick={handleSoloVerify} style={styles.button}>VERIFY</button>
            </div>
          </div>
          <div
            style={{ ...styles.card, backgroundImage: `url(${groupImage})` }}
            onClick={() => handleOptionClick("Group Authentication", "group-auth")}
          >
            <p style={styles.cardTitle}>Group Authentication</p>
            <div style={styles.buttonContainer}>
              <button onClick={handleGroupVerify} style={styles.button}>
                VERIFY
              </button>
            </div>
          </div>
          <div
            style={{ ...styles.card, backgroundImage: `url(${crowdImage})` }}
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  cardContainer: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    fontFamily: "Kumbh Sans",
    fontSize: "2rem",
    fontWeight: "600",
    color: "white",
    width: "350px",
    height: "300px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    position: "relative",
    textAlign: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginBottom: "10px",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  button: {
    fontWeight: "bold",
    textDecoration: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "teal",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  dashboardContainer: {
    marginTop: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  dashboardHeader: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  // Add media query styles
  "@media (max-width: 768px)": {
    cardContainer: {
      flexDirection: "column",
      gap: "20px",
    },
    card: {
      width: "90%",
      height: "250px",
    },
    button: {
      padding: "8px 16px",
      fontSize: "0.9rem",
    },
  },
};


export default Dashboard;
