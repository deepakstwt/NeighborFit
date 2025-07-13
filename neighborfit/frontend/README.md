# NeighborFit Frontend

React-based frontend application for the NeighborFit platform.

## Setup

### Prerequisites
- Node.js (v14+)
- npm

### Installation
```bash
npm install
npm start
```

## Environment Variables
Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features
- 🏠 **Dashboard** - Personalized neighborhood recommendations
- 🔍 **Explore** - Browse and search neighborhoods
- 🤖 **AI Assistant** - Get neighborhood suggestions
- 👤 **User Profile** - Manage preferences and favorites
- 📱 **Responsive Design** - Works on all devices

## Tech Stack
- React 18
- React Router
- TailwindCSS
- Axios
- Context API

## Project Structure
```
src/
├── components/features/  # Feature components
├── components/layout/    # Layout components
├── components/ui/        # Reusable UI components
├── context/             # React Context
├── lib/                 # API services
├── pages/               # Static pages
└── constants/           # Constants
```
