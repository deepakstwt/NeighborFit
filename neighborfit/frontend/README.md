# NeighborFit Frontend

React-based frontend application for the NeighborFit platform.

## 🏗️ Architecture

This frontend follows a feature-based architecture with clear separation of concerns:

### Directory Structure

```
src/
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   └── explore/      # Exploration components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Services and utilities
├── pages/                # Static pages
├── constants/            # Application constants
└── types/                # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 📦 Dependencies

### Core Dependencies

- **React** - UI library
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Framer Motion** - Animation library

### Development Dependencies

- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🎨 Design System

### Colors

- Primary: Blue gradient (#3b82f6 to #2563eb)
- Secondary: Green gradient (#22c55e to #16a34a)
- Background: Light gray (#f9fafb)

### Components

All components are organized by feature and follow consistent patterns:

- **UI Components**: Reusable, atomic components
- **Layout Components**: Header, footer, navigation
- **Feature Components**: Business logic components

## 🔄 State Management

The application uses React Context for state management:

- **UserContext**: User authentication and profile data
- **ToastContext**: Toast notifications

## 📱 Responsive Design

The application is fully responsive and follows mobile-first design principles.

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 🚢 Deployment

The frontend is configured for Vercel deployment with automatic deployments from the main branch.

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Submit pull requests for review
