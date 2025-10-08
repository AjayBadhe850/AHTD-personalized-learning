const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'https://yourusername.github.io',
        /^https:\/\/.*\.github\.io$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.netlify\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(__dirname));

// Database setup
const dbPath = path.join(__dirname, 'users.db');
let db;

// Initialize database connection
function initDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                reject(err);
            } else {
                console.log('✅ Connected to SQLite database');
                initializeDatabase();
                resolve();
            }
        });
    });
}

// Initialize database with users table
function initializeDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            is_active BOOLEAN DEFAULT 1
        )
    `;

    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('❌ Error creating users table:', err.message);
        } else {
            console.log('✅ Users table ready');
            createSampleUser();
        }
    });
}

// Create sample user for testing
function createSampleUser() {
    const sampleUsername = 'demo';
    const samplePassword = 'password123';
    
    // Check if demo user already exists
    db.get('SELECT id FROM users WHERE username = ?', [sampleUsername], (err, row) => {
        if (err) {
            console.error('❌ Error checking for demo user:', err.message);
        } else if (!row) {
            // Create demo user
            bcrypt.hash(samplePassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('❌ Error hashing password:', err.message);
                } else {
                    db.run(
                        'INSERT INTO users (username, password) VALUES (?, ?)',
                        [sampleUsername, hashedPassword],
                        function(err) {
                            if (err) {
                                console.error('❌ Error creating demo user:', err.message);
                            } else {
                                console.log('✅ Demo user created successfully');
                                console.log('📝 Demo credentials:');
                                console.log('   Username: demo');
                                console.log('   Password: password123');
                            }
                        }
                    );
                }
            });
        } else {
            console.log('✅ Demo user already exists');
        }
    });
}

// Authentication Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'AI Learning Platform Auth API',
        database: 'Connected'
    });
});

// Register new user
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    console.log('📝 Registration attempt for username:', username);
    
    // Validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
    
    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Username must be at least 3 characters long'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }
    
    // Check if username already exists
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('❌ Database error during registration:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }
        
        if (row) {
            console.log('❌ Registration failed: Username already exists');
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('❌ Password hashing error:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
            
            // Insert new user
            db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('❌ Error creating user:', err.message);
                        return res.status(500).json({
                            success: false,
                            message: 'Failed to create user account'
                        });
                    }
                    
                    console.log('✅ User registered successfully:', username);
                    res.status(201).json({
                        success: true,
                        message: 'User registered successfully',
                        userId: this.lastID
                    });
                }
            );
        });
    });
});

// Login user
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt for username:', username);
    
    // Validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
    
    // Find user by username
    db.get('SELECT * FROM users WHERE username = ? AND is_active = 1', [username], (err, user) => {
        if (err) {
            console.error('❌ Database error during login:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }
        
        if (!user) {
            console.log('❌ Login failed: User not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        // Verify password
        bcrypt.compare(password, user.password, (err, isValidPassword) => {
            if (err) {
                console.error('❌ Password comparison error:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
            
            if (!isValidPassword) {
                console.log('❌ Login failed: Invalid password');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }
            
            // Update last login
            db.run(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id],
                (err) => {
                    if (err) {
                        console.error('❌ Error updating last login:', err.message);
                    }
                }
            );
            
            console.log('✅ Login successful for user:', username);
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    lastLogin: user.last_login
                }
            });
        });
    });
});

// Get user info (for dashboard)
app.get('/api/user/:username', (req, res) => {
    const { username } = req.params;
    
    console.log('👤 Fetching user info for:', username);
    
    db.get('SELECT id, username, created_at, last_login FROM users WHERE username = ? AND is_active = 1', [username], (err, user) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: user
        });
    });
});

// Get all users (for admin purposes)
app.get('/api/users', (req, res) => {
    console.log('📊 Fetching all users');
    
    db.all('SELECT id, username, created_at, last_login, is_active FROM users ORDER BY created_at DESC', (err, users) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }
        
        res.json({
            success: true,
            users: users,
            count: users.length
        });
    });
});

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Route not found' 
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

// Start server
async function startServer() {
    try {
        await initDatabase();
        
        app.listen(PORT, () => {
            console.log('🚀 AI Learning Platform Auth Server started');
            console.log(`🌐 Server running on http://localhost:${PORT}`);
            console.log(`📚 API endpoints:`);
            console.log(`   POST /api/register - Register new user`);
            console.log(`   POST /api/login - User login`);
            console.log(`   GET  /api/user/:username - Get user info`);
            console.log(`   GET  /api/users - Get all users`);
            console.log(`   GET  /api/health - Health check`);
            console.log(`🔐 Authentication system ready!`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;