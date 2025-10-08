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

// Database setup
const dbPath = path.join(__dirname, 'users.db');
let db;
const saltRounds = 10;

// Helper function to run SQL queries with Promises
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error('Error running sql ' + sql);
                console.error(err);
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}

// Helper function to get a single row with Promises
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error('Error running sql ' + sql);
                console.error(err);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function initializeDatabase() {
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
    await run(createUsersTable);
    console.log('✅ Users table ready');
    await createSampleUser();
}

async function createSampleUser() {
    const sampleUsername = 'demo';
    const samplePassword = 'password123';
    
    const row = await get('SELECT id FROM users WHERE username = ?', [sampleUsername]);
    if (row) {
        console.log('✅ Demo user already exists');
        return;
    }
    
    const hashedPassword = await bcrypt.hash(samplePassword, saltRounds);
    await run('INSERT INTO users (username, password) VALUES (?, ?)', [sampleUsername, hashedPassword]);
    console.log('✅ Demo user created successfully');
    console.log('📝 Demo credentials:');
    console.log('   Username: demo');
    console.log('   Password: password123');
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
app.post('/api/register', async (req, res) => {
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
    
    try {
        const row = await get('SELECT id FROM users WHERE username = ?', [username]);
        if (row) {
            console.log('❌ Registration failed: Username already exists');
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        console.log('✅ User registered successfully:', username);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.id
        });
    } catch (error) {
        console.error('❌ Database error during registration:', error.message);
        res.status(500).json({
            success: false,
            message: 'Database error occurred'
        });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt for username:', username);
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        const user = await get('SELECT * FROM users WHERE username = ? AND is_active = 1', [username]);
        if (!user) {
            console.log('❌ Login failed: User not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('❌ Login failed: Invalid password');
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        await run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

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
    } catch (error) {
        console.error('❌ Database error during login:', error.message);
        res.status(500).json({
            success: false,
            message: 'Database error occurred'
        });
    }
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
    
    db.all('SELECT id, username, created_at, last_login FROM users ORDER BY created_at DESC', (err, users) => {
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
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                // If we can't open the DB, we can't start the server.
                process.exit(1);
            } else {
                console.log('✅ Connected to SQLite database');
            }
        });

        await initializeDatabase();
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

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Something went wrong!' 
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: 'API route not found' });
});

startServer();

module.exports = app;