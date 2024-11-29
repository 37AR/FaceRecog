const styles = {
    container: {
      fontFamily: "Kumbh Sans",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      marginTop: '-50px',
      color: "#2c3e50",
    },
    card: {
      width: "100%",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      padding: "20px",
    },
    inputRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      marginBottom: "15px",
    },
    inputGroup: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "5px",
      fontSize: "16px",
      fontWeight: "600",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ddd",
    },
    errorMessage: {
      color: "red",
      marginBottom: "15px",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
    },
    cameraContainer: {
      width: "100%",
      height: "400px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #ddd",
      backgroundColor: "#f7f7f7",
      borderRadius: "8px",
    },
    placeholder: {
      fontSize: "18px",
      color: "#666",
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "8px",
    },
    buttonsRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "20px",
    },
    button: {
      flex: "1", // Ensures buttons have equal width
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      textAlign: "center",
    },
    imageCountContainer: {
      marginBottom: "20px",
      textAlign: "center",
    },
    imageCountText: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
    },
  };


export default styles;