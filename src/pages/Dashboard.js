import React from "react";
import { useNavigate } from "react-router-dom";

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
  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.container}>
        <h1 style={{ ...styles.header, ...styles.dashboardHeader, fontFamily: 'monospace', textDecoration: 'underline' }}>
          Dashboard
        </h1>

        <div style={styles.cardContainer}>
          <div
            style={styles.card}
          // onClick={() => handleOptionClick("Individual Authentication", 'solo-auth')}
          >
            <p style={{fontFamily: 'revert-layer'}}>Individual Authentication</p>
            <div style={styles.buttonContainer}>
              <button onClick={handleSoloRegister} style={styles.button}>REGISTER</button>
              <button onClick={handleSoloVerify} style={styles.button}>VERIFY</button>
            </div>

          </div>
          <div
            style={styles.card}
            onClick={() => handleOptionClick("Group Authentication", 'group-auth')}
          >
            Group Authentication
          </div>
          <div
            style={styles.card}
            onClick={() => handleOptionClick("Crowd Counting", 'crowd-count')}
          >
            Crowd Counting
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
    fontFamily: 'Serif Sans',
  },
  header: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  cardContainer: {
    display: "flex",
    gap: "100px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    fontFamily: 'Kumbh Sans',
    marginTop: "30px",
    width: "350px",
    height: "150px",
    backgroundColor: "teal",
    color: "white",
    display: "flex",
    flexDirection: "column",  // Ensure text and buttons stack vertically
    justifyContent: "flex-start",  // Align content at the top
    alignItems: "center",
    fontSize: "1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
    padding: "20px",  // Adds padding inside the card for better spacing
  },
  dashboardContainer: {
    marginTop: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  dashboardHeader: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
    textDecoration: "underline",
  },
  buttonContainer: {
    justifyContent: 'space-between',
    marginTop: '15px',  // Adds space between the text and the buttons
    display: 'flex',
    gap: '15px',  // Adjust the gap between the buttons
    width: "100%",  // Ensure buttons stretch across the card if desired
  },
  button: {
    textDecoration: 'double',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: 'white',
    color: 'teal',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default Dashboard;
