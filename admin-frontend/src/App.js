import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useState, useEffect } from 'react';


function App() {
  const [isLoggedIn, setLogin] = useState(false)
  useEffect(()=>{
    let jwt_token = localStorage.getItem("jwtToken")
    if(jwt_token){
      setLogin(true)
    }
  },[])
  const PrivateRoute = () => {
    return isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
  }
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}>
        </Route>
        <Route path="/login" element={<Login/>}>
        </Route>
        <Route path="/" element={<PrivateRoute/>}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
