# TasteTrail Setup Guide

## Quick Start

Follow these steps to get TasteTrail up and running on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## Step-by-Step Setup

### 1. MongoDB Setup

1. Install MongoDB on your system
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically after installation
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Verify MongoDB is running: Open a terminal and type `mongod --version`

### 2. Backend Setup

1. Open terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend directory with the following content:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/tastetrail
   JWT_SECRET=your_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. You should see: `Server running on port 5000`
7. Keep this terminal open

### 3. Frontend Setup

1. Open a **NEW** terminal/command prompt window
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

5. Your browser should automatically open to `http://localhost:3000`

## First Use

### Creating an Admin Account (Optional)

To create an admin account for recipe management:

1. Register a new account at `http://localhost:3000/register`
2. In MongoDB shell or Compass, update the user's role:
   ```javascript
   use tastetrail
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Creating Sample Data

You can add sample recipes through the Admin Dashboard after logging in with an admin account, or insert directly into MongoDB.

## Testing the Application

### User Flow Testing

1. **Registration & Login**
   - Go to `/register` to create an account
   - Select dietary preferences and allergies
   - Login at `/login`

2. **Recipe Discovery**
   - Browse recipes at `/recipes`
   - Use filters to search by cuisine, diet, difficulty
   - Click on a recipe to view details

3. **Meal Planning**
   - Navigate to `/meal-planner`
   - Select a week
   - Drag recipes from sidebar to calendar
   - Remove meals by clicking 'X'

4. **Shopping List**
   - Go to `/shopping-list`
   - Select the week you planned meals
   - View automatically generated list
   - Check off items as you shop

5. **Collections**
   - Go to `/collections`
   - View your saved favorites
   - Create custom collections

## Troubleshooting

### MongoDB Connection Error

**Problem**: `MongoError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**: 
- Ensure MongoDB is running: `mongod --version`
- Check if MongoDB service is started
- Verify connection string in `.env` file

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
- Change the PORT in backend `.env` file
- Or close the process using port 5000:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - macOS/Linux: `lsof -ti:5000 | xargs kill -9`

### Module Not Found Errors

**Problem**: `Cannot find module...`

**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again in the directory with the error

### CORS Error

**Problem**: Cross-origin requests blocked

**Solution**:
- Ensure backend is running on port 5000
- Verify frontend API calls point to `http://localhost:5000`
- Check backend CORS configuration in `server.js`

### React App Not Starting

**Problem**: `Missing script: "start"`

**Solution**:
- Ensure you're in the `frontend` directory
- Run `npm install` to install dependencies
- Check `package.json` for scripts

## Production Deployment

### Backend Deployment (Heroku example)

1. Create a `Procfile` in backend directory:
   ```
   web: node server.js
   ```

2. Set environment variables:
   - PORT: auto-assigned by Heroku
   - MONGO_URI: your MongoDB Atlas connection string
   - JWT_SECRET: strong secret key
   - NODE_ENV: production

3. Deploy to Heroku

### Frontend Deployment (Netlify/Vercel example)

1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` folder to your hosting service

3. Update API URLs in production environment

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review the troubleshooting section above

## Next Steps

- Add more recipes to your database
- Customize UI styling
- Add new features (photo uploads, social sharing, etc.)
- Implement advanced filters and search
- Add nutritional information tracking

Happy Cooking! 👨‍🍳👩‍🍳

