import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If user presses Enter or search term is long enough, navigate to appropriate page
    if (e.key === 'Enter' && value.trim()) {
      performSearch(value.trim());
    }
  };

  const performSearch = (term) => {
    // Determine where to search based on current page or search term characteristics
    if (term.match(/^\d{11}$/)) {
      // If it looks like a mobile number, go to transaction history
      navigate('/transactions');
    } else if (term.toLowerCase().includes('pen') || term.toLowerCase().includes('book') || term.toLowerCase().includes('pencil')) {
      // If it looks like an item name, go to inventory
      navigate('/inventory');
    } else {
      // Default to transaction history for customer names
      navigate('/transactions');
    }
    
    // Store search term in sessionStorage so the target page can use it
    sessionStorage.setItem('searchTerm', term);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          📚 Q & A Book Shop
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            🏠 Dashboard
          </Link>
          <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>
            📦 Inventory
          </Link>
          <Link to="/add-transaction" className={location.pathname === '/add-transaction' ? 'active' : ''}>
            ➕ Record Sale
          </Link>
          <Link to="/transactions" className={location.pathname === '/transactions' ? 'active' : ''}>
            📋 Sales History
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            ℹ️ About
          </Link>
        </div>

        <div className="search-container">
          <input 
            type="search" 
            placeholder="Search inventory, sales, customers..." 
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="user-info">
          <span>Admin: {currentUser?.username}</span>
          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}