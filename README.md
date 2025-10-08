# 🎓 AI Learning Platform

A comprehensive, personalized learning platform with AI-powered recommendations, real-time progress tracking, and parent notifications.

## 🚀 Features

### 🔐 Authentication System
- **Secure Login/Registration**: Username and password authentication
- **User Profiles**: Extended profile management with personal information
- **Session Management**: Secure session handling with localStorage/sessionStorage
- **Auto-login**: Remember me functionality for persistent sessions

### 📚 Learning Management
- **Subject-based Learning**: Mathematics, Science, Programming, Literature, History
- **Interactive Lessons**: 14+ comprehensive lessons across all subjects
- **Progress Tracking**: Real-time progress monitoring and analytics
- **AI Recommendations**: Personalized learning recommendations based on performance

### ⌨️ Typing Speed Test
- **Real-time Testing**: Live typing speed and accuracy measurement
- **Performance Analytics**: WPM, accuracy, and error tracking
- **Bug-free Implementation**: Fixed division by zero errors and edge cases
- **Visual Feedback**: Character highlighting and progress indicators

### 📧 Parent Notifications
- **Multi-channel Notifications**: Email, SMS, and WhatsApp support
- **Real-time Updates**: Login/logout, progress, and achievement notifications
- **Professional Templates**: Beautiful HTML email templates
- **Fallback System**: Graceful handling of notification failures

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Theme**: Toggle between themes
- **Smooth Animations**: Professional animations and transitions
- **Intuitive Navigation**: Easy-to-use interface

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: JSON file storage with SQLite support
- **Notifications**: Nodemailer (Email), Twilio (SMS/WhatsApp)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome 6.0

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AHTD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Or start with the home page: `http://localhost:3000/home.html`

## 🎯 Usage

### Getting Started

1. **Visit the Home Page**
   - Go to `http://localhost:3000/home.html`
   - Learn about platform features
   - View demo credentials

2. **Authentication**
   - Click "Get Started" to go to the login page
   - Use demo credentials: `alex_demo` / `demo123`
   - Or create a new account with the registration form

3. **Explore the Platform**
   - Dashboard: View your learning progress
   - Subjects: Browse available subjects and lessons
   - Lessons: Access interactive learning content
   - Progress: Track your learning analytics
   - Profile: Manage your account information

### Demo Credentials

For quick testing, use these demo credentials:
- **Username**: `alex_demo`
- **Password**: `demo123`

### Registration

Create a new account with extended profile information:
- Personal details (name, email, username, grade)
- Learning interests and goals
- Parent/guardian contact information
- Address and emergency contacts

## 🔧 Configuration

### Email Notifications (Optional)

To enable real email notifications:

1. **Gmail Setup**
   - Enable 2-factor authentication
   - Generate an App Password
   - Set environment variables:
     ```env
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ```

2. **Update notification-config.js**
   - Configure your email credentials
   - Test email functionality

### SMS/WhatsApp Notifications (Optional)

To enable real SMS and WhatsApp notifications:

1. **Twilio Setup**
   - Create a Twilio account
   - Get Account SID and Auth Token
   - Purchase a phone number

2. **Set environment variables**
   ```env
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_FROM_NUMBER=+1234567890
   WHATSAPP_FROM_NUMBER=whatsapp:+14155238886
   ```

## 📁 Project Structure

```
AHTD/
├── README.md                 # This comprehensive documentation
├── server.js                 # Main server application
├── script.js                 # Frontend JavaScript functionality
├── styles.css                # Application styling
├── index.html                # Main application interface
├── auth.html                 # Authentication page (login/register)
├── home.html                 # Landing/home page
├── profile.html              # User profile management
├── notification-config.js    # Real notification configuration
├── create-sample-data.js     # Sample data creation utility
├── package.json              # Node.js dependencies
├── package-lock.json         # Dependency lock file
└── data/                     # JSON data storage
    ├── students.json         # Student information
    ├── lessons.json          # Lesson content
    ├── subjects.json         # Subject definitions
    ├── notifications.json    # Notification logs
    └── ...                   # Other data files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/students/:id` - Get student information

