<div align="center">

# 🏘️ NeighborFit

### 🎯 *Find Your Perfect Neighborhood Match*

AI-powered neighborhood recommendation platform that helps you discover the perfect place to live based on your lifestyle and preferences.

## 🌐 Demo

**Live Demo**: [neighbor-fit-iota.vercel.app](https://neighbor-fit-iota.vercel.app/)

> **Note**: The frontend is deployed and fully functional. The backend is complete and ready for deployment but currently running on local environment. All features including AI recommendations, user authentication, and neighborhood search are implemented.

## 🌟 Features

- **Smart Recommendations**: AI-powered suggestions based on your lifestyle preferences
- **Advanced Search**: Filter by budget, amenities, safety scores, and location
- **AI Assistant**: Chat with our intelligent assistant for personalized help
- **User Profiles**: Save favorites and manage preferences
- **Secure Authentication**: OTP-based email verification
- **Responsive Design**: Beautiful interface on all devices

## 🛠️ Tech Stack

**Frontend**
- React 18
- TailwindCSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer

**Deployment**
- Vercel
- Serverless Functions

## ⚡ Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/deepakstwt/NeighborFit.git
cd NeighborFit

# Setup Backend
cd neighborfit/backend
npm install
cp env.example .env
# Edit .env with your configuration
npm start

# Setup Frontend (in new terminal)
cd ../frontend
npm install
npm start

# Open http://localhost:3000
```

### Environment Configuration

**Backend (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your-super-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 📁 Project Structure

```
🏘️ NeighborFit/
├── 📁 neighborfit/
│   ├── 🖥️ frontend/                    # React Application
│   │   ├── 📁 public/                  # Static assets
│   │   ├── 📁 src/
│   │   │   ├── 🧩 components/          # Reusable Components
│   │   │   │   ├── features/           # Feature components
│   │   │   │   │   ├── auth/           # Authentication components
│   │   │   │   │   ├── dashboard/      # Dashboard components
│   │   │   │   │   ├── explore/        # Explore components
│   │   │   │   │   └── recommendations/ # Recommendation components
│   │   │   │   ├── layout/             # Layout components
│   │   │   │   └── ui/                 # UI components
│   │   │   ├── 📱 pages/               # Page components
│   │   │   ├── 🎨 context/             # React Context
│   │   │   ├── 🔧 lib/                 # API services
│   │   │   └── 🎯 constants/           # App constants
│   │   ├── 🌐 api/                     # Vercel Functions
│   │   ├── 📄 package.json
│   │   └── ⚙️ vercel.json
│   │
│   └── 🔧 backend/                     # Node.js API
│       ├── 📁 src/
│       │   ├── 🗃️ models/              # Database Models
│       │   │   ├── User.js             # User model
│       │   │   └── Neighborhood.js     # Neighborhood model
│       │   ├── 🛣️ routes/              # API Routes
│       │   │   └── api/                # API endpoints
│       │   │       ├── users.js        # User routes
│       │   │       ├── neighborhoods.js # Neighborhood routes
│       │   │       └── recommendations.js # Recommendation routes
│       │   ├── 🛡️ middleware/          # Auth & Validation
│       │   ├── ⚙️ config/              # App Configuration
│       │   └── 🛠️ services/           # Business Logic
│       ├── 🚀 server.js               # Entry Point
│       └── 📄 package.json
│
├── 📝 README.md                       # Project documentation
└── 📄 package.json                    # Root package.json
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/neighborhoods` | Get all neighborhoods |
| `GET` | `/api/neighborhoods/:id` | Get neighborhood details |
| `GET` | `/api/neighborhoods/search/:query` | Search neighborhoods |
| `POST` | `/api/users/register` | Register new user |
| `POST` | `/api/users/login` | User login |
| `POST` | `/api/users/verify-email` | Verify email OTP |
| `GET` | `/api/recommendations/personalized` | AI recommendations |

## 🚀 Deployment

### Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

**Required Environment Variables:**
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Deepak Prajapati**

- GitHub: [@deepakstwt](https://github.com/deepakstwt)
- LinkedIn: [deepakprajapati](https://linkedin.com/in/deepakprajapati)
- Email: deepakprajapatiproplus@gmail.com

---

⭐ **Star this repo if you found it helpful!**

</div>
