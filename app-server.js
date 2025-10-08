const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.MAIN_APP_PORT || 3000;

// Serve static files from the root directory (for CSS, JS, etc.)
app.use(express.static(__dirname));

// Route for the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for the dashboard page
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(PORT, () => {
    console.log('🚀 Main Application Server started');
    console.log(`🌐 Frontend is live at http://localhost:${PORT}`);
    console.log('----------------------------------------------------');
});