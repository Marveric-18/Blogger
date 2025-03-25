// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Blogs from './pages/Blogs';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import AddBlogPost from './pages/AddBlogPost';
import BlogPost from './components/BlogPost';
import Register from './pages/Register';


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Blogs />
            </PrivateRoute>
          }
        />
         <Route
          path="/create"
          element={
            <PrivateRoute>
              <AddBlogPost />
            </PrivateRoute>
          }
        />
         <Route
          path="/blog/:id"
          element={
            <PrivateRoute>
              <BlogPost />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
