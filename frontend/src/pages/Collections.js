import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Collections.css';

const Collections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collectionsRes, favoritesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/collections'),
        axios.get('http://localhost:5000/api/collections/favorites'),
      ]);
      setCollections(collectionsRes.data);
      setFavorites(favoritesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/collections', {
        name: newCollectionName,
      });
      setNewCollectionName('');
      fetchData();
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  if (!user) {
    return (
      <div className="collections-page">
        <div className="container">
          <h1>My Collections</h1>
          <div className="error-message">Please login to view your collections</div>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-page">
      <div className="container">
        <h1>My Collections</h1>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <section className="favorites-section">
              <h2>Favorites</h2>
              {favorites.length === 0 ? (
                <p className="empty-state">No saved recipes yet</p>
              ) : (
                <div className="recipes-grid">
                  {favorites.map((recipe) => (
                    <Link to={`/recipes/${recipe._id}`} key={recipe._id} className="recipe-card">
                      {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} />
                      ) : (
                        <div className="placeholder-image">No Image</div>
                      )}
                      <h3>{recipe.title}</h3>
                      {recipe.averageRating > 0 && (
                        <p>⭐ {recipe.averageRating.toFixed(1)}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="collections-section">
              <h2>My Collections</h2>
              
              <form onSubmit={createCollection} className="new-collection-form">
                <input
                  type="text"
                  placeholder="Collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <button type="submit">Create Collection</button>
              </form>

              <div className="collections-list">
                {collections.map((collection) => (
                  <div key={collection._id} className="collection-card">
                    <h3>{collection.name}</h3>
                    {collection.recipes.length === 0 ? (
                      <p className="empty-collection">No recipes in this collection</p>
                    ) : (
                      <div className="collection-recipes">
                        {collection.recipes.slice(0, 3).map((recipe) => (
                          <Link
                            to={`/recipes/${recipe._id}`}
                            key={recipe._id}
                            className="collection-recipe"
                          >
                            {recipe.image ? (
                              <img src={recipe.image} alt={recipe.title} />
                            ) : (
                              <div className="mini-placeholder">📷</div>
                            )}
                            <span>{recipe.title}</span>
                          </Link>
                        ))}
                        {collection.recipes.length > 3 && (
                          <p className="more-recipes">+{collection.recipes.length - 3} more</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Collections;

