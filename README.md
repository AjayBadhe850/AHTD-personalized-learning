# 🎓 AI Learning Platform - Personalized Learning System

A comprehensive personalized learning platform with adaptive content, progress tracking, and parent notifications for intermediate students.

## 🚀 Features

### 📚 **Learning Management**
- **5 Core Subjects**: Mathematics, Science, Programming, Literature, History
- **13+ Interactive Lessons** across different difficulty levels
- **Personalized Recommendations** based on student progress
- **Adaptive Learning Paths** that adjust to student performance

### 👥 **Student Management**
- **Complete Registration System** with parent/guardian contact information
- **Comprehensive Analytics** and progress tracking
- **Session Management** with detailed activity logging
- **Typing Speed Testing** and improvement tracking

### 📱 **Parent Notifications**
- **Real-time Login/Logout Alerts** sent to parent phone/email
- **Progress Updates** with score improvements and achievements
- **Weekly Reports** with detailed learning analytics
- **Session Summaries** with time spent and activities completed

### 🎯 **Admin Features**
- **Lesson Import System** for adding new content
- **Syllabus Management** for organizing learning paths
- **Student Analytics Dashboard** with detailed insights
- **Typing Test Administration** and performance tracking

## 🛠️ Technology Stack

### **Frontend**
- **HTML5** with semantic markup
- **CSS3** with modern animations and responsive design
- **JavaScript (ES6+)** with async/await and modern features
- **Font Awesome Icons** for beautiful UI elements
- **Google Fonts** (Poppins & Open Sans) for typography
- **CSS Animations & Keyframes** for smooth interactions

### **Backend**
- **Node.js** with Express.js framework
- **JSON File Storage** (no external database required)
- **CORS Enabled** for cross-origin requests
- **RESTful API** with comprehensive endpoints
- **Real-time Notifications** system ready for SMS/Email integration

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn package manager

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/AjayBadhe850/AHTD-personalized-learning.git
   cd AHTD-personalized-learning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create sample data**
   ```bash
   node create-sample-data.js
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎮 Usage Guide

### **For Students**
1. **Register** with your details and parent contact information
2. **Explore Subjects** and browse available lessons
3. **Take Lessons** and track your progress
4. **Complete Typing Tests** to improve your skills
5. **View Analytics** to see your learning journey

### **For Parents**
- Receive **automatic notifications** for login/logout events
- Get **progress updates** when your child improves
- Receive **weekly reports** with detailed analytics
- Monitor **session duration** and activities

### **For Administrators**
1. **Import Lessons** using JSON format
2. **Create Syllabi** to organize learning paths
3. **View Student Analytics** for detailed insights
4. **Manage Typing Tests** and track improvements

## 📊 API Endpoints

### **Subjects & Lessons**
- `GET /api/subjects` - Get all subjects
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `POST /api/lessons/import` - Import new lessons

### **Student Management**
- `POST /api/students/register` - Register new student
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student details
- `GET /api/students/:id/details` - Get comprehensive analytics

### **Session Tracking**
- `POST /api/students/login` - Track student login
- `POST /api/students/logout` - Track student logout
- `POST /api/students/activity` - Track student activities

### **Progress & Analytics**
- `GET /api/progress` - Get progress data
- `POST /api/students/progress` - Record progress
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/analytics` - Get learning analytics

### **Typing Tests**
- `POST /api/typing/track` - Record typing test results
- `GET /api/typing/stats/:studentId` - Get typing statistics

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file for configuration:
```env
PORT=3000
NODE_ENV=development
```

### **Notification Services** (Optional)
To enable real notifications, configure:
- **Twilio** for SMS notifications
- **SendGrid** for email notifications
- **WhatsApp Business API** for WhatsApp messages

## 📱 Deployment

### **Frontend (GitHub Pages)**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access at: `https://yourusername.github.io/AHTD-personalized-learning`

### **Backend (Vercel/Render)**
1. Connect your GitHub repository
2. Deploy with Node.js buildpack
3. Set environment variables
4. Update frontend API URL

## 🎯 Key Features in Detail

### **Login Tracking System**
- **Device Information**: Tracks device type, browser, and platform
- **Location Tracking**: Records approximate location (with permission)
- **Session Duration**: Monitors time spent on platform
- **Activity Logging**: Records pages visited and lessons accessed

### **Parent Notification System**
- **Login Alerts**: Immediate notification when student logs in
- **Logout Summaries**: Detailed session summary with activities
- **Progress Updates**: Notifications for significant improvements
- **Weekly Reports**: Comprehensive learning analytics

### **Adaptive Learning**
- **Personalized Recommendations**: AI-driven lesson suggestions
- **Difficulty Adjustment**: Content adapts to student performance
- **Progress Tracking**: Detailed analytics on learning journey
- **Achievement System**: Recognition for milestones and improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Font Awesome** for beautiful icons
- **Google Fonts** for typography
- **Express.js** community for the excellent framework
- **Node.js** community for the runtime environment

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact: [Your Contact Information]

---

**Built with ❤️ for personalized learning and student success!**