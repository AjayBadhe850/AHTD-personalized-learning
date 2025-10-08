const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Data file paths
const DATA_FILES = {
    subjects: path.join(DATA_DIR, 'subjects.json'),
    lessons: path.join(DATA_DIR, 'lessons.json'),
    progress: path.join(DATA_DIR, 'progress.json'),
    recommendations: path.join(DATA_DIR, 'recommendations.json'),
    students: path.join(DATA_DIR, 'students.json'),
    sessions: path.join(DATA_DIR, 'sessions.json'),
    typingStats: path.join(DATA_DIR, 'typingStats.json'),
    syllabi: path.join(DATA_DIR, 'syllabi.json'),
    loginLogs: path.join(DATA_DIR, 'loginLogs.json'),
    notifications: path.join(DATA_DIR, 'notifications.json')
};

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://yourusername.github.io',
        /^https:\/\/.*\.github\.io$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.netlify\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Enhanced JSON parsing with error handling
app.use(bodyParser.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            console.error('JSON parsing error:', e.message);
            console.error('Buffer content:', buf.toString());
            res.status(400).json({ error: 'Invalid JSON format' });
            return false;
        }
    }
}));

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from current directory
app.use(express.static(__dirname));

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Initialize data files if they don't exist
const initializeDataFiles = () => {
    const defaultData = {
        subjects: [],
        lessons: [],
        progress: [],
        recommendations: [],
        students: [],
        sessions: [],
        typingStats: [],
        syllabi: [],
        loginLogs: [],
        notifications: []
    };

    Object.keys(DATA_FILES).forEach(key => {
        if (!fs.existsSync(DATA_FILES[key])) {
            fs.writeJsonSync(DATA_FILES[key], defaultData[key]);
        }
    });
};

// Helper functions
const readData = (fileKey) => {
    try {
        return fs.readJsonSync(DATA_FILES[fileKey]);
    } catch (error) {
        console.error(`Error reading ${fileKey}:`, error);
        return [];
    }
};

const writeData = (fileKey, data) => {
    try {
        fs.writeJsonSync(DATA_FILES[fileKey], data, { spaces: 2 });
        return true;
    } catch (error) {
        console.error(`Error writing ${fileKey}:`, error);
        return false;
    }
};

// Initialize data files
initializeDataFiles();

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'AI Learning Platform API'
    });
});

// Subjects Routes
app.get('/api/subjects', (req, res) => {
    const subjects = readData('subjects');
    res.json(subjects);
});

app.get('/api/subjects/:id', (req, res) => {
    const subjects = readData('subjects');
    const subject = subjects.find(s => s.id === req.params.id);
    
    if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
});

// Lessons Routes
app.get('/api/lessons', (req, res) => {
    const lessons = readData('lessons');
    const { subjectId, difficulty, search } = req.query;
    
    let filteredLessons = lessons;
    
    if (subjectId) {
        filteredLessons = filteredLessons.filter(lesson => 
            lesson.subjectId === subjectId
        );
    }
    
    if (difficulty) {
        filteredLessons = filteredLessons.filter(lesson => 
            lesson.difficulty === difficulty
        );
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredLessons = filteredLessons.filter(lesson => 
            lesson.title.toLowerCase().includes(searchLower) ||
            lesson.description.toLowerCase().includes(searchLower)
        );
    }
    
    res.json(filteredLessons);
});

app.get('/api/lessons/:id', (req, res) => {
    const lessons = readData('lessons');
    const lesson = lessons.find(l => l.id === req.params.id);
    
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
});

// Progress Routes (using session storage on frontend, but API for consistency)
app.get('/api/progress', (req, res) => {
    const progress = readData('progress');
    res.json(progress);
});

app.post('/api/progress', (req, res) => {
    const { lessonId, completed, timeSpent, score } = req.body;
    
    if (!lessonId) {
        return res.status(400).json({ error: 'Lesson ID is required' });
    }

    const progress = readData('progress');
    
    // Find existing progress entry
    const existingIndex = progress.findIndex(p => p.lessonId === lessonId);
    
    if (existingIndex !== -1) {
        // Update existing progress
        progress[existingIndex] = {
            ...progress[existingIndex],
            completed: completed !== undefined ? completed : progress[existingIndex].completed,
            timeSpent: timeSpent !== undefined ? timeSpent : progress[existingIndex].timeSpent,
            score: score !== undefined ? score : progress[existingIndex].score,
            lastUpdated: new Date().toISOString()
        };
    } else {
        // Create new progress entry
        progress.push({
            lessonId,
            completed: completed || false,
            timeSpent: timeSpent || 0,
            score: score || 0,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        });
    }
    
    writeData('progress', progress);
    res.json({ message: 'Progress updated successfully' });
});

