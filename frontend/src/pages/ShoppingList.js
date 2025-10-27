import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ShoppingList.css';

const ShoppingList = () => {
  const { user } = useAuth();
  const [shoppingList, setShoppingList] = useState({});
  const [weekStart, setWeekStart] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + 1);
      const weekStartDate = start.toISOString().split('T')[0];
      setWeekStart(weekStartDate);
    }
  }, [user]);

  useEffect(() => {
    if (weekStart) {
      fetchShoppingList();
    }
  }, [weekStart]);

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const res = await axios.get(
        `http://localhost:5000/api/mealplan/shopping-list?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      setShoppingList(res.data.shoppingList || {});
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="shopping-list-page">
        <div className="container">
          <h1>Shopping List</h1>
          <div className="error-message">Please login to view your shopping list</div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(shoppingList);

  return (
    <div className="shopping-list-page">
      <div className="container">
        <h1>Shopping List</h1>
        
        <div className="week-selector">
          <label>Select Week: </label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Generating shopping list...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p>No meal plan found for this week. Plan your meals first!</p>
          </div>
        ) : (
          <div className="shopping-list">
            {categories.map((category) => (
              <div key={category} className="category-section">
                <h2 className="category-header">{category}</h2>
                <ul className="ingredients-list">
                  {shoppingList[category].map((item, index) => (
                    <li key={index} className="ingredient-item">
                      <input type="checkbox" id={`item-${category}-${index}`} />
                      <label htmlFor={`item-${category}-${index}`}>
                        <span className="ingredient-name">{item.name}</span>
                        <span className="ingredient-amount">{item.amount}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <button className="print-btn" onClick={() => window.print()}>
          Print Shopping List
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;

