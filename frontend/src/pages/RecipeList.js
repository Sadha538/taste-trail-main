import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RecipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    dietTag: '',
    difficulty: '',
    maxPrepTime: '',
    maxCookTime: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes();
  }, [filters, page]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      const res = await axios.get(`http://localhost:5000/api/recipes?${params}`);
      setRecipes(res.data.recipes);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1);
  };

  return (
    <div className="recipe-list-page">
      <div className="container">
        <h1>Recipe Discovery</h1>

        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          
          <select name="cuisine" value={filters.cuisine} onChange={handleFilterChange}>
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="Indian">Indian</option>
            <option value="French">French</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>

          <select name="dietTag" value={filters.dietTag} onChange={handleFilterChange}>
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="dairy-free">Dairy-Free</option>
            <option value="keto">Keto</option>
          </select>

          <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading recipes...</div>
        ) : (
          <>
            <div className="recipes-grid">
              {recipes.map((recipe) => (
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
                    <p className="recipe-description">{recipe.description}</p>
                    <div className="recipe-meta">
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span>🍽️ {recipe.servings} servings</span>
                      {recipe.averageRating > 0 && (
                        <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;