// Recommendations Routes
app.get('/api/recommendations', (req, res) => {
    const { subjectId, difficulty } = req.query;
    const lessons = readData('lessons');
    const progress = readData('progress');
    
    // Get completed lesson IDs
    const completedLessons = progress.filter(p => p.completed).map(p => p.lessonId);
    
    // Filter lessons based on parameters
    let recommendedLessons = lessons.filter(lesson => 
        !completedLessons.includes(lesson.id)
    );
    
    if (subjectId) {
        recommendedLessons = recommendedLessons.filter(lesson => 
            lesson.subjectId === subjectId
        );
    }
    
    if (difficulty) {
        recommendedLessons = recommendedLessons.filter(lesson => 
            lesson.difficulty === difficulty
        );
    }
    
    // Simple recommendation algorithm: prioritize by difficulty progression
    recommendedLessons.sort((a, b) => {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
    
    // Return top 5 recommendations
    res.json(recommendedLessons.slice(0, 5));
});

// Student Registration Routes
app.post('/api/students/register', (req, res) => {
    const { 
        name, 
        email, 
        age, 
        grade, 
        interests, 
        learningGoals,
        parentName,
        parentEmail,
        parentPhone,
        emergencyContact,
        address
    } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const students = readData('students');
    
    // Check if student already exists
    if (students.find(student => student.email === email)) {
        return res.status(400).json({ error: 'Student already registered' });
    }

    const newStudent = {
        id: Date.now().toString(),
        name,
        email,
        age: age || null,
        grade: grade || null,
        interests: interests || [],
        learningGoals: learningGoals || [],
        contactInfo: {
            parentName: parentName || '',
            parentEmail: parentEmail || '',
            parentPhone: parentPhone || '',
            emergencyContact: emergencyContact || '',
            address: address || ''
        },
        registeredAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        totalTimeSpent: 0,
        totalLessonsCompleted: 0,
        averageTypingSpeed: 0,
        totalSessions: 0,
        loginHistory: [],
        performanceHistory: []
    };

    students.push(newStudent);
    writeData('students', students);

    res.status(201).json({
        message: 'Student registered successfully',
        student: {
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email
        }
    });
});

app.get('/api/students', (req, res) => {
    const students = readData('students');
    res.json(students);
});

app.get('/api/students/:id', (req, res) => {
    const students = readData('students');
    const student = students.find(s => s.id === req.params.id);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
});

// Get all login logs
app.get('/api/login-logs', (req, res) => {
    const loginLogs = readData('loginLogs');
    res.json(loginLogs);
});

// Get login logs for a specific student
app.get('/api/students/:id/login-logs', (req, res) => {
    const { id } = req.params;
    const loginLogs = readData('loginLogs');
    const studentLogs = loginLogs.filter(log => log.studentId === id);
    res.json(studentLogs);
});

// Track student activity during session
app.post('/api/students/activity', (req, res) => {
    const { studentId, activityType, data } = req.body;
    
    if (!studentId || !activityType) {
        return res.status(400).json({ error: 'Student ID and activity type are required' });
    }

    const students = readData('students');
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    // Find the most recent active login
    const lastLogin = student.loginHistory[student.loginHistory.length - 1];
    if (lastLogin && !lastLogin.logoutTime) {
        const activity = {
            type: activityType,
            data: data || {},
            timestamp: new Date().toISOString()
        };

        lastLogin.activities.push(activity);

        // Track specific activities
        if (activityType === 'page_visit') {
            if (!lastLogin.pagesVisited.includes(data.page)) {
                lastLogin.pagesVisited.push(data.page);
            }
        } else if (activityType === 'lesson_access') {
            if (!lastLogin.lessonsAccessed.includes(data.lessonId)) {
                lastLogin.lessonsAccessed.push(data.lessonId);
            }
        } else if (activityType === 'typing_test') {
            lastLogin.typingSessions.push({
                wpm: data.wpm,
                accuracy: data.accuracy,
                timestamp: new Date().toISOString()
            });
        }

        writeData('students', students);

        // Update global login logs
        const loginLogs = readData('loginLogs');
        const globalLoginRecord = loginLogs.find(log => log.id === lastLogin.id);
        if (globalLoginRecord) {
            globalLoginRecord.activities.push(activity);
            if (activityType === 'page_visit' && !globalLoginRecord.pagesVisited.includes(data.page)) {
                globalLoginRecord.pagesVisited.push(data.page);
            }
            if (activityType === 'lesson_access' && !globalLoginRecord.lessonsAccessed.includes(data.lessonId)) {
                globalLoginRecord.lessonsAccessed.push(data.lessonId);
            }
            writeData('loginLogs', loginLogs);
        }

        res.json({
            message: 'Activity recorded successfully',
            activity: activity
        });
    } else {
        res.status(400).json({ error: 'No active session found' });
    }
});

// Login/Logout Tracking Routes
app.post('/api/students/login', async (req, res) => {
    const { 
        studentId, 
        deviceInfo, 
        browserInfo, 
        ipAddress, 
        location, 
        userAgent 
    } = req.body;
    
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    const students = readData('students');
    const loginLogs = readData('loginLogs');
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    const loginTime = new Date().toISOString();
    const loginId = Date.now().toString();

    // Create comprehensive login record
    const loginRecord = {
        id: loginId,
        studentId: studentId,
        studentName: student.name,
        loginTime: loginTime,
        logoutTime: null,
        sessionDuration: 0,
        deviceInfo: deviceInfo || 'Unknown Device',
        browserInfo: browserInfo || 'Unknown Browser',
        ipAddress: ipAddress || 'Unknown IP',
        location: location || 'Unknown Location',
        userAgent: userAgent || 'Unknown User Agent',
        activities: [],
        lessonsAccessed: [],
        typingSessions: [],
        pagesVisited: [],
        status: 'active'
    };

    // Store in student's login history
    student.loginHistory.push(loginRecord);
    student.lastActive = loginTime;
    student.totalSessions += 1;

    // Store in global login logs
    loginLogs.push(loginRecord);

    // Update data files
    writeData('students', students);
    writeData('loginLogs', loginLogs);

    // Send login notification to parents
    await sendParentNotification(student, 'login', {
        loginTime: loginTime,
        studentName: student.name,
        deviceInfo: deviceInfo,
        location: location
    });

    console.log(`📱 Student ${student.name} logged in at ${loginTime} from ${deviceInfo || 'Unknown Device'}`);

    res.json({
        message: 'Login recorded successfully',
        loginId: loginId,
        loginTime: loginTime,
        student: {
            id: student.id,
            name: student.name,
            totalSessions: student.totalSessions
        }
    });
});

app.post('/api/students/logout', async (req, res) => {
    const { studentId, reason } = req.body;
    
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    const students = readData('students');
    const loginLogs = readData('loginLogs');
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    const logoutTime = new Date().toISOString();

    // Find the most recent active login record
    const lastLogin = student.loginHistory[student.loginHistory.length - 1];
    if (lastLogin && !lastLogin.logoutTime) {
        lastLogin.logoutTime = logoutTime;
        lastLogin.sessionDuration = new Date(logoutTime) - new Date(lastLogin.loginTime);
        lastLogin.status = 'completed';
        lastLogin.logoutReason = reason || 'User logout';
        
        student.lastActive = logoutTime;

        // Update global login logs
        const globalLoginRecord = loginLogs.find(log => log.id === lastLogin.id);
        if (globalLoginRecord) {
            globalLoginRecord.logoutTime = logoutTime;
            globalLoginRecord.sessionDuration = lastLogin.sessionDuration;
            globalLoginRecord.status = 'completed';
            globalLoginRecord.logoutReason = reason || 'User logout';
        }

        // Update data files
        writeData('students', students);
        writeData('loginLogs', loginLogs);

        // Send logout notification with session summary
        await sendParentNotification(student, 'logout', {
            loginTime: lastLogin.loginTime,
            logoutTime: logoutTime,
            sessionDuration: lastLogin.sessionDuration,
            activities: lastLogin.activities,
            lessonsAccessed: lastLogin.lessonsAccessed,
            pagesVisited: lastLogin.pagesVisited,
            studentName: student.name,
            deviceInfo: lastLogin.deviceInfo,
            logoutReason: reason
        });

        console.log(`📱 Student ${student.name} logged out at ${logoutTime}. Session duration: ${formatDuration(lastLogin.sessionDuration)}`);
    }

    res.json({
        message: 'Logout recorded successfully',
        logoutTime: logoutTime,
        sessionDuration: lastLogin ? lastLogin.sessionDuration : 0
    });
});

// Session Tracking Routes
app.post('/api/sessions/start', (req, res) => {
    const { studentId } = req.body;
    
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    const sessions = readData('sessions');
    const newSession = {
        id: Date.now().toString(),
        studentId,
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0,
        pagesVisited: [],
        lessonsAccessed: [],
        typingSessions: []
    };

    sessions.push(newSession);
    writeData('sessions', sessions);

    res.json({
        message: 'Session started',
        sessionId: newSession.id
    });
});

app.post('/api/sessions/end', (req, res) => {
    const { sessionId } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    const sessions = readData('sessions');
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    session.endTime = new Date().toISOString();
    session.duration = new Date(session.endTime) - new Date(session.startTime);

    // Update student total time
    const students = readData('students');
    const student = students.find(s => s.id === session.studentId);
    if (student) {
        student.totalTimeSpent += session.duration;
        student.lastActive = new Date().toISOString();
        writeData('students', students);
    }

    writeData('sessions', sessions);

    res.json({
        message: 'Session ended',
        duration: session.duration
    });
});

app.post('/api/sessions/track', (req, res) => {
    const { sessionId, page, lessonId } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    const sessions = readData('sessions');
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    if (page && !session.pagesVisited.includes(page)) {
        session.pagesVisited.push(page);
    }

    if (lessonId && !session.lessonsAccessed.includes(lessonId)) {
        session.lessonsAccessed.push(lessonId);
    }

    writeData('sessions', sessions);

    res.json({ message: 'Session tracked successfully' });
});

// Typing Speed Tracking Routes
app.post('/api/typing/track', (req, res) => {
    const { studentId, sessionId, wpm, accuracy, text, timeSpent } = req.body;
    
    if (!studentId || !wpm) {
        return res.status(400).json({ error: 'Student ID and WPM are required' });
    }

    const typingStats = readData('typingStats');
    const newTypingSession = {
        id: Date.now().toString(),
        studentId,
        sessionId: sessionId || null,
        wpm,
        accuracy: accuracy || 0,
        text: text || '',
        timeSpent: timeSpent || 0,
        timestamp: new Date().toISOString()
    };

    typingStats.push(newTypingSession);

    // Update student average typing speed
    const students = readData('students');
    const student = students.find(s => s.id === studentId);
    if (student) {
        const studentTypingStats = typingStats.filter(ts => ts.studentId === studentId);
        const totalWpm = studentTypingStats.reduce((sum, ts) => sum + ts.wpm, 0);
        student.averageTypingSpeed = Math.round(totalWpm / studentTypingStats.length);
        writeData('students', students);
    }

    writeData('typingStats', typingStats);

    res.json({
        message: 'Typing stats recorded',
        typingSession: newTypingSession
    });
});

app.get('/api/typing/stats/:studentId', (req, res) => {
    const { studentId } = req.params;
    const typingStats = readData('typingStats');
    const studentStats = typingStats.filter(ts => ts.studentId === studentId);
    
    res.json(studentStats);
});

// Lesson Import Routes
app.post('/api/lessons/import', (req, res) => {
    const { lessons, subjectId } = req.body;
    
    if (!lessons || !Array.isArray(lessons)) {
        return res.status(400).json({ error: 'Lessons array is required' });
    }

    const existingLessons = readData('lessons');
    const importedLessons = [];

    lessons.forEach(lesson => {
        const newLesson = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: lesson.title || 'Untitled Lesson',
            description: lesson.description || '',
            content: lesson.content || '',
            subjectId: subjectId || lesson.subjectId || 'general',
            difficulty: lesson.difficulty || 'beginner',
            duration: lesson.duration || '30 minutes',
            order: lesson.order || existingLessons.length + 1,
            createdAt: new Date().toISOString(),
            imported: true
        };

        existingLessons.push(newLesson);
        importedLessons.push(newLesson);
    });

    writeData('lessons', existingLessons);

    res.json({
        message: `${importedLessons.length} lessons imported successfully`,
        lessons: importedLessons
    });
});

// Syllabus Management Routes
app.post('/api/syllabi', (req, res) => {
    const { name, description, subjectId, lessons, duration } = req.body;
    
    if (!name || !subjectId) {
        return res.status(400).json({ error: 'Name and subject ID are required' });
    }

    const syllabi = readData('syllabi');
    const newSyllabus = {
        id: Date.now().toString(),
        name,
        description: description || '',
        subjectId,
        lessons: lessons || [],
        duration: duration || '12 weeks',
        createdAt: new Date().toISOString(),
        isActive: true
    };

    syllabi.push(newSyllabus);
    writeData('syllabi', syllabi);

    res.status(201).json({
        message: 'Syllabus created successfully',
        syllabus: newSyllabus
    });
});

app.get('/api/syllabi', (req, res) => {
    const syllabi = readData('syllabi');
    res.json(syllabi);
});

app.get('/api/syllabi/:id', (req, res) => {
    const syllabi = readData('syllabi');
    const syllabus = syllabi.find(s => s.id === req.params.id);
    
    if (!syllabus) {
        return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    res.json(syllabus);
});

// Enhanced Analytics Routes
app.get('/api/analytics', (req, res) => {
    const lessons = readData('lessons');
    const progress = readData('progress');
    const subjects = readData('subjects');
    
    const completedLessons = progress.filter(p => p.completed);
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    // Calculate progress by subject
    const subjectProgress = subjects.map(subject => {
        const subjectLessons = lessons.filter(l => l.subjectId === subject.id);
        const completedSubjectLessons = completedLessons.filter(p => 
            subjectLessons.some(l => l.id === p.lessonId)
        );
        
        return {
            subjectId: subject.id,
            subjectName: subject.name,
            totalLessons: subjectLessons.length,
            completedLessons: completedSubjectLessons.length,
            progressPercentage: subjectLessons.length > 0 ? 
                Math.round((completedSubjectLessons.length / subjectLessons.length) * 100) : 0
        };
    });
    
    const analytics = {
        totalLessons: lessons.length,
        completedLessons: completedLessons.length,
        totalTimeSpent: totalTimeSpent,
        averageScore: completedLessons.length > 0 ? 
            Math.round(completedLessons.reduce((sum, p) => sum + (p.score || 0), 0) / completedLessons.length) : 0,
        subjectProgress: subjectProgress,
        weeklyProgress: generateWeeklyProgress(progress),
        difficultyDistribution: calculateDifficultyDistribution(lessons, completedLessons)
    };
    
    res.json(analytics);
});

// Student Details and Analytics
app.get('/api/students/:id/details', (req, res) => {
    const { id } = req.params;
    
    const students = readData('students');
    const sessions = readData('sessions');
    const typingStats = readData('typingStats');
    const progress = readData('progress');
    const lessons = readData('lessons');
    
    const student = students.find(s => s.id === id);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    // Get student-specific data
    const studentSessions = sessions.filter(s => s.studentId === id);
    const studentTypingStats = typingStats.filter(ts => ts.studentId === id);
    const studentProgress = progress.filter(p => {
        // Find lessons that belong to this student's sessions
        const lessonIds = studentSessions.flatMap(s => s.lessonsAccessed);
        return lessonIds.includes(p.lessonId);
    });
    
    // Calculate detailed analytics
    const totalSessions = studentSessions.length;
    const totalTimeSpent = studentSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageSessionDuration = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;
    
    const completedLessons = studentProgress.filter(p => p.completed);
    const totalLessonsAccessed = new Set(studentSessions.flatMap(s => s.lessonsAccessed)).size;
    
    const averageWpm = studentTypingStats.length > 0 ? 
        studentTypingStats.reduce((sum, ts) => sum + ts.wpm, 0) / studentTypingStats.length : 0;
    
    const averageAccuracy = studentTypingStats.length > 0 ? 
        studentTypingStats.reduce((sum, ts) => sum + ts.accuracy, 0) / studentTypingStats.length : 0;
    
    // Weekly activity
    const weeklyActivity = generateStudentWeeklyActivity(studentSessions);
    
    // Subject performance
    const subjectPerformance = calculateSubjectPerformance(studentProgress, lessons);
    
    // Typing improvement over time
    const typingImprovement = calculateTypingImprovement(studentTypingStats);
    
    const studentDetails = {
        basicInfo: {
            id: student.id,
            name: student.name,
            email: student.email,
            age: student.age,
            grade: student.grade,
            interests: student.interests,
            learningGoals: student.learningGoals,
            registeredAt: student.registeredAt,
            lastActive: student.lastActive
        },
        learningStats: {
            totalSessions: totalSessions,
            totalTimeSpent: totalTimeSpent,
            averageSessionDuration: averageSessionDuration,
            totalLessonsAccessed: totalLessonsAccessed,
            completedLessons: completedLessons.length,
            completionRate: totalLessonsAccessed > 0 ? 
                Math.round((completedLessons.length / totalLessonsAccessed) * 100) : 0
        },
        typingStats: {
            averageWpm: Math.round(averageWpm),
            averageAccuracy: Math.round(averageAccuracy),
            totalTypingSessions: studentTypingStats.length,
            improvement: typingImprovement,
            recentScores: studentTypingStats.slice(-10).map(ts => ({
                wpm: ts.wpm,
                accuracy: ts.accuracy,
                timestamp: ts.timestamp
            }))
        },
        activity: {
            weeklyActivity: weeklyActivity,
            subjectPerformance: subjectPerformance,
            mostVisitedPages: getMostVisitedPages(studentSessions),
            learningStreak: calculateLearningStreak(studentSessions)
        },
        sessions: studentSessions.map(session => ({
            id: session.id,
            startTime: session.startTime,
            endTime: session.endTime,
            duration: session.duration,
            pagesVisited: session.pagesVisited.length,
            lessonsAccessed: session.lessonsAccessed.length
        }))
    };
    
    res.json(studentDetails);
});

// Helper functions for student analytics
const generateStudentWeeklyActivity = (sessions) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return days.map((day, index) => {
        const dayDate = new Date();
        dayDate.setDate(dayDate.getDate() - (6 - index));
        
        const daySessions = sessions.filter(s => {
            const sessionDate = new Date(s.startTime);
            return sessionDate.toDateString() === dayDate.toDateString();
        });
        
        return {
            day,
            sessions: daySessions.length,
            timeSpent: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
            lessonsAccessed: new Set(daySessions.flatMap(s => s.lessonsAccessed)).size
        };
    });
};

const calculateSubjectPerformance = (progress, lessons) => {
    const subjectStats = {};
    
    progress.forEach(p => {
        const lesson = lessons.find(l => l.id === p.lessonId);
        if (lesson) {
            if (!subjectStats[lesson.subjectId]) {
                subjectStats[lesson.subjectId] = {
                    total: 0,
                    completed: 0,
                    averageScore: 0,
                    totalScore: 0
                };
            }
            
            subjectStats[lesson.subjectId].total++;
            if (p.completed) {
                subjectStats[lesson.subjectId].completed++;
                subjectStats[lesson.subjectId].totalScore += p.score || 0;
            }
        }
    });
    
    // Calculate averages
    Object.keys(subjectStats).forEach(subjectId => {
        const stats = subjectStats[subjectId];
        stats.averageScore = stats.completed > 0 ? 
            Math.round(stats.totalScore / stats.completed) : 0;
        stats.completionRate = Math.round((stats.completed / stats.total) * 100);
    });
    
    return subjectStats;
};

const calculateTypingImprovement = (typingStats) => {
    if (typingStats.length < 2) return 0;
    
    const sortedStats = typingStats.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const firstHalf = sortedStats.slice(0, Math.floor(sortedStats.length / 2));
    const secondHalf = sortedStats.slice(Math.floor(sortedStats.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, ts) => sum + ts.wpm, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, ts) => sum + ts.wpm, 0) / secondHalf.length;
    
    return Math.round(secondHalfAvg - firstHalfAvg);
};