### Learning Content
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get specific subject
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/lessons?subjectId=:id` - Get lessons by subject

### Progress Tracking
- `POST /api/students/progress` - Record progress
- `GET /api/students/:id/progress` - Get student progress
- `POST /api/typing/track` - Record typing test results

### Notifications
- `POST /api/test/notification` - Test notification system
- `GET /api/notifications` - Get notification logs

## 🐛 Bug Fixes

### Typing Speed Test
- ✅ Fixed division by zero error causing "-Infinity%" accuracy
- ✅ Added proper error handling for edge cases
- ✅ Improved WPM calculation and time display
- ✅ Enhanced user experience with better feedback

### Authentication System
- ✅ Fixed login button visibility issues
- ✅ Implemented proper session management
- ✅ Added comprehensive registration system
- ✅ Enhanced security with proper validation

### Parent Notifications
- ✅ Implemented real email, SMS, and WhatsApp notifications
- ✅ Added fallback system for notification failures
- ✅ Created professional email templates
- ✅ Enhanced error handling and logging

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**
   - Test login with demo credentials
   - Test registration with new account
   - Verify session persistence
   - Test logout functionality

2. **Learning Features**
   - Browse subjects and lessons
   - Complete typing speed tests
   - Check progress tracking
   - Verify AI recommendations

3. **Notifications**
   - Test login/logout notifications
   - Verify progress notifications
   - Check notification logs

### Automated Testing

Run the server and test all endpoints:
```bash
node server.js
```

Test specific functionality:
- Login: `POST http://localhost:3000/api/login`
- Registration: `POST http://localhost:3000/api/register`
- Notifications: `POST http://localhost:3000/api/test/notification`

## 🚀 Deployment

### Local Development
```bash
npm start
# or
node server.js
```

### Production Deployment

1. **Environment Setup**
   - Set up production environment variables
   - Configure email and SMS credentials
   - Set up proper database storage

2. **Server Configuration**
   - Use PM2 for process management
   - Set up reverse proxy (nginx)
   - Configure SSL certificates

3. **Monitoring**
   - Set up logging
   - Monitor notification delivery
   - Track user analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

1. **Server won't start**
   - Check if port 3000 is available
   - Verify Node.js installation
   - Check for missing dependencies

2. **Login issues**
   - Verify demo credentials: `alex_demo` / `demo123`
   - Check browser console for errors
   - Clear browser storage and try again

3. **Notifications not working**
   - Check notification-config.js settings
   - Verify email/SMS credentials
   - Check notification logs in data/notifications.json

4. **Typing test bugs**
   - Refresh the page
   - Check browser console for errors
   - Verify typing test elements exist

### Getting Help

- Check the browser console for error messages
- Review the server logs for backend issues
- Verify all dependencies are installed
- Test with demo credentials first

## 🎉 Recent Updates

### Version 2.0 - Complete Overhaul
- ✅ **New Authentication System**: Complete login/registration with profile management
- ✅ **Fixed Typing Test**: Resolved all bugs including division by zero errors
- ✅ **Real Notifications**: Implemented actual email, SMS, and WhatsApp notifications
- ✅ **Clean UI**: Removed unnecessary buttons and improved user experience
- ✅ **Profile Management**: Comprehensive user profile with extended information
- ✅ **File Cleanup**: Organized project structure with single README
- ✅ **Bug Fixes**: Resolved all known issues and improved stability

### Key Improvements
- Professional authentication flow
- Bug-free typing speed test
- Real parent notifications
- Clean, organized codebase
- Comprehensive documentation
- Enhanced user experience

---

**🎓 AI Learning Platform - Empowering Education Through Technology**

*Built with ❤️ for better learning experiences*