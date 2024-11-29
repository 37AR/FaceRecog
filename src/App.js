import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Ensure Router is imported
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Alert from './components/Alert';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SoloRegister from './components/SoloRegister';
import PtmSoloRegister from './components/Ptm_SoloRegister';
import GroupVerify from './components/GroupVerify';
import CrowdCount from './components/CrowdCount';
import SoloVerify from './components/SoloVerify';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import ModelSelection from './components/ModelSelection';


function App() {
  const [alert, setAlert] = useState(null);
  const location = useLocation(); // Access the current location

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  return (
    <>
      {/* Conditionally render Navbar based on current path */}
      {(location.pathname !== '/login' && location.pathname !== '/signup') && <Navbar />}
      <Alert alert={alert} />
      <div className='container'>
        <Routes>
          <Route exact path="/" element={<Home showAlert={showAlert} />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/login" element={<Login showAlert={showAlert} />} />
          <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
          <Route exact path="/dashboard" element={<ProtectedRoute showAlert={showAlert}> <Dashboard showAlert={showAlert} /> </ProtectedRoute>} />
          <Route exact path="/profile" element={<ProtectedRoute showAlert={showAlert}> <UserProfile showAlert={showAlert} /> </ProtectedRoute>} />
          <Route path="/model-selection" element={<ProtectedRoute showAlert={showAlert}><ModelSelection showAlert={showAlert} /> </ProtectedRoute>} />

          <Route exact path="/solo-register" element={<ProtectedRoute showAlert={showAlert}><SoloRegister showAlert={showAlert} /> </ProtectedRoute>} />
          <Route exact path="/solo-register-ptm" element={<ProtectedRoute showAlert={showAlert}><PtmSoloRegister showAlert={showAlert} /> </ProtectedRoute>} />
          <Route exact path="/solo-verify" element={<ProtectedRoute showAlert={showAlert}>  <SoloVerify showAlert={showAlert} /> </ProtectedRoute>} />
          <Route exact path="/group-verify" element={<ProtectedRoute showAlert={showAlert}> <GroupVerify showAlert={showAlert} /> </ProtectedRoute>} />
          <Route exact path="/crowd-count" element={<ProtectedRoute showAlert={showAlert}> <CrowdCount showAlert={showAlert} /> </ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

// Wrap the entire app with BrowserRouter (Router)
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
