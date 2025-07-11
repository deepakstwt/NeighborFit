# 🏘️ NeighborFit - Smart Neighborhood Recommendation Platform

<div align="center">
  <h3>🔍 Find Your Perfect Neighborhood Match</h3>
  <p>An AI-powered platform that helps you discover neighborhoods that perfectly fit your lifestyle preferences and requirements.</p>
  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

## 🌟 Features

### 🎯 Core Features
- **Smart Matching Algorithm** - AI-powered neighborhood recommendations based on your preferences
- **Comprehensive Filtering** - Filter by budget, lifestyle, amenities, and more
- **Interactive Maps** - Explore neighborhoods with detailed map integration
- **User Profiles** - Personalized experience with detailed preference settings
- **Email Verification** - Secure OTP-based email verification system
- **Responsive Design** - Beautiful, mobile-first responsive interface

### 🤖 AI-Powered Features
- **AI Chat Assistant** - Get instant help and recommendations
- **Smart Search Enhancement** - Intelligent search with natural language processing
- **Recommendation Engine** - Personalized neighborhood suggestions
- **Preference Learning** - System learns from your interactions

### 🛡️ Security & Authentication
- **OTP Email Verification** - Secure user registration with email verification
- **JWT Authentication** - Secure session management
- **Password Encryption** - Bcrypt-based password hashing
- **Input Validation** - Comprehensive data validation and sanitization

## 🚀 Demo

**Live Demo**: [Coming Soon]

### Screenshots

| Feature | Screenshot |
|---------|------------|
| **Homepage** | Beautiful landing page with hero section |
| **Neighborhood Search** | Advanced filtering and search capabilities |
| **Profile Management** | Comprehensive user preferences |
| **AI Chat Assistant** | Interactive AI-powered assistance |

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending functionality

### Additional Tools
- **Postman** - API testing
- **Git** - Version control
- **VS Code** - Development environment

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/deepakstwt/NeighborFit.git
cd NeighborFit
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd neighborfit/backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Configure your environment variables
# Edit .env file with your database and email configurations
```

### 3. Environment Variables
Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 5. Database Setup
```bash
# Navigate back to backend directory
cd ../backend

# Run database setup (if available)
npm run setup-db
```

## 🚀 Usage

### Starting the Application

1. **Start the Backend Server**
```bash
cd neighborfit/backend
npm start
# or for development
npm run dev
```

2. **Start the Frontend Application**
```bash
cd neighborfit/frontend
npm start
```

3. **Access the Application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### User Journey

1. **Sign Up** - Create account with email verification
2. **Verify Email** - Enter OTP received via email
3. **Complete Profile** - Set preferences and requirements
4. **Explore Neighborhoods** - Browse recommendations
5. **Get AI Assistance** - Use chat for personalized help
6. **Save Favorites** - Bookmark preferred neighborhoods

## 📱 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/verify-email` - Email verification
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences

### Neighborhoods
- `GET /api/neighborhoods` - Get all neighborhoods
- `GET /api/neighborhoods/:id` - Get specific neighborhood
- `POST /api/neighborhoods/search` - Search neighborhoods
- `GET /api/neighborhoods/recommendations` - Get AI recommendations

## 🎨 Project Structure

```
NeighborFit/
├── neighborfit/
│   ├── backend/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── controllers/     # Route controllers
│   │   └── server.js        # Entry point
│   └── frontend/
│       ├── src/
│       │   ├── components/  # Reusable components
│       │   ├── pages/       # Page components
│       │   ├── context/     # React Context
│       │   ├── services/    # API services
│       │   └── utils/       # Utility functions
│       └── public/          # Static assets
├── docs/                    # Documentation
└── README.md               # This file
```

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd neighborfit/backend
npm test

# Frontend tests
cd neighborfit/frontend
npm test
```

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Husky for pre-commit hooks

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📋 Roadmap

- [ ] **Mobile App** - React Native version
- [ ] **Advanced AI Features** - More sophisticated recommendations
- [ ] **Real Estate Integration** - Property listings integration
- [ ] **Social Features** - Community reviews and ratings
- [ ] **Multi-language Support** - Internationalization
- [ ] **Analytics Dashboard** - User behavior insights

## 🐛 Known Issues

- Email verification might be slow during peak hours
- Map loading requires stable internet connection
- Some features may not work on older browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Deepak Prajapati** - Full Stack Developer
- Email: deepakprajapatiproplus@gmail.com
- GitHub: [@deepakstwt](https://github.com/deepakstwt)

## 🙏 Acknowledgments

- Thanks to all contributors and testers
- Inspired by modern neighborhood discovery platforms
- Built with love and lots of coffee ☕

## 📞 Support

Having trouble? We're here to help!

- 📧 Email: deepakprajapatiproplus@gmail.com
- 💬 GitHub Issues: [Create an issue](https://github.com/deepakstwt/NeighborFit/issues)
- 📱 LinkedIn: [Connect with us](https://linkedin.com/in/deepakprajapati)

---

<div align="center">
  <p>Made with ❤️ by Deepak Prajapati</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
