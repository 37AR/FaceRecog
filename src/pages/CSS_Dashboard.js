const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%", // 100vh
      width: "100%",
      padding: "20px",
      marginTop: "35px",
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
      transition: "transform 0.3s, box-shadow 0.3s", // Add smooth transition for hover effect
      cursor: "pointer",
    },
    cardHover: {
      transform: "scale(1.05)", // Slight scaling
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)", // Enhanced shadow
    },
    cardTitle: {
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginBottom: "10px",
      textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
    },
    buttonContainer: {
      display: "flex",
      gap: "35px",
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
  
  export default styles;
  