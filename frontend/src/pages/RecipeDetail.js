import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (user && recipe) {
      checkIfFavorite();
    }
  }, [user, recipe]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(res.data);
      
      // Check if user has rated
      if (user) {
        const userRating = res.data.ratings.find(r => r.user._id === user._id);
        if (userRating) {
          setRating(userRating.rating);
        }
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
    setLoading(false);
  };

  const checkIfFavorite = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/collections/favorites');
      setIsFavorite(res.data.some(f => f._id === id));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleRating = async (newRating) => {
    if (!user) {
      alert('Please login to rate recipes');
      return;
    }
    try {
      setRating(newRating);
      await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, { rating: newRating });
      fetchRecipe();
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/collections/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post(`http://localhost:5000/api/collections/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit reviews');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/review`, {
        comment: reviewText,
      });
      setReviewText('');
      fetchRecipe();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="loading">Recipe not found</div>;
  }

  return (
    <div className="recipe-detail">
      <div className="container">
        <Link to="/recipes" className="back-link">← Back to Recipes</Link>

        <div className="recipe-header">
          <div className="recipe-image-large">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.title} />
            ) : (
              <div className="placeholder-image-large">No Image</div>
            )}
          </div>
          <div className="recipe-info-large">
            <h1>{recipe.title}</h1>
            <p className="recipe-description-large">{recipe.description}</p>
            
            <div className="recipe-stats">
              <div className="stat-item">
                <span className="stat-label">Prep Time</span>
                <span className="stat-value">{recipe.prepTime} min</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cook Time</span>
                <span className="stat-value">{recipe.cookTime} min</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Servings</span>
                <span className="stat-value">{recipe.servings}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Difficulty</span>
                <span className="stat-value">{recipe.difficulty}</span>
              </div>
            </div>

            <div className="rating-section">
              <span>Rating: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star"
                  onClick={() => handleRating(star)}
                  style={{ cursor: 'pointer', color: star <= rating ? 'gold' : '#ccc' }}
                >
                  ★
                </span>
              ))}
              <span className="avg-rating">({recipe.averageRating.toFixed(1)} avg)</span>
            </div>

            {user && (
              <button onClick={toggleFavorite} className={isFavorite ? 'favorite-btn active' : 'favorite-btn'}>
                {isFavorite ? '❤️ Saved' : '🤍 Save Recipe'}
              </button>
            )}
          </div>
        </div>

        <div className="recipe-content">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-amount">{ingredient.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          {user && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <textarea
                placeholder="Write a review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                required
              />
              <button type="submit">Submit Review</button>
            </form>
          )}
          <div className="reviews-list">
            {recipe.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <strong>{review.user.name}</strong>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{review.comment}</p>
                {review.photo && <img src={review.photo} alt="Review" className="review-photo" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

