import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          TasteTrail
        </Link>
        <div className="nav-links">
          <Link to="/recipes">Recipes</Link>
          {user ? (
            <>
              <Link to="/meal-planner">Meal Planner</Link>
              <Link to="/shopping-list">Shopping List</Link>
              <Link to="/collections">Collections</Link>
              {user.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}
              <Link to="/profile">{user.name}</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