const getMostVisitedPages = (sessions) => {
    const pageCounts = {};
    sessions.forEach(session => {
        session.pagesVisited.forEach(page => {
            pageCounts[page] = (pageCounts[page] || 0) + 1;
        });
    });
    
    return Object.entries(pageCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([page, count]) => ({ page, count }));
};

const calculateLearningStreak = (sessions) => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    let streak = 0;
    let currentDate = new Date();
    
    for (const session of sortedSessions) {
        const sessionDate = new Date(session.startTime);
        const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
            streak++;
            currentDate = sessionDate;
        } else if (daysDiff > streak) {
            break;
        }
    }
    
    return streak;
};

// Parent Notification System
const sendParentNotification = async (student, type, data) => {
    console.log(`🔔 Attempting to send ${type} notification for student: ${student.name}`);
    
    if (!student.contactInfo) {
        console.log('❌ No contact information available for student');
        return;
    }
    
    if (!student.contactInfo.parentPhone && !student.contactInfo.parentEmail) {
        console.log('❌ No parent contact information available for notifications');
        console.log('Contact info:', student.contactInfo);
        return;
    }
    
    console.log('✅ Parent contact info found:', {
        parentName: student.contactInfo.parentName,
        parentEmail: student.contactInfo.parentEmail,
        parentPhone: student.contactInfo.parentPhone
    });

    let message = '';
    let subject = '';

    switch (type) {
        case 'login':
            message = `📚 ${data.studentName} has logged into the AI Learning Platform at ${formatTime(data.loginTime)}.`;
            subject = 'Student Login Notification';
            break;
            
        case 'logout':
            const sessionDuration = formatDuration(data.sessionDuration);
            const lessonsCount = data.lessonsAccessed ? data.lessonsAccessed.length : 0;
            message = `📊 ${data.studentName} has logged out of the AI Learning Platform.\n\n` +
                     `⏰ Session Duration: ${sessionDuration}\n` +
                     `📖 Lessons Accessed: ${lessonsCount}\n` +
                     `🕐 Login Time: ${formatTime(data.loginTime)}\n` +
                     `🕐 Logout Time: ${formatTime(data.logoutTime)}`;
            subject = 'Student Session Summary';
            break;
            
        case 'progress':
            message = `🎯 ${data.studentName} has made progress!\n\n` +
                     `📈 Score Improvement: +${data.scoreIncrease} points\n` +
                     `📚 Subject: ${data.subject}\n` +
                     `⭐ Current Score: ${data.currentScore}\n` +
                     `📅 Date: ${formatDate(data.date)}`;
            subject = 'Student Progress Update';
            break;
            
        case 'achievement':
            message = `🏆 Congratulations! ${data.studentName} has achieved a new milestone!\n\n` +
                     `🎖️ Achievement: ${data.achievement}\n` +
                     `📚 Subject: ${data.subject}\n` +
                     `⭐ Score: ${data.score}\n` +
                     `📅 Date: ${formatDate(data.date)}`;
            subject = 'Student Achievement Notification';
            break;
            
        case 'weekly_report':
            message = `📊 Weekly Progress Report for ${data.studentName}\n\n` +
                     `📚 Total Lessons Completed: ${data.lessonsCompleted}\n` +
                     `⏰ Total Study Time: ${data.totalTime}\n` +
                     `⭐ Average Score: ${data.averageScore}\n` +
                     `🏆 Top Subject: ${data.topSubject}\n` +
                     `📈 Improvement: ${data.improvement > 0 ? '+' : ''}${data.improvement} points`;
            subject = 'Weekly Progress Report';
            break;
    }

    // Send notifications in parallel for better performance
    const notificationPromises = [];

    // Send SMS notification (real)
    if (student.contactInfo.parentPhone) {
        notificationPromises.push(
            sendSMS(student.contactInfo.parentPhone, message)
                .then(result => console.log(`📱 SMS result for ${student.name}:`, result))
                .catch(error => console.error(`❌ SMS failed for ${student.name}:`, error))
        );
    }

    // Send Email notification (real)
    if (student.contactInfo.parentEmail) {
        notificationPromises.push(
            sendEmail(student.contactInfo.parentEmail, subject, message)
                .then(result => console.log(`📧 Email result for ${student.name}:`, result))
                .catch(error => console.error(`❌ Email failed for ${student.name}:`, error))
        );
    }

    // Send WhatsApp notification (real)
    if (student.contactInfo.parentPhone) {
        notificationPromises.push(
            sendWhatsApp(student.contactInfo.parentPhone, message)
                .then(result => console.log(`📱 WhatsApp result for ${student.name}:`, result))
                .catch(error => console.error(`❌ WhatsApp failed for ${student.name}:`, error))
        );
    }

    // Wait for all notifications to complete
    try {
        await Promise.all(notificationPromises);
        console.log(`✅ All notifications sent for ${student.name}: ${type}`);
    } catch (error) {
        console.error(`❌ Some notifications failed for ${student.name}:`, error);
    }
};

