import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularRecipes();
  }, []);

  const fetchPopularRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes?sortBy=views&limit=6');
      setPopularRecipes(res.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to TasteTrail</h1>
          <p>Discover delicious recipes, plan your meals, and simplify your cooking</p>
          {!user ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Get Started</Link>
              <Link to="/recipes" className="btn-secondary">Browse Recipes</Link>
            </div>
          ) : (
            <Link to="/meal-planner" className="btn-primary">Plan Your Meals</Link>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose TasteTrail?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Recipe Discovery</h3>
              <p>Find recipes tailored to your dietary preferences and allergies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Meal Planning</h3>
              <p>Plan your weekly meals with our interactive drag-and-drop calendar</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Shopping Lists</h3>
              <p>Automatically generate organized shopping lists from your meal plan</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Personal Collections</h3>
              <p>Save your favorite recipes and organize them into collections</p>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-recipes">
        <div className="container">
          <h2>Popular Recipes</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="recipes-grid">
              {popularRecipes.map((recipe) => (
                <Link to={`/recipes/${recipe._id}`} key={recipe._id} className="recipe-card">
                  <div className="recipe-image">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.title} />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </div>
                  <div className="recipe-info">
                    <h3>{recipe.title}</h3>
                    <div className="recipe-meta">
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                      <span>{recipe.servings} servings</span>
                      {recipe.averageRating > 0 && (
                        <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link to="/recipes" className="btn-primary">
              View All Recipes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

