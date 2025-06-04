# Feather - Journalism Platform

Feather is a full-stack web application designed as a modern platform for journalists to publish articles and for readers to discover and engage with content. It features distinct roles for users, journalists, and administrators, each with a tailored set of functionalities.

## Table of Contents

1.  [Overview](#overview)
2.  [Features](#features)
    *   [General User Features](#general-user-features)
    *   [Journalist Features](#journalist-features)
    *   [Admin Features](#admin-features)
3.  [Tech Stack](#tech-stack)
    *   [Frontend](#frontend)
    *   [Backend](#backend)
    *   [Database](#database)
4.  [Project Structure](#project-structure)
5.  [Prerequisites](#prerequisites)
6.  [Setup and Installation](#setup-and-installation)
    *   [Backend Setup](#backend-setup)
    *   [Frontend Setup](#frontend-setup)
7.  [Running the Application](#running-the-application)
    *   [Backend](#backend-1)
    *   [Frontend](#frontend-1)
8.  [Environment Variables](#environment-variables)
9.  [Key API Endpoints](#key-api-endpoints)

## Overview

Feather provides a seamless experience for content creation, management, and consumption. Journalists can craft and submit articles, administrators can moderate content and manage users, and readers can explore articles, interact through likes and comments, and personalize their experience by saving favorites.

## Pictures


## Features
![Screenshot 2025-06-04 193339](https://github.com/user-attachments/assets/e0f231e3-3cd3-45c4-ac87-942dc87be6e0)
![Screenshot 2025-06-04 192948](https://github.com/user-attachments/assets/da3359c5-e796-4123-a0e9-3de6a2dc3c5e)

### General User Features (Subscribers/Readers)

*   **User Registration & Login:** Secure account creation and authentication.
*   **Browse Articles:** View a list of published articles with filtering and potential search capabilities.
*   **View Single Article:** Detailed view of an article, including content, author details, publication date, and read time.
*   **Like Articles:** Ability to like/unlike articles.
*   **Comment on Articles:** Engage in discussions by posting comments.
*   **View Journalist Profiles:** Access public profiles of journalists.
*   **Manage Favorite Articles:** Save and view a list of favorite articles.
*   **Profile Management:** Update personal information (username, email, bio, social media links) and profile picture.

### Journalist Features

*   **All General User Features.**
*   **Create Articles:** A rich text editor or form to write and submit new articles, including title, content, categories, tags, and cover media (image/video).
*   **Manage Own Articles ("My Articles"):** View a list of their submitted articles, track their status (pending, approved, denied), and potentially edit or delete them (depending on status and system rules).

### Admin Features

*   **Admin Dashboard:** Centralized overview of platform statistics (e.g., total users, articles, pending articles, articles by month).
*   **User Management:**
    *   View all registered users with details (username, email, role, status).
    *   Potentially add new users.
    *   Activate/deactivate users.
    *   View detailed user profiles.
*   **Article Management:**
    *   View all articles submitted to the platform.
    *   Filter articles by status (pending, approved, denied).
    *   Approve or deny pending articles.
    *   View detailed article content.
    *   Delete articles.
*   **Comment Management:**
    *   View and moderate comments across articles.
    *   Potentially delete inappropriate comments.

## Tech Stack

### Frontend

*   **Framework/Library:** React 18 (with Vite)
*   **Language:** JavaScript
*   **Styling:** CSS (custom styling, potentially with CSS variables for theming)
*   **UI Components:** Material-UI (`@mui/material`, `@mui/x-data-grid`) for admin interfaces and potentially other components.
*   **Routing:** React Router DOM v6
*   **State Management:** React Context API (`useStateContext`)
*   **HTTP Client:** Axios
*   **Icons:** `react-icons`
*   **Notifications:** `react-toastify`
*   **HTML Parsing:** `html-react-parser` (for rendering article content)
*   **Cookie Management:** `js-cookie`
*   **Build Tool:** Vite

### Backend

*   **Framework:** Node.js with Express.js
*   **Language:** JavaScript
*   **Authentication:** JSON Web Tokens (JWT) using `jsonwebtoken`
*   **Password Hashing:** `bcryptjs`
*   **File Uploads:** `multer` (for user avatars and article media)
*   **CORS:** `cors` package
*   **Environment Variables:** `dotenv`

### Database

*   **Type:** MongoDB
*   **ODM:** Mongoose

## Project Structure

The project is organized into two main directories:

*   `backend/`: Contains the Node.js/Express.js server-side code.
    *   `config/`: Database connection.
    *   `controllers/`: Request handling logic.
    *   `middleware/`: Custom middleware (auth, file uploads).
    *   `models/`: Mongoose schemas and models.
    *   `routes/`: API route definitions.
    *   `uploads/`: (Typically created by `multer`) Directory for storing uploaded files (though often served via `public/uploads` after moving or symlinking).
    *   `public/uploads/`: Statically served uploaded files.
    *   `index.js`: Main server entry point.
*   `project/`: Contains the React frontend application.
    *   `public/`: Static assets.
    *   `src/`: Main source code.
        *   `api/`: Axios instance configuration.
        *   `assets/`: Images, fonts, etc.
        *   `components/`: Reusable UI components.
        *   `contexts/`: React Context providers.
        *   `hooks/`: Custom React hooks.
        *   `pages/`: Top-level page components.
        *   `services/`: API service functions.
        *   `utils/`: Utility functions.
        *   `App.jsx`: Main application component with routing.
        *   `main.jsx`: Frontend entry point.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB (local instance or a cloud-hosted solution like MongoDB Atlas)

## Setup and Installation

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory. Copy the contents of a `.env.example` (if provided) or add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```
    Replace `your_mongodb_connection_string` and `your_jwt_secret_key` with your actual values.
4.  Ensure the `backend/public/uploads/avatars` and other necessary upload subdirectories exist or will be created by the `uploadMiddleware`.

### Frontend Setup

1.  **Navigate to the frontend directory (project):**
    ```bash
    cd project
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `project` directory. Add the following variable:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    Adjust the port if your backend runs on a different one.

## Running the Application

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This typically uses `nodemon` to automatically restart the server on file changes. The backend will usually run on `http://localhost:5000`.

### Frontend

1.  **Navigate to the frontend directory (project):**
    ```bash
    cd project
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend development server (Vite) will usually run on `http://localhost:5173` (or another port if 5173 is busy).

Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

## Environment Variables

### Backend (`backend/.env`)

*   `PORT`: The port the backend server will run on (e.g., 5000).
*   `MONGO_URI`: Your MongoDB connection string.
*   `JWT_SECRET`: A secret key for signing JSON Web Tokens.
*   `NODE_ENV`: Application environment (e.g., `development`, `production`).

### Frontend (`project/.env`)

*   `VITE_API_URL`: The base URL for your backend API (e.g., `http://localhost:5000/api`).

## Key API Endpoints

The backend exposes several RESTful API endpoints under the `/api` prefix:

*   **Authentication (`/api/auth`)**
    *   `POST /register`: User registration.
    *   `POST /login`: User login.
    *   `GET /check`: Check authentication status.
    *   `POST /logout`: User logout.
*   **Users (`/api/users`)**
    *   `GET /`: Get all users (admin).
    *   `GET /journalists`: Get all users with the 'journaliste' role.
    *   `GET /:id`: Get a specific user by ID.
    *   `PUT /profile`: Update the authenticated user's profile.
    *   `PUT /:id`: Update a user by ID (admin).
    *   `DELETE /:id`: Delete a user by ID (admin).
*   **Articles (`/api/articles`)**
    *   `POST /`: Create a new article.
    *   `GET /`: Get all approved articles (for public view).
    *   `GET /all`: Get all articles regardless of status (admin).
    *   `GET /my-articles`: Get articles created by the authenticated journalist.
    *   `GET /:id`: Get a specific article by ID.
    *   `PUT /:id`: Update an article by ID.
    *   `DELETE /:id`: Delete an article by ID.
    *   `PATCH /:id/status`: Update the status of an article (admin).
    *   `POST /:id/like`: Like/unlike an article.
*   **Comments (`/api/comments`)**
    *   `POST /:articleId`: Add a comment to an article.
    *   `GET /article/:articleId`: Get all comments for an article.
    *   `DELETE /:commentId`: Delete a comment (admin or comment owner).

*(Note: Specific endpoint paths and functionalities might vary slightly based on implementation details not fully visible.)*

---

This README provides a good starting point. You can expand on sections like "Contributing," add a "License," or provide more detailed API documentation as needed.