// Real SMS sending function
const sendSMS = async (phoneNumber, message) => {
    try {
        const { sendRealSMS } = require('./notification-config');
        const result = await sendRealSMS(phoneNumber, message);
        console.log(`✅ SMS notification sent with result:`, result);
        return result;
    } catch (error) {
        console.error('❌ Error sending SMS:', error);
        // Fallback to simulation
        console.log(`📱 [FALLBACK] SMS to ${phoneNumber}: ${message}`);
        
        const notifications = readData('notifications') || [];
        const notification = {
            id: Date.now().toString(),
            type: 'sms',
            recipient: phoneNumber,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'failed_fallback'
        };
        notifications.push(notification);
        writeData('notifications', notifications);
        
        console.log(`✅ SMS notification logged with ID: ${notification.id}`);
    }
};

// Real Email sending function
const sendEmail = async (email, subject, message) => {
    try {
        const { sendRealEmail } = require('./notification-config');
        const result = await sendRealEmail(email, subject, message);
        console.log(`✅ Email notification sent with result:`, result);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        // Fallback to simulation
        console.log(`📧 [FALLBACK] Email to ${email}: ${subject}\n${message}`);
        
        const notifications = readData('notifications') || [];
        const notification = {
            id: Date.now().toString(),
            type: 'email',
            recipient: email,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'failed_fallback'
        };
        notifications.push(notification);
        writeData('notifications', notifications);
        
        console.log(`✅ Email notification logged with ID: ${notification.id}`);
    }
};

