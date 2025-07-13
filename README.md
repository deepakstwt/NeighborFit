# 🏘️ NeighborFit

> **Find Your Perfect Neighborhood Match with AI**

A smart neighborhood recommendation platform that helps you discover the perfect place to live based on your lifestyle preferences and needs.

## 🌐 Live Demo

**🚀 [View Live Demo](https://neighbor-fit-iota.vercel.app/)**

> **💡 Note:** Frontend is fully deployed and functional. Backend is complete with all features implemented but currently running locally. All APIs including authentication, recommendations, and search are ready for production deployment.

---

## ✨ What Makes NeighborFit Special?

<details>
<summary>🤖 <strong>AI-Powered Recommendations</strong></summary>

- Smart suggestions based on your lifestyle preferences
- Learning algorithm that improves over time
- Personalized matches for your unique needs
- Advanced filtering by budget, amenities, and location

</details>

<details>
<summary>🔍 <strong>Intelligent Search</strong></summary>

- Real-time neighborhood data and insights
- Advanced filtering options
- Interactive maps and location details
- Safety scores and community information

</details>

<details>
<summary>🛡️ <strong>Secure & Reliable</strong></summary>

- JWT-based authentication
- OTP email verification
- Secure user data handling
- MongoDB for reliable data storage

</details>

---

## 🛠️ Tech Stack

**Frontend**
```
React 18 • TailwindCSS • Axios • React Router
```

**Backend**
```
Node.js • Express • MongoDB • JWT • Nodemailer
```

**Deployment**
```
Vercel • Serverless Functions
```

---

## 🚀 Quick Start

<details>
<summary>📋 <strong>Prerequisites</strong></summary>

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm package manager

</details>

<details>
<summary>⚡ <strong>Installation</strong></summary>

```bash
# 1. Clone the repository
git clone https://github.com/deepakstwt/NeighborFit.git
cd NeighborFit

# 2. Setup Backend
cd neighborfit/backend
npm install
cp env.example .env
# Configure your .env file
npm start

# 3. Setup Frontend (new terminal)
cd ../frontend
npm install
npm start

# 4. Open http://localhost:3000
```

</details>

<details>
<summary>⚙️ <strong>Environment Setup</strong></summary>

**Backend (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5001/api
```

</details>

---

## 📁 Project Structure

```
🏘️ NeighborFit/
├── 📂 neighborfit/
│   ├── 🖥️ frontend/                 # React Application
│   │   ├── 📂 src/
│   │   │   ├── 🧩 components/       # UI Components
│   │   │   ├── 📱 pages/            # Page Components
│   │   │   ├── 🔧 lib/              # API Services
│   │   │   └── 🎨 context/          # React Context
│   │   └── 🌐 api/                  # Vercel Functions
│   │
│   └── 🔧 backend/                  # Node.js API
│       ├── 📂 src/
│       │   ├── 🗃️ models/           # Database Models
│       │   ├── 🛣️ routes/           # API Routes
│       │   ├── 🛡️ middleware/       # Authentication
│       │   └── ⚙️ config/           # Configuration
│       └── 🚀 server.js             # Entry Point
```

---

## 🔗 API Endpoints

<details>
<summary>👥 <strong>User Management</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Register new user |
| `POST` | `/api/users/login` | User login |
| `POST` | `/api/users/verify-email` | Email verification |

</details>

<details>
<summary>🏠 <strong>Neighborhoods</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/neighborhoods` | Get all neighborhoods |
| `GET` | `/api/neighborhoods/:id` | Get specific neighborhood |
| `GET` | `/api/neighborhoods/search/:query` | Search neighborhoods |

</details>

<details>
<summary>🤖 <strong>AI Recommendations</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recommendations/personalized` | Get AI recommendations |

</details>

---

## 🌟 Features

- ✅ **Smart Recommendations** - AI-powered neighborhood matching
- ✅ **Advanced Search** - Filter by budget, amenities, location
- ✅ **User Authentication** - Secure login with email verification
- ✅ **Interactive Chat** - AI assistant for personalized help
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Data** - Live neighborhood information

---

## 🚀 Deployment

<details>
<summary>🌐 <strong>Deploy to Vercel</strong></summary>

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables**
4. **Deploy!**

Required environment variables:
```
MONGODB_URI=your-mongodb-connection
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

</details>

---

## 🤝 Contributing

<details>
<summary>💡 <strong>How to Contribute</strong></summary>

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**We welcome:**
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements

</details>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Deepak Prajapati**

- 🐙 GitHub: [@deepakstwt](https://github.com/deepakstwt)
- 💼 LinkedIn: [deepakprajapati](https://linkedin.com/in/deepakprajapati)
- 📧 Email: deepakprajapatiproplus@gmail.com

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and lots of ☕

</div>
