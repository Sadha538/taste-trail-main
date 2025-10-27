import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    dietaryPreferences: [],
    allergies: [],
    cuisines: [],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        dietaryPreferences: user.dietaryPreferences || [],
        allergies: user.allergies || [],
        cuisines: user.cuisines || [],
      });
    }
  }, [user]);

  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb'];
  const cuisineOptions = ['Italian', 'Mexican', 'Asian', 'Indian', 'French', 'Mediterranean'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData);
      setUser(res.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user.email} disabled />
                <p className="hint">Email cannot be changed</p>
              </div>

              <div className="form-group">
                <label>Dietary Preferences</label>
                <div className="checkbox-group">
                  {dietaryOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={formData.dietaryPreferences.includes(option)}
                        onChange={() => handleCheckboxChange('dietaryPreferences', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Cuisines</label>
                <div className="checkbox-group">
                  {cuisineOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={formData.cuisines.includes(option)}
                        onChange={() => handleCheckboxChange('cuisines', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Allergies</label>
                <input
                  type="text"
                  placeholder="Enter allergies separated by commas"
                  value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(',').map(a => a.trim()).filter(Boolean),
                    });
                  }}
                />
              </div>

              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          </div>

          <div className="profile-stats">
            <h2>My Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{user.favorites?.length || 0}</div>
                <div className="stat-label">Saved Recipes</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user.collections?.length || 0}</div>
                <div className="stat-label">Collections</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user.role === 'admin' ? 'Admin' : 'User'}</div>
                <div className="stat-label">Account Type</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

