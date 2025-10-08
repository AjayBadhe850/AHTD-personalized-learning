# AI Learning Platform - Authentication System

A complete authentication system for the AI Learning Platform built with Node.js, Express.js, SQLite, and bcrypt for secure password hashing.

## 🚀 Features

- **Secure Authentication**: Username/password login with bcrypt password hashing
- **User Registration**: Create new accounts with validation
- **SQLite Database**: Lightweight, file-based database for user storage
- **Modern UI**: Responsive login page with Google Fonts and Font Awesome icons
- **CORS Enabled**: Ready for deployment to GitHub Pages + backend hosting
- **Session Management**: Simple localStorage-based session handling
- **Demo User**: Pre-created demo account for testing

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Authentication**: bcrypt for password hashing
- **Styling**: Google Fonts (Poppins, Open Sans), Font Awesome icons
- **No Frameworks**: Pure vanilla JavaScript, no React or authentication libraries

## 📁 Project Structure

```
├── auth-server.js          # Main authentication server
├── login.html              # Login page with registration modal
├── dashboard.html          # User dashboard after login
├── users.db               # SQLite database (auto-created)
├── test-auth.js           # Test script for authentication
├── package.json           # Dependencies and scripts
└── README-AUTH.md         # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Authentication Server

```bash
node auth-server.js
```

The server will start on `http://localhost:3001`

### 3. Access the Application

- **Login Page**: http://localhost:3001
- **Dashboard**: http://localhost:3001/dashboard (after login)

### 4. Demo Credentials

```
Username: demo
Password: password123
```

## 🔧 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | User login |
| GET | `/api/user/:username` | Get user information |
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/health` | Health check |

### Example API Usage

#### Register a new user:
```javascript
fetch('http://localhost:3001/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'newuser',
        password: 'password123'
    })
})
```

#### Login:
```javascript
fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'demo',
        password: 'password123'
    })
})
```

## 🧪 Testing

Run the test suite to verify the authentication system:

```bash
node test-auth.js
```

The test script will:
- ✅ Test health check
- ✅ Test user registration
- ✅ Test user login
- ✅ Test demo user login
- ✅ Test user info retrieval
- ✅ Test invalid login attempts
- ✅ Test duplicate registration prevention

## 🎨 Frontend Features

### Login Page (`login.html`)
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Gradient background with floating animations
- **Form Validation**: Client-side validation for required fields
- **Loading States**: Visual feedback during API calls
- **Alert System**: Success/error messages with auto-hide
- **Registration Modal**: In-page registration without navigation
- **Demo Credentials**: Displayed for easy testing

### Dashboard Page (`dashboard.html`)
- **Welcome Section**: Personalized greeting
- **Statistics Cards**: Learning progress overview
- **Quick Actions**: Navigation to platform features
- **Session Management**: Automatic logout and redirect
- **Responsive Layout**: Mobile-friendly design

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds (10)
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: No sensitive information in error messages

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
);
```

## 🚀 Deployment

### Frontend (GitHub Pages)
1. Push the `login.html` and `dashboard.html` files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Update API URLs in the HTML files to point to your backend

### Backend (Render/Railway)
1. Create a new project on Render or Railway
2. Connect your GitHub repository
3. Set the start command: `node auth-server.js`
4. The SQLite database will be created automatically

### Environment Variables
```bash
PORT=3001  # Optional, defaults to 3001
```

## 🔧 Configuration

### CORS Origins
The server is configured to accept requests from:
- `http://localhost:3000` and `http://localhost:3001`
- GitHub Pages domains (`*.github.io`)
- Vercel and Netlify domains

### Password Requirements
- Minimum 6 characters
- Username minimum 3 characters
- No special character requirements (can be customized)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite3 is installed: `npm install sqlite3`
   - Check file permissions in the project directory

2. **CORS Errors**
   - Verify the frontend URL is in the CORS origins list
   - Check that the API calls use the correct server URL

3. **Login Not Working**
   - Check browser console for errors
   - Verify the server is running on the correct port
   - Test with demo credentials first

4. **Registration Fails**
   - Check username length (minimum 3 characters)
   - Check password length (minimum 6 characters)
   - Ensure username is unique

### Debug Mode
Enable detailed logging by checking the server console output. All authentication attempts are logged with timestamps.

## 📝 Development Notes

- The system uses localStorage for session management (simple approach)
- For production, consider implementing JWT tokens or server-side sessions
- The demo user is automatically created on first server start
- Database file (`users.db`) is created automatically in the project root

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with the test script
5. Submit a pull request

## 📄 License

This project is part of the AI Learning Platform and follows the same MIT license.

---

**Ready to use!** 🎉 The authentication system is fully functional and ready for integration with your AI Learning Platform.