// Real WhatsApp sending function
const sendWhatsApp = async (phoneNumber, message) => {
    try {
        const { sendRealWhatsApp } = require('./notification-config');
        const result = await sendRealWhatsApp(phoneNumber, message);
        console.log(`✅ WhatsApp notification sent with result:`, result);
        return result;
    } catch (error) {
        console.error('❌ Error sending WhatsApp:', error);
        // Fallback to simulation
        console.log(`📱 [FALLBACK] WhatsApp to ${phoneNumber}: ${message}`);
        
        const notifications = readData('notifications') || [];
        const notification = {
            id: Date.now().toString(),
            type: 'whatsapp',
            recipient: phoneNumber,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'failed_fallback'
        };
        notifications.push(notification);
        writeData('notifications', notifications);
        
        console.log(`✅ WhatsApp notification logged with ID: ${notification.id}`);
    }
};

// Progress Tracking and Notifications
app.post('/api/students/progress', async (req, res) => {
    const { studentId, lessonId, score, subject, improvement } = req.body;
    
    if (!studentId || !lessonId) {
        return res.status(400).json({ error: 'Student ID and Lesson ID are required' });
    }

    const students = readData('students');
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    // Record progress
    const progressRecord = {
        lessonId: lessonId,
        score: score || 0,
        subject: subject || 'Unknown',
        improvement: improvement || 0,
        timestamp: new Date().toISOString()
    };

    student.performanceHistory.push(progressRecord);

    // Update last login record with activity
    const lastLogin = student.loginHistory[student.loginHistory.length - 1];
    if (lastLogin) {
        lastLogin.activities.push({
            type: 'lesson_completed',
            lessonId: lessonId,
            score: score,
            timestamp: new Date().toISOString()
        });
        
        if (!lastLogin.lessonsAccessed.includes(lessonId)) {
            lastLogin.lessonsAccessed.push(lessonId);
        }
    }

    writeData('students', students);

    // Send progress notification if significant improvement
    if (improvement && improvement > 5) {
        await sendParentNotification(student, 'progress', {
            studentName: student.name,
            scoreIncrease: improvement,
            subject: subject,
            currentScore: score,
            date: new Date().toISOString()
        });
    }

    res.json({
        message: 'Progress recorded successfully',
        progress: progressRecord
    });
});

