const styles = {
    container: {
        fontFamily: 'Kumbh Sans',
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        marginTop: '30px',
    },
    profileTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '20px',
        borderBottom: '4px solid #3498db', // Adds a blue border at the bottom
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // gap profile details & addlabel button
        marginBottom: '20px',
    },
    profilePhoto: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    initialsCircle: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#2c3e50',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '36px',
        fontWeight: 'bold',
    },
    profileDetails: {
        flex: 1, // Expands to take available space
        marginLeft: '20px',
        position: 'relative', // For positioning hover elements
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // Space between name and edit button
    },
    name: {
        fontSize: '22px',
        fontWeight: '600',
        color: '#2c3e50',
    },
    editButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#007bff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s ease',
        opacity: 1, // Visible when rendered
    },
    editNameContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    nameInput: {
        fontSize: '16px',
        padding: '5px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    saveButton: {
        padding: '5px 10px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '15px',
        cursor: 'pointer',
    },
    email: {
        fontSize: '16px',
        color: '#555',
    },
    addLabelButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginLeft: 'auto', // Aligns the button to the right
    },
    labelsHeader: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Aligns the arrow
    },
    arrowButton: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: '#007bff',
    },
    labelList: {
        listStyle: 'none',
        padding: '0',
    },
    labelItem: {
        backgroundColor: '#f7f7f7',
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    labelItemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Wraps the label items if there are too many
    },
    labelText: {
        fontSize: '16px',
        fontWeight: '500',
    },
    deleteButton: {
        backgroundColor: '#db2316',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '50px',
        cursor: 'pointer',
    },
    noLabels: {
        fontSize: '16px',
        color: '#555',
    },
    loading: {
        fontSize: '18px',
        textAlign: 'center',
    },
    noData: {
        fontSize: '18px',
        textAlign: 'center',
        color: '#555',
    },
    viewHistoryButton: {
        backgroundColor: 'teal',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '100px',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '20px',
    },
    viewHistoryButtonHover: {
        backgroundColor: '#3aa3a3',
    }
};

export default styles;