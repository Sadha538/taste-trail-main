# TasteTrail - Recipe Discovery & Meal Planning App

An interactive recipe discovery and meal planning application that helps users discover new dishes based on their dietary preferences, efficiently plan their weekly meals, and automatically generate shopping lists.

## Features

### Core Modules
- **User Profile & Dietary Preferences**: User registration with detailed settings for diet, allergies, and cuisines
- **Smart Recipe Discovery Engine**: Advanced filtering by ingredient, prep time, diet, cuisine, difficulty, and ratings
- **Interactive Meal Planner**: Weekly calendar interface with drag-and-drop functionality
- **Automated Shopping List Generator**: Automatically compiles organized shopping lists from meal plans
- **Recipe Saving & Collections**: Save favorite recipes and organize them into personal collections
- **User Reviews & Ratings**: Community features for rating recipes and uploading photos
- **Admin Panel**: Interface for administrators to add, edit, and manage recipes

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- HTML5 Drag & Drop API
- Responsive CSS

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tastetrail
JWT_SECRET=your_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
tastetrail/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── src/
│   │   ├── models/              # Database models
│   │   │   ├── User.js
│   │   │   ├── Recipe.js
│   │   │   └── MealPlan.js
│   │   ├── controllers/         # Business logic
│   │   │   ├── authController.js
│   │   │   ├── recipeController.js
│   │   │   ├── mealPlanController.js
│   │   │   └── collectionController.js
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── recipeRoutes.js
│   │   │   ├── mealPlanRoutes.js
│   │   │   └── collectionRoutes.js
│   │   └── middleware/
│   │       └── auth.js         # Authentication middleware
│   ├── server.js               # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js        # Navigation component
    │   ├── context/
    │   │   └── AuthContext.js   # Authentication context
    │   ├── pages/               # Page components
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── RecipeList.js
    │   │   ├── RecipeDetail.js
    │   │   ├── MealPlanner.js
    │   │   ├── ShoppingList.js
    │   │   ├── Profile.js
    │   │   ├── Collections.js
    │   │   └── AdminDashboard.js
    │   ├── App.js               # Main app component
    │   └── index.js             # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Recipes
- `GET /api/recipes` - Get all recipes with filters
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (authenticated)
- `PUT /api/recipes/:id` - Update recipe (authenticated)
- `DELETE /api/recipes/:id` - Delete recipe (authenticated)
- `POST /api/recipes/:id/rate` - Rate recipe (authenticated)
- `POST /api/recipes/:id/review` - Add review (authenticated)

### Meal Planning
- `GET /api/mealplan` - Get user meal plan
- `POST /api/mealplan` - Create/update meal plan
- `GET /api/mealplan/shopping-list` - Generate shopping list

### Collections
- `GET /api/collections` - Get user collections
- `GET /api/collections/favorites` - Get favorites
- `POST /api/collections` - Create collection
- `POST /api/collections/favorites/:recipeId` - Add to favorites
- `DELETE /api/collections/favorites/:recipeId` - Remove from favorites

## Key Features Usage

### User Registration & Profile
1. Navigate to `/register` to create an account
2. Select your dietary preferences, allergies, and preferred cuisines
3. Update your profile anytime from `/profile`

### Recipe Discovery
1. Browse recipes at `/recipes`
2. Use filters for cuisine, diet tags, difficulty, and time
3. Search by recipe name or description
4. View detailed recipe pages with ingredients and instructions

### Meal Planning
1. Navigate to `/meal-planner`
2. Select a week to plan
3. Drag recipes from the sidebar to the calendar
4. Drop recipes in the appropriate meal slot (breakfast, lunch, dinner, snack)
5. Remove meals by clicking the 'X' button

### Shopping Lists
1. Navigate to `/shopping-list`
2. Select the week for your meal plan
3. View automatically generated categorized shopping list
4. Check off items as you shop
5. Print the list for shopping trips

### Collections
1. Navigate to `/collections`
2. Save recipes to favorites by clicking the heart icon
3. Create custom collections and organize recipes
4. View all your saved recipes in one place

### Admin Features
1. Login with an admin account
2. Navigate to `/admin`
3. Add, edit, or delete recipes
4. Manage the recipe database

## Week-wise Development Plan

### Week 1
- Set up backend with Express and MongoDB
- Implement user authentication and profile management
- Create recipe CRUD APIs
- Build frontend with React
- Create registration/login UI
- Build recipe browsing pages

### Week 2
- Develop meal planner APIs
- Implement recipe saving/collections feature
- Build recipe discovery page with search and filters
- Add "save recipe" functionality

### Week 3
- Implement shopping list generator logic
- Build APIs for reviews and ratings
- Create drag-and-drop meal planner calendar
- Develop review submission and viewing UI

### Week 4
- Build admin panel APIs
- Create admin dashboard UI
- Develop shopping list display UI
- Finalize UI polish and responsiveness
- Testing and optimization

## Future Enhancements

- Recipe photo uploads
- Social sharing features
- Meal prep tips and guides
- Integration with grocery delivery services
- Nutritional information tracking
- Recipe scaling calculator
- Meal planning templates
- Advanced search with AI recommendations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue in the repository.

