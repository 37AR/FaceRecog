import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Alert from './components/Alert';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SoloRegister from './components/SoloRegister';
import GroupAuth from './components/GroupAuth';
import CrowdCount from './components/CrowdCount';
import SoloVerify from './components/SoloVerify';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [alert, setAlert] = useState(null);
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
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className='container'>
          <Routes>
            <Route exact path="/" element={<Home showAlert={showAlert} />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/login" element={<Login showAlert={showAlert} />} />
            <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
              <Route exact path="/dashboard" element={<ProtectedRoute showAlert={showAlert}> <Dashboard showAlert={showAlert} /> </ProtectedRoute>} />
              <Route exact path="/solo-register" element={<ProtectedRoute showAlert={showAlert}><SoloRegister showAlert={showAlert} /> </ProtectedRoute>} />
              <Route exact path="/solo-verify" element={<ProtectedRoute showAlert={showAlert}>  <SoloVerify showAlert={showAlert} /> </ProtectedRoute>} />
              <Route exact path="/group-auth" element={<ProtectedRoute showAlert={showAlert}> <GroupAuth showAlert={showAlert} /> </ProtectedRoute>} />
              <Route exact path="/crowd-count" element={<ProtectedRoute showAlert={showAlert}> <CrowdCount showAlert={showAlert} /> </ProtectedRoute>} />

          </Routes>
        </div>
      </Router>
    </>
  );
}
export default App;