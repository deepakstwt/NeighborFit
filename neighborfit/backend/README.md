# NeighborFit Backend

Node.js backend API for the NeighborFit platform.

## 🏗️ Architecture

This backend follows a clean architecture pattern with clear separation of concerns:

### Directory Structure

```
src/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Express middleware
├── models/             # Database models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
└── validators/         # Input validation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Environment Variables

Configure the following variables in your `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/neighborfit

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000
```

## 📦 Dependencies

### Core Dependencies

- **Express** - Web application framework
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **nodemailer** - Email sending
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Dependencies

- **nodemon** - Development server auto-restart
- **ESLint** - Code linting
- **Jest** - Testing framework

## 🗄️ Database Models

### User Model

```javascript
{
  name: String,
  email: String,
  password: String,
  preferences: {
    workStyle: String,
    familySize: Number,
    budget: Number,
    lifestyle: String
  },
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}
```

### Neighborhood Model

```javascript
{
  name: String,
  city: String,
  description: String,
  averageRent: Number,
  safetyScore: Number,
  transportScore: Number,
  amenities: [String],
  coordinates: {
    lat: Number,
    lng: Number
  }
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- **Registration**: POST `/api/users/register`
- **Login**: POST `/api/users/login`
- **Email Verification**: GET `/api/users/verify/:token`
- **Password Reset**: POST `/api/users/forgot-password`

## 📚 API Endpoints

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Neighborhoods

- `GET /api/neighborhoods` - Get all neighborhoods
- `GET /api/neighborhoods/:id` - Get neighborhood by ID
- `POST /api/neighborhoods` - Create neighborhood (admin)
- `PUT /api/neighborhoods/:id` - Update neighborhood (admin)
- `DELETE /api/neighborhoods/:id` - Delete neighborhood (admin)

### Preferences

- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

## 🛡️ Security

### Implemented Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data protection

### Security Headers

- **Helmet**: Security headers middleware
- **Rate Limiting**: API rate limiting
- **Input Sanitization**: XSS protection

## 🧪 Testing

Run tests with:

```bash
npm test
```

### Test Categories

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: JWT and auth flow testing

## 📊 Monitoring

### Logging

- **Morgan**: HTTP request logging
- **Winston**: Application logging (planned)

### Health Checks

- `GET /health` - Application health status
- `GET /api/status` - API status and version

## 🚢 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   ```

2. **Database Migration**
   ```bash
   npm run migrate
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update API documentation
4. Submit pull requests for review

### Code Style

- **ESLint Configuration**: Airbnb style guide
- **Prettier**: Code formatting
- **Naming Conventions**: camelCase for variables, PascalCase for classes

## 📈 Performance

### Optimization Features

- **Database Indexing**: Optimized queries
- **Response Caching**: Redis caching (planned)
- **Connection Pooling**: MongoDB connection optimization
- **Compression**: Gzip compression middleware

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection**: Check MONGODB_URI
2. **JWT Secret**: Ensure JWT_SECRET is set
3. **Email Configuration**: Verify SMTP settings
4. **Port Conflicts**: Check if PORT is available

### Debug Mode

```bash
DEBUG=* npm run dev
``` 