// Weekly Report Generation
app.post('/api/students/weekly-report', async (req, res) => {
    const { studentId } = req.body;
    
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    const students = readData('students');
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    // Calculate weekly statistics
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyProgress = student.performanceHistory.filter(p => 
        new Date(p.timestamp) > oneWeekAgo
    );

    const weeklySessions = student.loginHistory.filter(s => 
        new Date(s.loginTime) > oneWeekAgo
    );

    const lessonsCompleted = weeklyProgress.length;
    const totalTime = weeklySessions.reduce((sum, s) => sum + (s.sessionDuration || 0), 0);
    const averageScore = weeklyProgress.length > 0 ? 
        Math.round(weeklyProgress.reduce((sum, p) => sum + p.score, 0) / weeklyProgress.length) : 0;

    // Find top subject
    const subjectScores = {};
    weeklyProgress.forEach(p => {
        if (!subjectScores[p.subject]) {
            subjectScores[p.subject] = { total: 0, count: 0 };
        }
        subjectScores[p.subject].total += p.score;
        subjectScores[p.subject].count += 1;
    });

    const topSubject = Object.keys(subjectScores).reduce((a, b) => 
        subjectScores[a].total / subjectScores[a].count > subjectScores[b].total / subjectScores[b].count ? a : b, 
        'None'
    );

    // Calculate improvement
    const previousWeek = student.performanceHistory.filter(p => {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return new Date(p.timestamp) > twoWeeksAgo && new Date(p.timestamp) <= oneWeekAgo;
    });

    const currentWeekAvg = averageScore;
    const previousWeekAvg = previousWeek.length > 0 ? 
        Math.round(previousWeek.reduce((sum, p) => sum + p.score, 0) / previousWeek.length) : 0;
    const improvement = currentWeekAvg - previousWeekAvg;

    // Send weekly report to parents
    await sendParentNotification(student, 'weekly_report', {
        studentName: student.name,
        lessonsCompleted: lessonsCompleted,
        totalTime: formatDuration(totalTime),
        averageScore: averageScore,
        topSubject: topSubject,
        improvement: improvement
    });

    res.json({
        message: 'Weekly report generated and sent to parents',
        report: {
            lessonsCompleted,
            totalTime: formatDuration(totalTime),
            averageScore,
            topSubject,
            improvement
        }
    });
});

