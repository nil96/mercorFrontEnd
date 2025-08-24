# Mercor Hiring Dashboard

A minimalist application to help select the top 5 candidates from hundreds of job applicants.

## Project Structure

- `/server` - Express.js backend API for filtering candidate data
- `/client` - React frontend application

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Setup Instructions

1. **Start the Backend Server**:
   ```
   cd server
   npm install
   npm start
   ```
   The server will run on http://localhost:5000

2. **Start the Frontend Development Server**:
   ```
   cd client
   npm install
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Features

- Filter candidates by skills, experience, education, and location
- Select up to 5 candidates to build a diverse team
- View team diversity metrics
- Pagination for browsing through candidates

## Project Rationale

This application was built with a minimalist approach, focusing on core functionality while keeping the codebase small and maintainable. The backend handles the heavy lifting of filtering the large dataset, while the frontend provides an intuitive interface for candidate selection.