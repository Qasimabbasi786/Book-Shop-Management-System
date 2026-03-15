import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./components/Home";
import About from "./components/About";
import Inventory from "./components/Inventory";
import AddTransaction from "./components/AddTransaction";
import TransactionHistory from "./components/TransactionHistory";
import Signup from "./components/Signup";
import Login from "./components/Login";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <Navbar 
            currentUser={currentUser} 
            onLogout={handleLogout} 
          />
        )}
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/signup" 
            element={
              !isAuthenticated ? 
              <Signup onLogin={handleLogin} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Home /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/about" 
            element={
              isAuthenticated ? 
              <About /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/inventory" 
            element={
              isAuthenticated ? 
              <Inventory /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/add-transaction" 
            element={
              isAuthenticated ? 
              <AddTransaction /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/transactions" 
            element={
              isAuthenticated ? 
              <TransactionHistory /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;