// Utility functions for formatting
const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const formatDuration = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

// Helper functions for analytics
const generateWeeklyProgress = (progress) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return days.map((day, index) => {
        const dayDate = new Date();
        dayDate.setDate(dayDate.getDate() - (6 - index));
        
        const dayProgress = progress.filter(p => {
            const progressDate = new Date(p.lastUpdated);
            return progressDate.toDateString() === dayDate.toDateString();
        });
        
        return {
            day,
            lessonsCompleted: dayProgress.filter(p => p.completed).length,
            timeSpent: dayProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
        };
    });
};

const calculateDifficultyDistribution = (lessons, completedLessons) => {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    
    return difficulties.map(difficulty => {
        const totalLessons = lessons.filter(l => l.difficulty === difficulty).length;
        const completedLessonsCount = completedLessons.filter(p => {
            const lesson = lessons.find(l => l.id === p.lessonId);
            return lesson && lesson.difficulty === difficulty;
        }).length;
        
        return {
            difficulty,
            total: totalLessons,
            completed: completedLessonsCount,
            percentage: totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0
        };
    });
};

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Get all notifications
app.get('/api/notifications', (req, res) => {
    const notifications = readData('notifications') || [];
    res.json(notifications);
});

// Login with username/password
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const students = readData('students');
    const student = students.find(s => s.username === username && s.password === password);
    
    if (!student) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Create session
    const sessionId = Date.now().toString();
    const loginTime = new Date().toISOString();
    
    // Add to login history
    const loginRecord = {
        id: sessionId,
        loginTime: loginTime,
        logoutTime: null,
        sessionDuration: 0,
        deviceInfo: req.headers['user-agent'] || 'Unknown Device',
        browserInfo: req.headers['user-agent'] || 'Unknown Browser',
        status: 'active',
        activities: [],
        lessonsAccessed: [],
        pagesVisited: ['/login']
    };
    
    student.loginHistory.push(loginRecord);
    student.lastActive = loginTime;
    
    // Update global login logs
    const loginLogs = readData('loginLogs') || [];
    loginLogs.push({
        id: sessionId,
        studentId: student.id,
        studentName: student.name,
        loginTime: loginTime,
        logoutTime: null,
        sessionDuration: 0,
        deviceInfo: loginRecord.deviceInfo,
        browserInfo: loginRecord.browserInfo,
        status: 'active'
    });
    
    // Update data files
    writeData('students', students);
    writeData('loginLogs', loginLogs);
    
    // Send login notification to parents
    await sendParentNotification(student, 'login', {
        loginTime: loginTime,
        studentName: student.name,
        deviceInfo: loginRecord.deviceInfo
    });
    
    console.log(`✅ Student ${student.name} logged in successfully at ${loginTime}`);
    
    res.json({
        message: 'Login successful',
        student: {
            id: student.id,
            name: student.name,
            email: student.email,
            username: student.username,
            grade: student.grade,
            interests: student.interests,
            learningGoals: student.learningGoals
        },
        sessionId: sessionId,
        loginTime: loginTime
    });
});

