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
import PtmSoloVerify from './components/Ptm_SoloVerify';


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
          {/* Home */}
          <Route exact path="/" element={<Home showAlert={showAlert} />} />
          {/* About */}
          <Route exact path="/about" element={<About />} />
          {/* Login */}
          <Route exact path="/login" element={<Login showAlert={showAlert} />} />
          {/* Signup */}
          <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
          {/* Dashboard */}
          <Route exact path="/dashboard" element={<ProtectedRoute showAlert={showAlert}> <Dashboard showAlert={showAlert} /> </ProtectedRoute>} />
          {/* User Profile */}
          <Route exact path="/profile" element={<ProtectedRoute showAlert={showAlert}> <UserProfile showAlert={showAlert} /> </ProtectedRoute>} />
          {/* Model Selection */}
          <Route path="/model-selection/:context" element={<ProtectedRoute showAlert={showAlert}><ModelSelection showAlert={showAlert} /> </ProtectedRoute>} />
          {/* CNN Solo Registration */}
          <Route exact path="/solo-register" element={<ProtectedRoute showAlert={showAlert}><SoloRegister showAlert={showAlert} /> </ProtectedRoute>} />
          {/* PTM Solo Registration */}
          <Route exact path="/solo-register-ptm" element={<ProtectedRoute showAlert={showAlert}><PtmSoloRegister showAlert={showAlert} /> </ProtectedRoute>} />
          {/* CNN Solo Verification */}
          <Route exact path="/solo-verify" element={<ProtectedRoute showAlert={showAlert}>  <SoloVerify showAlert={showAlert} /> </ProtectedRoute>} />
          {/* PTM Solo Verification */}
          <Route exact path="/solo-verify-ptm" element={<ProtectedRoute showAlert={showAlert}>  <PtmSoloVerify showAlert={showAlert} /> </ProtectedRoute>} />
          {/* Group Verification */}
          <Route exact path="/group-verify" element={<ProtectedRoute showAlert={showAlert}> <GroupVerify showAlert={showAlert} /> </ProtectedRoute>} />
          {/* Crowd Counting */}
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
