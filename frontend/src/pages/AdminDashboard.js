import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    cuisine: '',
    image: '',
    ingredients: [{ name: '', amount: '', category: '' }],
    instructions: [''],
    dietTags: [],
  });

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const ingredients = [...formData.ingredients];
    ingredients[index][field] = value;
    setFormData({ ...formData, ingredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: '', category: '' }],
    });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecipe) {
        await axios.put(`http://localhost:5000/api/recipes/${editingRecipe._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/recipes', formData);
      }
      setShowForm(false);
      setEditingRecipe(null);
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      difficulty: 'Easy',
      cuisine: '',
      image: '',
      ingredients: [{ name: '', amount: '', category: '' }],
      instructions: [''],
      dietTags: [],
    });
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`);
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const editRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      image: recipe.image || '',
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      dietTags: recipe.dietTags || [],
    });
    setShowForm(true);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <div className="error-message">Access denied. Admin only.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={() => { setShowForm(!showForm); resetForm(); setEditingRecipe(null); }} className="btn-primary">
            {showForm ? 'Cancel' : 'Add Recipe'}
          </button>
        </div>

        {showForm && (
          <div className="recipe-form-modal">
            <form onSubmit={handleSubmit} className="recipe-form">
              <h2>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Cuisine</label>
                  <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prep Time (min)</label>
                  <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Cook Time (min)</label>
                  <input type="number" name="cookTime" value={formData.cookTime} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Servings</label>
                  <input type="number" name="servings" value={formData.servings} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-input">
                    <input
                      type="text"
                      placeholder="Name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={ingredient.category}
                      onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" onClick={addIngredient} className="btn-secondary">Add Ingredient</button>
              </div>

              <div className="form-group">
                <label>Instructions</label>
                {formData.instructions.map((instruction, index) => (
                  <textarea
                    key={index}
                    placeholder={`Step ${index + 1}`}
                    value={instruction}
                    onChange={(e) => {
                      const instructions = [...formData.instructions];
                      instructions[index] = e.target.value;
                      setFormData({ ...formData, instructions });
                    }}
                  />
                ))}
                <button type="button" onClick={addInstruction} className="btn-secondary">Add Step</button>
              </div>

              <button type="submit" className="btn-primary">Save Recipe</button>
            </form>
          </div>
        )}

        <div className="recipes-list">
          {loading ? (
            <div className="loading">Loading recipes...</div>
          ) : (
            <table className="recipes-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Cuisine</th>
                  <th>Difficulty</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe._id}>
                    <td>{recipe.title}</td>
                    <td>{recipe.cuisine}</td>
                    <td>{recipe.difficulty}</td>
                    <td>⭐ {recipe.averageRating.toFixed(1)}</td>
                    <td>
                      <button onClick={() => editRecipe(recipe)} className="btn-edit">Edit</button>
                      <button onClick={() => deleteRecipe(recipe._id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