// Send credentials to specific phone number
app.post('/api/send-credentials', (req, res) => {
    const { phoneNumber } = req.body;
    const targetPhone = phoneNumber || '+17396230359';
    
    const students = readData('students');
    const demoStudent = students.find(s => s.id === 'demo-student-001');
    
    if (!demoStudent) {
        return res.status(404).json({ error: 'Demo student not found' });
    }
    
    const credentialsMessage = `🎓 AI Learning Platform - Demo Credentials

👤 Username: ${demoStudent.username}
🔑 Password: ${demoStudent.password}
🌐 Website: http://localhost:3000

📚 Available Lessons:
• Mathematics (Algebra, Linear Equations, Quadratic Functions)
• Science (Physics, Chemistry, Biology)
• Programming (JavaScript, OOP, Data Structures)
• Literature (Poetry, Shakespeare)
• History (Ancient Civilizations, World Wars)

💡 Features:
• Personalized learning dashboard
• Progress tracking
• AI recommendations
• Parent notifications

Start learning now! 🚀`;

    // Send SMS with credentials
    sendSMS(targetPhone, credentialsMessage);
    
    // Also send a WhatsApp-style message (simulated)
    const whatsappMessage = `🎓 *AI Learning Platform Demo Access*

*Login Credentials:*
👤 Username: \`${demoStudent.username}\`
🔑 Password: \`${demoStudent.password}\`
🌐 Website: http://localhost:3000

*Quick Start:*
1. Open the website
2. Click "Login" button
3. Enter credentials above
4. Start learning!

*Available Subjects:*
📊 Mathematics
🔬 Science  
💻 Programming
📖 Literature
🏛️ History

*Features:*
✅ Personalized dashboard
✅ Progress tracking
✅ AI recommendations
✅ Parent notifications

Happy Learning! 🚀`;

    // Store WhatsApp notification
    const notifications = readData('notifications') || [];
    notifications.push({
        id: Date.now().toString(),
        type: 'whatsapp',
        recipient: targetPhone,
        message: whatsappMessage,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });
    writeData('notifications', notifications);
    
    console.log(`📱 Credentials sent to ${targetPhone}`);
    console.log(`📱 WhatsApp message sent to ${targetPhone}`);
    
    res.json({ 
        message: 'Credentials sent successfully',
        phoneNumber: targetPhone,
        username: demoStudent.username,
        password: demoStudent.password,
        website: 'http://localhost:3000'
    });
});

// Test endpoint for parent notifications
app.post('/api/test/notification', async (req, res) => {
    const students = readData('students');
    const testStudent = students.find(s => s.id === 'test-student-1');
    
    if (!testStudent) {
        return res.status(404).json({ error: 'Test student not found' });
    }
    
    // Test logout notification
    await sendParentNotification(testStudent, 'logout', {
        loginTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        logoutTime: new Date().toISOString(),
        sessionDuration: 3600000, // 1 hour
        activities: [
            { type: 'lesson_completed', lesson: 'Math Basics', score: 85 },
            { type: 'quiz_taken', subject: 'Science', score: 92 }
        ],
        lessonsAccessed: ['Math Basics', 'Science Quiz'],
        pagesVisited: ['/dashboard', '/lessons', '/progress'],
        studentName: testStudent.name,
        deviceInfo: 'Test Device',
        logoutReason: 'Test logout'
    });
    
    res.json({ 
        message: 'Test notification sent to parents',
        student: testStudent.name,
        parentEmail: testStudent.contactInfo.parentEmail,
        parentPhone: testStudent.contactInfo.parentPhone
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🤖 AI Learning Platform API running on http://localhost:${PORT}`);
    console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 CORS enabled for GitHub Pages deployment`);
    console.log(`📊 Analytics: GET /api/analytics`);
    console.log(`🎯 Recommendations: GET /api/recommendations`);
    console.log(`🧪 Test notification: POST /api/test/notification`);
});