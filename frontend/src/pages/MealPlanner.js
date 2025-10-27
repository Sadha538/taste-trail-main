import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MealPlanner.css';

const MealPlanner = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [weekStart, setWeekStart] = useState('');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    if (user) {
      fetchRecipes();
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + 1); // Get Monday
      const weekStartDate = start.toISOString().split('T')[0];
      setWeekStart(weekStartDate);
    }
  }, [user]);

  useEffect(() => {
    if (weekStart) {
      fetchMealPlan();
    }
  }, [weekStart]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchMealPlan = async () => {
    if (!weekStart) return;
    setLoading(true);
    try {
      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const res = await axios.get(`http://localhost:5000/api/mealplan?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      setMealPlan(res.data);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
    setLoading(false);
  };

  const handleDrop = async (day, mealType, recipeId) => {
    if (!recipeId) return;

    const selectedRecipe = recipes.find(r => r._id === recipeId);
    if (!selectedRecipe) return;

    const startDate = new Date(weekStart);
    const dayIndex = days.indexOf(day);
    const mealDate = new Date(startDate);
    mealDate.setDate(mealDate.getDate() + dayIndex);

    const newMeal = {
      date: mealDate.toISOString(),
      mealType,
      recipe: recipeId,
    };

    const currentMeals = mealPlan?.meals || [];
    const updatedMeals = [...currentMeals, newMeal];

    try {
      const res = await axios.post('http://localhost:5000/api/mealplan', {
        week: {
          startDate: startDate.toISOString(),
          endDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        meals: updatedMeals,
      });
      setMealPlan(res.data);
    } catch (error) {
      console.error('Error updating meal plan:', error);
    }
  };

  const removeMeal = async (mealIndex) => {
    const updatedMeals = mealPlan.meals.filter((_, index) => index !== mealIndex);
    
    try {
      const res = await axios.post('http://localhost:5000/api/mealplan', {
        week: {
          startDate: mealPlan.week.startDate,
          endDate: mealPlan.week.endDate,
        },
        meals: updatedMeals,
      });
      setMealPlan(res.data);
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  const getMealsForDay = (day, mealType) => {
    if (!mealPlan?.meals) return [];
    const dayIndex = days.indexOf(day);
    const startDate = new Date(weekStart);
    const mealDate = new Date(startDate);
    mealDate.setDate(mealDate.getDate() + dayIndex);

    return mealPlan.meals.filter(meal => {
      const mealDateObj = new Date(meal.date);
      return mealDateObj.toDateString() === mealDate.toDateString() && meal.mealType === mealType;
    });
  };

  return (
    <div className="meal-planner">
      <div className="container">
        <h1>Meal Planner</h1>
        
        {!user ? (
          <div className="error-message">Please login to use the meal planner</div>
        ) : (
          <>
            <div className="week-selector">
              <label>Select Week: </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
              />
            </div>

            <div className="meal-planner-content">
              <div className="recipes-panel">
                <h2>Available Recipes</h2>
                <div className="recipes-list">
                  {recipes.map((recipe) => (
                    <div key={recipe._id} className="recipe-item">
                      <img
                        src={recipe.image || 'placeholder'}
                        alt={recipe.title}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('recipeId', recipe._id);
                          e.dataTransfer.setData('recipe', JSON.stringify(recipe));
                        }}
                        draggable
                      />
                      <h4>{recipe.title}</h4>
                      <p>{recipe.prepTime + recipe.cookTime} min</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="calendar">
                {loading ? (
                  <div className="loading">Loading meal plan...</div>
                ) : (
                  <table className="meal-calendar">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Breakfast</th>
                        <th>Lunch</th>
                        <th>Dinner</th>
                        <th>Snack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((day) => (
                        <tr key={day}>
                          <td className="day-name">{day}</td>
                          {mealTypes.map((mealType) => (
                            <td
                              key={`${day}-${mealType}`}
                              className="meal-slot"
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('drag-over');
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove('drag-over');
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('drag-over');
                                const recipeId = e.dataTransfer.getData('recipeId');
                                handleDrop(day, mealType, recipeId);
                              }}
                            >
                              {getMealsForDay(day, mealType).map((meal, index) => (
                                <div key={index} className="planned-meal">
                                  <img src={meal.recipe?.image || 'placeholder'} alt={meal.recipe?.title} />
                                  <span>{meal.recipe?.title}</span>
                                  <button onClick={() => removeMeal(mealPlan.meals.indexOf(meal))}>✕</button>
                                </div>
                              ))}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;

