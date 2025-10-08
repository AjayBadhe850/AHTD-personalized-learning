# 🚀 Deployment Instructions

## AI Learning Platform - Authentication System

This guide covers deploying your AI Learning Platform authentication system to GitHub Pages (frontend) and Render/Railway (backend).

## 📋 Prerequisites

- GitHub account
- Render or Railway account
- Node.js installed locally
- Git installed

## 🗄️ Database Setup (SQLite)

The system uses SQLite for simplicity and easy deployment. The database is automatically created when the server starts.

### Database Schema:
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sample User:
- **Username**: `demo`
- **Password**: `password123`

## 🖥️ Local Development

### 1. Install Dependencies
```bash
npm install express sqlite3 bcrypt cors
```

### 2. Start the Server
```bash
node auth-server.js
```

### 3. Access the Application
- **Login Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **API Health**: http://localhost:3000/api/health

## 🌐 Frontend Deployment (GitHub Pages)

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: AI Learning Platform Auth System"
git branch -M main
git remote add origin https://github.com/yourusername/ai-learning-platform.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Save settings

### 3. Update CORS Settings
In `auth-server.js`, update the CORS origins:
```javascript
origin: [
    'http://localhost:3000',
    'https://yourusername.github.io',  // Replace with your GitHub Pages URL
    /^https:\/\/.*\.github\.io$/,
]
```

## ⚡ Backend Deployment (Render)

### 1. Prepare for Deployment
Create a `render.yaml` file:
```yaml
services:
  - type: web
    name: ai-learning-platform-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node auth-server.js
    envVars:
      - key: NODE_ENV
        value: production
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node auth-server.js`
   - **Environment**: Node.js
5. Deploy

### 3. Update Frontend API URLs
Update the fetch URLs in `login.html` to point to your Render backend:
```javascript
const response = await fetch('https://your-app-name.onrender.com/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
});
```

## 🚂 Alternative: Railway Deployment

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Deploy
```bash
railway login
railway init
railway up
```

### 3. Configure Environment
- Set `NODE_ENV=production` in Railway dashboard
- Railway will automatically detect the Node.js app

## 🔧 Environment Variables

### Production Environment Variables:
```env
NODE_ENV=production
PORT=3000
```

## 📁 Project Structure

```
ai-learning-platform/
├── auth-server.js          # Express.js backend server
├── login.html              # Login page (frontend)
├── dashboard.html          # Dashboard page (frontend)
├── users.db                # SQLite database (auto-created)
├── package.json            # Node.js dependencies
├── DEPLOYMENT.md           # This file
└── README.md               # Project documentation
```

## 🔐 Security Considerations

### Production Security:
1. **Environment Variables**: Use environment variables for sensitive data
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **Input Validation**: Validate all user inputs
5. **Password Requirements**: Enforce strong password policies

### Example Security Enhancements:
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

app.use('/api/login', limiter);
```

## 🧪 Testing

### Test Login Credentials:
- **Username**: `demo`
- **Password**: `password123`

### API Endpoints:
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/health` - Health check

### Test with curl:
```bash
# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"password123"}'

# Test registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"newpass123"}'
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS origins in `auth-server.js`
2. **Database Issues**: Ensure SQLite database file is writable
3. **Port Conflicts**: Change PORT environment variable
4. **Build Failures**: Check Node.js version compatibility

### Debug Mode:
Add console logs to track issues:
```javascript
console.log('🔐 Login attempt:', req.body.username);
console.log('✅ Login successful:', username);
```

## 📞 Support

For issues or questions:
1. Check the console logs
2. Verify environment variables
3. Test API endpoints with curl
4. Check database connectivity

## 🎯 Next Steps

1. **Session Management**: Add JWT tokens for session management
2. **Password Reset**: Implement password reset functionality
3. **User Profiles**: Add user profile management
4. **Email Verification**: Add email verification for registration
5. **Admin Panel**: Create admin interface for user management

---

**Happy Deploying! 🚀**

