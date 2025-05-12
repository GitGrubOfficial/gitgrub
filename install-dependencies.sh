#!/bin/bash

# Script to install dependencies for both frontend and backend

echo "📦 Installing GitGrub dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo "✅ All dependencies installed successfully!"