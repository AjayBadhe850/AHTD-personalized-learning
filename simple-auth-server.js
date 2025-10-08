const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database setup
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

console.log('✅ Database connected');

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Simple Auth API'
    });
});

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt for:', username);
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password required'
        });
    }
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        bcrypt.compare(password, user.password, (err, isValid) => {
            if (err) {
                console.error('❌ Password comparison error:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Internal error'
                });
            }
            
            if (!isValid) {
                console.log('❌ Invalid password');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            console.log('✅ Login successful');
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        });
    });
});

// Register route
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    console.log('📝 Registration attempt for:', username);
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password required'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }
    
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        if (row) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('❌ Hashing error:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Internal error'
                });
            }
            
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
                if (err) {
                    console.error('❌ Insert error:', err.message);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create user'
                    });
                }
                
                console.log('✅ User registered successfully');
                res.json({
                    success: true,
                    message: 'User registered successfully',
                    userId: this.lastID
                });
            });
        });
    });
});

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Get user info
app.get('/api/user/:username', (req, res) => {
    const { username } = req.params;
    
    db.get('SELECT id, username, created_at FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error'
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

// Get all users
app.get('/api/users', (req, res) => {
    db.all('SELECT id, username, created_at FROM users ORDER BY created_at DESC', (err, users) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        res.json({
            success: true,
            users: users,
            count: users.length
        });
    });
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Simple Auth Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    db.close();
    process.exit(0);
});
