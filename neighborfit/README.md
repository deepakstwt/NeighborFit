# NeighborFit

A comprehensive neighborhood discovery and fitness platform that helps users find and connect with their ideal communities.

## 🏗️ Project Structure

```
neighborfit/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/    # Feature-specific components
│   │   │   │   ├── auth/    # Authentication components
│   │   │   │   ├── dashboard/  # Dashboard components
│   │   │   │   └── explore/    # Exploration components
│   │   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   │   └── ui/          # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and services
│   │   ├── pages/           # Static pages
│   │   ├── constants/       # Application constants
│   │   └── types/           # TypeScript types (if applicable)
│   └── public/
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── validators/      # Input validation
│   └── server.js            # Application entry point
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neighborfit.git
   cd neighborfit
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cd backend
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm start
   ```

## 🛠️ Development

### Backend Development

- **Start development server**: `npm run dev`
- **Run tests**: `npm test`
- **Database operations**: Check `src/utils/` for database utilities

### Frontend Development

- **Start development server**: `npm start`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`

## 📚 API Documentation

The API documentation is available at `/api/docs` when running the development server.

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🚢 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment. See `vercel.json` for configuration.

### Backend (Production)
Set up environment variables and deploy to your preferred platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team. 