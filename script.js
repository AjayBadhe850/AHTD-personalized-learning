// AI Learning Platform - Enhanced with Student Management, Typing Tests, and Analytics

console.log('🚀 AI Learning Platform JavaScript loaded');

class AILearningPlatform {
    constructor() {
        this.apiBaseUrl = this.getApiBaseUrl();
        this.subjects = [];
        this.lessons = [];
        this.recommendations = [];
        this.students = [];
        this.syllabi = [];
        this.progress = this.loadProgressFromStorage();
        this.analytics = null;
        this.currentStudent = this.loadCurrentStudent();
        this.currentSession = null;
        this.sessionStartTime = null;
        this.typingTest = {
            isActive: false,
            startTime: null,
            text: '',
            currentIndex: 0,
            errors: 0,
            wpm: 0,
            accuracy: 0
        };
        
        this.init();
    }

    getApiBaseUrl() {
        // For GitHub Pages deployment, use demo mode
        // For local development, use localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        // For GitHub Pages, use demo mode (no backend required)
        return 'demo';
    }

    async init() {
        console.log('🔧 Initializing AI Learning Platform...');
        
        // Small delay to ensure all elements are rendered
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('✅ DOM ready, binding events...');
        this.bindEvents();
        
        console.log('✅ Events bound, loading data...');
        await this.loadInitialData();
        
        this.updateDashboard();
        this.updateTypingLevelIndicator();
        this.showSection('dashboard');
        this.startSessionTracking();
        
        // Update UI based on login status
        this.updateLoginUI(!!this.currentStudent);
        
        // Show welcome animation if student is logged in
        if (this.currentStudent) {
            setTimeout(() => {
                this.showWelcomeModal(this.currentStudent);
                this.updateDashboardProfile(this.currentStudent);
            }, 1000);
        }
        
        // Hide debug panel after successful initialization
        this.hideDebugPanel();
        
        console.log('✅ App initialized successfully');
    }

    bindEvents() {
        console.log('🔗 Binding events...');
        
        // Helper function to safely bind events
        const safeBind = (selector, event, handler) => {
            const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (element) {
                element.addEventListener(event, handler);
                console.log(`✅ Bound ${event} to ${selector}`);
            } else {
                console.warn(`❌ Element not found: ${selector}`);
            }
        };

        const safeBindById = (id, event, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
                console.log(`✅ Bound ${event} to #${id}`);
            } else {
                console.warn(`❌ Element not found: #${id}`);
            }
        };

        // Navigation events
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`🔗 Found ${navLinks.length} navigation links`);
        
        navLinks.forEach((link, index) => {
            console.log(`🔗 Binding nav link ${index + 1}: ${link.dataset.section}`);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🎯 Navigation clicked: ${e.target.closest('.nav-link').dataset.section}`);
                this.showSection(e.target.closest('.nav-link').dataset.section);
            });
        });

        // Login events
        safeBindById('login-btn', 'click', () => {
            console.log('🎯 Login button clicked!');
            this.showLoginModal();
        });

        safeBindById('login-form', 'submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        safeBindById('login-close', 'click', () => {
            this.closeLoginModal();
        });

        safeBindById('login-cancel', 'click', () => {
            this.closeLoginModal();
        });

        // Registration events
        safeBindById('register-btn', 'click', () => {
            console.log('🎯 Register button clicked!');
            this.showRegistrationModal();
        });

        // Logout event
        safeBindById('logout-btn', 'click', () => {
            if (this.apiBaseUrl === 'demo') {
                this.logoutStudentDemo();
            } else {
                this.logoutStudent();
            }
        });

        safeBindById('registration-form', 'submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        safeBindById('registration-close', 'click', () => {
            this.closeRegistrationModal();
        });

        safeBindById('registration-cancel', 'click', () => {
            this.closeRegistrationModal();
        });

        // Theme toggle
        safeBindById('theme-toggle', 'click', () => {
            this.toggleTheme();
        });

        // Lesson search and filters
        safeBindById('lesson-search', 'input', (e) => {
            this.filterLessons();
        });

        safeBindById('subject-filter', 'change', () => {
            this.filterLessons();
        });

        safeBindById('difficulty-filter', 'change', () => {
            this.filterLessons();
        });

        // Admin tab events
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAdminTab(e.target.dataset.tab);
            });
        });

        // Lesson import
        safeBindById('import-lessons-btn', 'click', () => {
            this.importLessons();
        });

        // Syllabus creation
        safeBindById('create-syllabus-btn', 'click', () => {
            this.createSyllabus();
        });

        // Typing test events
        safeBindById('start-typing-test', 'click', () => {
            this.startTypingTest();
        });

        safeBindById('typing-input', 'input', (e) => {
            this.handleTypingInput(e);
        });

        // Modal events
        safeBindById('modal-close', 'click', () => {
            this.closeModal();
        });

        safeBindById('student-details-close', 'click', () => {
            this.closeStudentDetailsModal();
        });

        // Lesson completion events
        safeBindById('mark-complete', 'click', () => {
            this.markLessonComplete();
        });

        safeBindById('mark-incomplete', 'click', () => {
            this.markLessonIncomplete();
        });

        // Close modals on outside click
        safeBindById('lesson-modal', 'click', (e) => {
            if (e.target.id === 'lesson-modal') {
                this.closeModal();
            }
        });

        // Profile picture upload
        safeBindById('reg-profile-pic', 'change', (e) => {
            this.handleProfilePicUpload(e);
        });

        safeBindById('profile-pic-preview', 'click', () => {
            document.getElementById('reg-profile-pic').click();
        });

        // Welcome modal
        safeBindById('welcome-continue', 'click', () => {
            this.closeWelcomeModal();
        });

        document.getElementById('registration-modal').addEventListener('click', (e) => {
            if (e.target.id === 'registration-modal') {
                this.closeRegistrationModal();
            }
        });

        document.getElementById('login-modal').addEventListener('click', (e) => {
            if (e.target.id === 'login-modal') {
                this.closeLoginModal();
            }
        });

        document.getElementById('student-details-modal').addEventListener('click', (e) => {
            if (e.target.id === 'student-details-modal') {
                this.closeStudentDetailsModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Page visibility change (for session tracking)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseSession();
            } else {
                this.resumeSession();
            }
        });

        // Before unload (for session tracking)
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
    }

    async loadInitialData() {
        try {
            if (this.apiBaseUrl === 'demo') {
                // Load demo data for GitHub Pages
                this.loadDemoData();
            } else {
                // Test API connection first
                const isApiAvailable = await this.testApiConnection();
                if (isApiAvailable) {
                    // Load real data from API
                    await Promise.all([
                        this.loadSubjects(),
                        this.loadLessons(),
                        this.loadStudents(),
                        this.loadSyllabi(),
                        this.loadRecommendations(),
                        this.loadAnalytics()
                    ]);
                } else {
                    // Fall back to demo data if API is not available
                    console.log('⚠️ API not available, falling back to demo data');
                    this.loadDemoData();
                }
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
            console.log('⚠️ Falling back to demo data due to error');
            this.loadDemoData();
        }
    }

    async testApiConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/health`, {
                method: 'GET',
                timeout: 3000
            });
            return response.ok;
        } catch (error) {
            console.log('API connection test failed:', error.message);
            return false;
        }
    }

    loadDemoData() {
        console.log('🎭 Loading demo data for GitHub Pages...');
        
        // Demo subjects
        this.subjects = [
            {
                id: 'math-001',
                name: 'Mathematics',
                description: 'Comprehensive mathematics curriculum covering algebra, geometry, calculus, and statistics.',
                difficulty: 'mixed',
                icon: 'calculator',
                color: '#4f46e5'
            },
            {
                id: 'science-001',
                name: 'Science',
                description: 'Explore physics, chemistry, biology, and earth sciences with interactive experiments.',
                difficulty: 'mixed',
                icon: 'flask',
                color: '#059669'
            },
            {
                id: 'programming-001',
                name: 'Programming',
                description: 'Learn programming languages, algorithms, and software development practices.',
                difficulty: 'mixed',
                icon: 'code',
                color: '#7c3aed'
            },
            {
                id: 'literature-001',
                name: 'Literature',
                description: 'Study classic and contemporary literature, writing techniques, and literary analysis.',
                difficulty: 'mixed',
                icon: 'book',
                color: '#ea580c'
            },
            {
                id: 'history-001',
                name: 'History',
                description: 'Discover world history, historical events, and their impact on modern society.',
                difficulty: 'mixed',
                icon: 'landmark',
                color: '#dc2626'
            }
        ];

        // Demo lessons
        this.lessons = [
            {
                id: 'math-lesson-001',
                title: 'Introduction to Algebra',
                description: 'Learn the basics of algebraic expressions, variables, and equations.',
                content: 'Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations.',
                subjectId: 'math-001',
                difficulty: 'beginner',
                duration: '45 minutes'
            },
            {
                id: 'science-lesson-001',
                title: 'Introduction to Physics',
                description: 'Discover the fundamental principles of physics and motion.',
                content: 'Physics is the natural science that studies matter, its motion and behavior through space and time.',
                subjectId: 'science-001',
                difficulty: 'beginner',
                duration: '50 minutes'
            },
            {
                id: 'programming-lesson-001',
                title: 'Introduction to JavaScript',
                description: 'Learn the basics of JavaScript programming language.',
                content: 'JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web.',
                subjectId: 'programming-001',
                difficulty: 'beginner',
                duration: '90 minutes'
            }
        ];

        // Demo students
        this.students = [
            {
                id: 'demo-student-001',
                name: 'Demo Student',
                email: 'demo@example.com',
                grade: 'High School',
                interests: ['mathematics', 'programming'],
                profilePic: null, // No profile pic for demo student
                totalLessonsCompleted: 5,
                totalTimeSpent: 7200000, // 2 hours in milliseconds
                averageTypingSpeed: 45
            }
        ];

        // Demo recommendations
        this.recommendations = [
            {
                id: 'rec-001',
                lessonId: 'math-lesson-001',
                reason: 'Based on your interest in mathematics',
                priority: 'high'
            }
        ];

        this.analytics = {
            totalStudents: 1,
            totalLessons: 3,
            totalTimeSpent: 7200000,
            averageProgress: 75
        };

        console.log('✅ Demo data loaded successfully');
        this.showToast('Demo mode: Using sample data for demonstration', 'info');
    }

    async loadSubjects() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/subjects`);
            if (!response.ok) throw new Error('Failed to load subjects');
            this.subjects = await response.json();
            this.renderSubjects();
            this.populateSubjectFilter();
            this.populateAdminSubjectFilters();
        } catch (error) {
            console.error('Error loading subjects:', error);
            this.subjects = [];
        }
    }

    async loadLessons() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/lessons`);
            if (!response.ok) throw new Error('Failed to load lessons');
            this.lessons = await response.json();
            this.renderLessons();
        } catch (error) {
            console.error('Error loading lessons:', error);
            this.lessons = [];
        }
    }

    async loadStudents() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/students`);
            if (!response.ok) throw new Error('Failed to load students');
            this.students = await response.json();
            this.renderStudents();
        } catch (error) {
            console.error('Error loading students:', error);
            this.students = [];
        }
    }

    async loadSyllabi() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/syllabi`);
            if (!response.ok) throw new Error('Failed to load syllabi');
            this.syllabi = await response.json();
            this.renderSyllabi();
        } catch (error) {
            console.error('Error loading syllabi:', error);
            this.syllabi = [];
        }
    }

    async loadRecommendations() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/recommendations`);
            if (!response.ok) throw new Error('Failed to load recommendations');
            this.recommendations = await response.json();
            this.renderRecommendations();
        } catch (error) {
            console.error('Error loading recommendations:', error);
            this.recommendations = [];
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics`);
            if (!response.ok) throw new Error('Failed to load analytics');
            this.analytics = await response.json();
            this.renderAnalytics();
        } catch (error) {
            console.error('Error loading analytics:', error);
            this.analytics = null;
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Load section-specific data
        switch (sectionName) {
            case 'subjects':
                this.renderSubjects();
                break;
            case 'lessons':
                this.renderLessons();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'admin':
                this.loadSyllabi();
                break;
            case 'recommendations':
                this.renderRecommendations();
                break;
            case 'progress':
                this.renderAnalytics();
                break;
            case 'dashboard':
                this.updateDashboard();
                break;
        }
    }

    switchAdminTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.admin-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async handleRegistration() {
        const form = document.getElementById('registration-form');
        const formData = new FormData(form);
        
        const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked'))
            .map(input => input.value);

        const registrationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            age: parseInt(formData.get('age')) || null,
            grade: formData.get('grade') || null,
            interests: interests,
            learningGoals: formData.get('learningGoals') || '',
            parentName: formData.get('parentName') || '',
            parentEmail: formData.get('parentEmail') || '',
            parentPhone: formData.get('parentPhone') || '',
            emergencyContact: formData.get('emergencyContact') || '',
            address: formData.get('address') || ''
        };

        try {
            if (this.apiBaseUrl === 'demo') {
                // Demo mode - simulate registration
                const newStudent = {
                    id: Date.now().toString(),
                    name: registrationData.name,
                    email: registrationData.email,
                    grade: registrationData.grade,
                    interests: registrationData.interests,
                    profilePic: this.profilePicData || null,
                    totalLessonsCompleted: 0,
                    totalTimeSpent: 0,
                    averageTypingSpeed: 0
                };

                this.currentStudent = newStudent;
                this.saveCurrentStudent();
                this.closeRegistrationModal();
                this.showToast('Demo Registration successful! (Demo mode)', 'success');
                form.reset();
                
                // Add to demo students
                this.students.push(newStudent);
                this.renderStudents();
                
                // Show welcome animation
                setTimeout(() => {
                    this.showWelcomeModal(newStudent);
                }, 500);
                
                // Update dashboard profile
                this.updateDashboardProfile(newStudent);
                
            } else {
                // Real API call
                const response = await fetch(`${this.apiBaseUrl}/api/students/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registrationData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Registration failed');
                }

                this.currentStudent = result.student;
                this.saveCurrentStudent();
                this.closeRegistrationModal();
                this.showToast('Registration successful!', 'success');
                form.reset();
                
                // Auto-login the newly registered student
                await this.loginStudent(result.student.id);
                
                // Reload students list
                this.loadStudents();
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.showToast(error.message, 'error');
        }
    }

    // Login Modal Functions
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('login-form').reset();
    }

    async handleLogin() {
        const form = document.getElementById('login-form');
        const formData = new FormData(form);
        
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            console.log('🔍 API Base URL:', this.apiBaseUrl);
            console.log('🔍 Login data:', loginData);
            
            if (this.apiBaseUrl === 'demo') {
                console.log('🔍 Using demo mode');
                // Demo mode - use hardcoded demo student
                if (loginData.username === 'alex_demo' && loginData.password === 'demo123') {
                    const student = {
                        id: 'demo-student-001',
                        name: 'Alex Johnson',
                        email: 'alex.johnson@demo.com',
                        username: 'alex_demo',
                        grade: '10th Grade',
                        interests: ['Mathematics', 'Science', 'Programming', 'Physics'],
                        learningGoals: 'Master advanced mathematics and prepare for engineering college',
                        totalLessonsCompleted: 0,
                        totalTimeSpent: 0,
                        averageTypingSpeed: 0
                    };

                this.currentStudent = student;
                this.saveCurrentStudent();
                this.closeLoginModal();
                    this.showToast(`Welcome back, ${student.name}!`, 'success');
                
                // Show welcome animation
                setTimeout(() => {
                    this.showWelcomeModal(student);
                }, 500);
                
                // Update dashboard profile
                this.updateDashboardProfile(student);
                
                // Update UI
                this.updateLoginUI(true);
                } else {
                    throw new Error('Invalid demo credentials. Use username: alex_demo, password: demo123');
                }
                
            } else {
                console.log('🔍 Using real API mode');
                // Real API mode - use new login endpoint
                console.log('🔍 Attempting real API login with:', loginData);
                console.log('🔍 API Base URL:', this.apiBaseUrl);
                
                const response = await fetch(`${this.apiBaseUrl}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                console.log('🔍 Response status:', response.status);
                console.log('🔍 Response ok:', response.ok);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('🔍 Error response:', errorData);
                    throw new Error(errorData.error || 'Login failed');
                }

                const result = await response.json();
                console.log('🔍 Login successful:', result);
                
                this.currentStudent = result.student;
                this.currentSession = result.sessionId;
                
                this.updateLoginUI(true);
                this.closeLoginModal();
                this.showToast(`Welcome back, ${result.student.name}!`, 'success');
                this.updateDashboard();
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showToast(`Login failed: ${error.message}`, 'error');
        }
    }

    // Profile Picture Upload Handler
    handleProfilePicUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('profile-pic-preview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Profile Picture">`;
                preview.classList.add('has-image');
                
                // Store the image data for later use
                this.profilePicData = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Welcome Animation Functions
    showWelcomeModal(student) {
        const modal = document.getElementById('welcome-modal');
        const profilePic = document.getElementById('welcome-profile-pic');
        const name = document.getElementById('welcome-name');
        const lessons = document.getElementById('welcome-lessons');
        const time = document.getElementById('welcome-time');

        // Set profile picture
        if (student.profilePic) {
            profilePic.innerHTML = `<img src="${student.profilePic}" alt="Profile Picture">`;
        } else {
            profilePic.innerHTML = '<i class="fas fa-user-circle"></i>';
        }

        // Set name
        name.textContent = student.name;

        // Set stats
        lessons.textContent = student.totalLessonsCompleted || 0;
        const hours = Math.round((student.totalTimeSpent || 0) / (1000 * 60 * 60));
        time.textContent = `${hours}h`;

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Auto-close after 5 seconds if not interacted with
        setTimeout(() => {
            if (modal.style.display === 'flex') {
                this.closeWelcomeModal();
            }
        }, 5000);
    }

    closeWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Update Dashboard Profile Display
    updateDashboardProfile(student) {
        const profileSection = document.getElementById('dashboard-profile');
        const profilePic = document.getElementById('dashboard-profile-pic');
        const name = document.getElementById('dashboard-profile-name');
        const email = document.getElementById('dashboard-profile-email');

        if (student) {
            // Set profile picture
            if (student.profilePic) {
                profilePic.innerHTML = `<img src="${student.profilePic}" alt="Profile Picture">`;
            } else {
                profilePic.innerHTML = '<i class="fas fa-user-circle"></i>';
            }

            // Set name and email
            name.textContent = student.name;
            email.textContent = student.email;

            // Show profile section
            profileSection.style.display = 'flex';
        } else {
            // Hide profile section
            profileSection.style.display = 'none';
        }
    }

    // Login/Logout tracking methods
    async loginStudent(studentId) {
        if (!studentId) return;

        const deviceInfo = this.getDeviceInfo();
        const browserInfo = this.getBrowserInfo();
        const location = await this.getLocation();

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/students/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: studentId,
                    deviceInfo: deviceInfo,
                    browserInfo: browserInfo,
                    ipAddress: 'Unknown', // Will be detected by server
                    location: location,
                    userAgent: navigator.userAgent
                })
            });

            const result = await response.json();
            if (response.ok) {
                this.currentSession = result;
                this.sessionStartTime = new Date();
                this.showLoginStatus('Logged In');
                this.updateLoginUI(true);
                this.trackActivity('page_visit', { page: 'dashboard' });
                console.log('Student logged in successfully:', result);
            } else {
                console.error('Login failed:', result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    async logoutStudent() {
        if (!this.currentStudent || !this.currentSession) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/students/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: this.currentStudent.id,
                    reason: 'User logout'
                })
            });

            const result = await response.json();
            if (response.ok) {
                this.showLoginStatus('Logged Out');
                this.updateLoginUI(false);
                this.currentSession = null;
                this.sessionStartTime = null;
                this.currentStudent = null;
                this.saveCurrentStudent();
                this.updateDashboardProfile(null);
                console.log('Student logged out successfully:', result);
            } else {
                console.error('Logout failed:', result.error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Demo mode logout
    logoutStudentDemo() {
        this.showLoginStatus('Logged Out');
        this.updateLoginUI(false);
        this.currentSession = null;
        this.sessionStartTime = null;
        this.currentStudent = null;
        this.saveCurrentStudent();
        this.updateDashboardProfile(null);
        this.showToast('Logged out successfully! (Demo mode)', 'success');
    }

    // Hide debug panel after successful initialization
    hideDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
    }

    // Toast notification system
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle button icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('lesson-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    async trackActivity(activityType, data) {
        if (!this.currentStudent || !this.currentSession) return;

        try {
            await fetch(`${this.apiBaseUrl}/api/students/activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: this.currentStudent.id,
                    activityType: activityType,
                    data: data
                })
            });
        } catch (error) {
            console.error('Activity tracking error:', error);
        }
    }

    getDeviceInfo() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(navigator.userAgent);
        const isDesktop = !isMobile && !isTablet;
        
        let deviceType = 'Desktop';
        if (isMobile) deviceType = 'Mobile';
        else if (isTablet) deviceType = 'Tablet';

        return `${deviceType} - ${navigator.platform}`;
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        
        if (userAgent.includes('Chrome')) browserName = 'Chrome';
        else if (userAgent.includes('Firefox')) browserName = 'Firefox';
        else if (userAgent.includes('Safari')) browserName = 'Safari';
        else if (userAgent.includes('Edge')) browserName = 'Edge';
        else if (userAgent.includes('Opera')) browserName = 'Opera';

        return `${browserName} - ${navigator.language}`;
    }

    async getLocation() {
        try {
            if (navigator.geolocation) {
                return new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve(`${position.coords.latitude}, ${position.coords.longitude}`);
                        },
                        () => {
                            resolve('Location access denied');
                        },
                        { timeout: 5000 }
                    );
                });
            }
        } catch (error) {
            console.error('Location error:', error);
        }
        return 'Location unavailable';
    }

    showLoginStatus(status) {
        // Remove existing status
        const existingStatus = document.querySelector('.login-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        // Create new status element
        const statusElement = document.createElement('div');
        statusElement.className = `login-status ${status === 'Logged Out' ? 'logged-out' : ''}`;
        statusElement.innerHTML = `
            <i class="fas ${status === 'Logged In' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            ${status}
        `;

        document.body.appendChild(statusElement);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (statusElement.parentNode) {
                statusElement.remove();
            }
        }, 3000);
    }

    updateLoginUI(isLoggedIn) {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (loginBtn && registerBtn && logoutBtn) {
            if (isLoggedIn) {
                loginBtn.style.display = 'none';
                registerBtn.style.display = 'none';
                logoutBtn.style.display = 'inline-flex';
            } else {
                loginBtn.style.display = 'inline-flex';
                registerBtn.style.display = 'inline-flex';
                logoutBtn.style.display = 'none';
            }
        }
    }

    async startSessionTracking() {
        if (!this.currentStudent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/sessions/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: this.currentStudent.id
                })
            });

            const result = await response.json();
            if (response.ok) {
                this.currentSession = result.sessionId;
                this.sessionStartTime = Date.now();
                this.createSessionTracker();
                this.trackPageVisit();
            }
        } catch (error) {
            console.error('Error starting session:', error);
        }
    }

    async trackPageVisit() {
        if (!this.currentSession) return;

        try {
            await fetch(`${this.apiBaseUrl}/api/sessions/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.currentSession,
                    page: window.location.pathname
                })
            });
        } catch (error) {
            console.error('Error tracking page visit:', error);
        }
    }

    async trackLessonAccess(lessonId) {
        if (!this.currentSession) return;

        try {
            await fetch(`${this.apiBaseUrl}/api/sessions/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.currentSession,
                    lessonId: lessonId
                })
            });
        } catch (error) {
            console.error('Error tracking lesson access:', error);
        }
    }

    createSessionTracker() {
        if (document.getElementById('session-tracker')) return;

        const tracker = document.createElement('div');
        tracker.id = 'session-tracker';
        tracker.innerHTML = `
            <h4>Session Time</h4>
            <div class="session-time" id="session-time">00:00:00</div>
        `;
        document.body.appendChild(tracker);

        // Update session time every second
        this.sessionInterval = setInterval(() => {
            if (this.sessionStartTime) {
                const elapsed = Date.now() - this.sessionStartTime;
                const hours = Math.floor(elapsed / 3600000);
                const minutes = Math.floor((elapsed % 3600000) / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                
                document.getElementById('session-time').textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    async endSession() {
        if (!this.currentSession) return;

        try {
            await fetch(`${this.apiBaseUrl}/api/sessions/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.currentSession
                })
            });

            if (this.sessionInterval) {
                clearInterval(this.sessionInterval);
            }

            const tracker = document.getElementById('session-tracker');
            if (tracker) {
                tracker.remove();
            }

            this.currentSession = null;
            this.sessionStartTime = null;
        } catch (error) {
            console.error('Error ending session:', error);
        }
    }

    pauseSession() {
        // Session is automatically paused when page is hidden
    }

    resumeSession() {
        // Session resumes when page becomes visible
    }

    async startTypingTest() {
        const textElement = document.getElementById('typing-text');
        const inputElement = document.getElementById('typing-input');
        const startBtn = document.getElementById('start-typing-test');

        // Validate elements exist
        if (!textElement || !inputElement || !startBtn) {
            console.error('Typing test elements not found');
            this.showToast('Typing test elements not found', 'error');
            return;
        }

        // Generate new text based on user level
        const newText = this.generateTypingText();
        if (!newText) {
            console.error('No typing text available');
            this.showToast('No typing text available', 'error');
            return;
        }

        // Update the text element with new content
        textElement.textContent = newText;

        this.typingTest.isActive = true;
        this.typingTest.startTime = Date.now();
        this.typingTest.text = newText;
        this.typingTest.currentIndex = 0;
        this.typingTest.errors = 0;
        this.typingTest.wpm = 0;
        this.typingTest.accuracy = 0;

        inputElement.disabled = false;
        inputElement.value = '';
        inputElement.focus();
        startBtn.textContent = 'Test in Progress...';
        startBtn.disabled = true;

        // Initialize display
        this.updateTypingStats();

        // Start updating stats
        this.typingStatsInterval = setInterval(() => {
            this.updateTypingStats();
        }, 100);

        // Highlight current character
        this.highlightCurrentCharacter();
    }

    handleTypingInput(e) {
        if (!this.typingTest.isActive) return;

        const input = e.target.value;
        const currentChar = this.typingTest.text[this.typingTest.currentIndex];
        const typedChar = input[input.length - 1];

        if (typedChar === currentChar) {
            this.typingTest.currentIndex++;
            this.highlightCurrentCharacter();
        } else {
            this.typingTest.errors++;
        }

        // Update stats
        this.updateTypingStats();

        // Check if test is complete
        if (this.typingTest.currentIndex >= this.typingTest.text.length) {
            this.completeTypingTest();
        }
    }

    highlightCurrentCharacter() {
        const textElement = document.getElementById('typing-text');
        const text = this.typingTest.text;
        let html = '';

        for (let i = 0; i < text.length; i++) {
            if (i < this.typingTest.currentIndex) {
                html += `<span class="correct">${text[i]}</span>`;
            } else if (i === this.typingTest.currentIndex) {
                html += `<span class="current">${text[i]}</span>`;
            } else {
                html += text[i];
            }
        }

        textElement.innerHTML = html;
    }

    updateTypingStats() {
        const elapsed = (Date.now() - this.typingTest.startTime) / 1000;
        const wordsTyped = this.typingTest.currentIndex / 5; // Average word length
        const wpm = Math.round((wordsTyped / elapsed) * 60);
        
        // Fix division by zero error for accuracy calculation
        let accuracy = 0;
        if (this.typingTest.currentIndex > 0) {
            accuracy = Math.round(((this.typingTest.currentIndex - this.typingTest.errors) / this.typingTest.currentIndex) * 100);
            // Ensure accuracy is not negative
            accuracy = Math.max(0, accuracy);
        }

        // Update display elements with proper fallbacks
        const wpmDisplay = document.getElementById('wpm-display');
        const accuracyDisplay = document.getElementById('accuracy-display');
        const timeDisplay = document.getElementById('time-display');
        
        if (wpmDisplay) wpmDisplay.textContent = wpm || 0;
        if (accuracyDisplay) accuracyDisplay.textContent = `${accuracy}%`;
        if (timeDisplay) timeDisplay.textContent = `${Math.round(elapsed)}s`;

        this.typingTest.wpm = wpm || 0;
        this.typingTest.accuracy = accuracy;
    }

    async completeTypingTest() {
        this.typingTest.isActive = false;
        
        // Clear the stats update interval
        if (this.typingStatsInterval) {
            clearInterval(this.typingStatsInterval);
            this.typingStatsInterval = null;
        }
        
        const inputElement = document.getElementById('typing-input');
        const startBtn = document.getElementById('start-typing-test');

        if (inputElement) inputElement.disabled = true;
        if (startBtn) {
        startBtn.textContent = 'Start New Test';
        startBtn.disabled = false;
        }

        // Calculate final stats
        const elapsed = (Date.now() - this.typingTest.startTime) / 1000;
        const wordsTyped = this.typingTest.currentIndex / 5;
        const finalWpm = Math.round((wordsTyped / elapsed) * 60);
        let finalAccuracy = 0;
        
        if (this.typingTest.currentIndex > 0) {
            finalAccuracy = Math.round(((this.typingTest.currentIndex - this.typingTest.errors) / this.typingTest.currentIndex) * 100);
            finalAccuracy = Math.max(0, finalAccuracy);
        }

        this.typingTest.wpm = finalWpm || 0;
        this.typingTest.accuracy = finalAccuracy;

        // Save typing stats if student is registered
        if (this.currentStudent) {
            try {
                await fetch(`${this.apiBaseUrl}/api/typing/track`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentId: this.currentStudent.id,
                        sessionId: this.currentSession,
                        wpm: this.typingTest.wpm,
                        accuracy: this.typingTest.accuracy,
                        text: this.typingTest.text,
                        timeSpent: elapsed,
                        charactersTyped: this.typingTest.currentIndex,
                        errors: this.typingTest.errors
                    })
                });
            } catch (error) {
                console.error('Error saving typing stats:', error);
            }
        }

        this.showToast(`Typing test completed! WPM: ${this.typingTest.wpm}, Accuracy: ${this.typingTest.accuracy}%`, 'success');
        
        // Update user level based on performance
        this.updateUserTypingLevel();
        
        // Show repeat option
        this.showRepeatOption();
    }

    generateTypingText() {
        const userLevel = this.getUserTypingLevel();
        const texts = this.getTypingTextsByLevel(userLevel);
        const randomIndex = Math.floor(Math.random() * texts.length);
        return texts[randomIndex];
    }

    getUserTypingLevel() {
        // Get user's average typing speed from localStorage or default to beginner
        const userStats = localStorage.getItem('userTypingStats');
        if (userStats) {
            const stats = JSON.parse(userStats);
            const avgWpm = stats.averageWpm || 0;
            
            if (avgWpm >= 60) return 'advanced';
            if (avgWpm >= 40) return 'intermediate';
            return 'beginner';
        }
        return 'beginner';
    }

    getTypingTextsByLevel(level) {
        const texts = {
            beginner: [
                "The quick brown fox jumps over the lazy dog. This is a simple sentence for beginners to practice typing.",
                "Hello world! Welcome to typing practice. Start slow and focus on accuracy. Speed will come with time.",
                "Learning to type is fun and useful. Practice makes perfect. Keep your fingers on the home row keys.",
                "The cat sat on the mat. The dog ran in the park. These are easy words for typing practice.",
                "Type each letter carefully. Look at the screen, not your hands. This helps you learn faster."
            ],
            intermediate: [
                "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once, making it perfect for typing practice and keyboard testing.",
                "Technology has revolutionized the way we communicate, work, and learn. From smartphones to artificial intelligence, digital innovations continue to shape our daily lives and future possibilities.",
                "Education is the foundation of personal growth and societal progress. Through continuous learning, individuals can develop new skills, expand their knowledge, and contribute meaningfully to their communities.",
                "The art of programming combines logical thinking with creative problem-solving. Developers use various programming languages to build applications, websites, and software that solve real-world challenges.",
                "Climate change represents one of the most pressing challenges of our time. Sustainable practices, renewable energy, and environmental conservation are essential for protecting our planet for future generations."
            ],
            advanced: [
                "The quick brown fox jumps over the lazy dog. This pangram, while seemingly simple, demonstrates the complexity of English orthography and serves as an excellent tool for testing keyboard layouts, font rendering, and typing proficiency across different systems and applications.",
                "Quantum computing represents a paradigm shift in computational capabilities, leveraging quantum mechanical phenomena such as superposition and entanglement to process information in ways that classical computers cannot. This revolutionary technology promises to solve complex problems in cryptography, optimization, and scientific simulation.",
                "The intersection of artificial intelligence and human creativity has given rise to unprecedented possibilities in art, music, literature, and design. Machine learning algorithms can now generate original content, assist in creative processes, and even collaborate with human artists to produce innovative works that challenge traditional boundaries of authorship and artistic expression.",
                "Neuroscience research has revealed the remarkable plasticity of the human brain, demonstrating its ability to adapt, reorganize, and form new neural connections throughout life. This neuroplasticity underlies our capacity for learning, memory formation, and recovery from brain injuries, offering hope for treatments of neurological disorders and cognitive enhancement.",
                "The philosophical implications of artificial general intelligence extend far beyond technical considerations, touching upon fundamental questions about consciousness, free will, and the nature of human existence. As we approach the possibility of creating machines that match or exceed human cognitive abilities, we must carefully consider the ethical, social, and existential implications of such technological advancement."
            ]
        };
        
        return texts[level] || texts.beginner;
    }

    updateUserTypingLevel() {
        const currentWpm = this.typingTest.wpm;
        const currentAccuracy = this.typingTest.accuracy;
        
        // Get existing stats
        let userStats = JSON.parse(localStorage.getItem('userTypingStats') || '{"tests": [], "averageWpm": 0, "averageAccuracy": 0}');
        
        // Add current test result
        userStats.tests.push({
            wpm: currentWpm,
            accuracy: currentAccuracy,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 tests for average calculation
        if (userStats.tests.length > 10) {
            userStats.tests = userStats.tests.slice(-10);
        }
        
        // Calculate new averages
        const totalWpm = userStats.tests.reduce((sum, test) => sum + test.wpm, 0);
        const totalAccuracy = userStats.tests.reduce((sum, test) => sum + test.accuracy, 0);
        
        userStats.averageWpm = Math.round(totalWpm / userStats.tests.length);
        userStats.averageAccuracy = Math.round(totalAccuracy / userStats.tests.length);
        
        // Save updated stats
        localStorage.setItem('userTypingStats', JSON.stringify(userStats));
        
        // Update the level indicator
        this.updateTypingLevelIndicator();
        
        console.log(`📊 Updated typing stats: Average WPM: ${userStats.averageWpm}, Average Accuracy: ${userStats.averageAccuracy}%`);
    }

    showRepeatOption() {
        const startBtn = document.getElementById('start-typing-test');
        if (startBtn) {
            startBtn.innerHTML = '<i class="fas fa-redo"></i> Try Another Test';
            startBtn.disabled = false;
            startBtn.onclick = () => this.startTypingTest();
        }
    }

    updateTypingLevelIndicator() {
        const levelBadge = document.getElementById('typing-level-badge');
        const levelStats = document.getElementById('level-stats');
        
        if (!levelBadge || !levelStats) return;
        
        const userLevel = this.getUserTypingLevel();
        const userStats = JSON.parse(localStorage.getItem('userTypingStats') || '{"averageWpm": 0, "averageAccuracy": 0}');
        
        // Update level badge
        levelBadge.textContent = userLevel.charAt(0).toUpperCase() + userLevel.slice(1);
        levelBadge.className = `level-badge ${userLevel}`;
        
        // Update stats
        levelStats.textContent = `Average: ${userStats.averageWpm} WPM, ${userStats.averageAccuracy}% accuracy`;
        
        console.log(`📊 Updated typing level indicator: ${userLevel} (${userStats.averageWpm} WPM)`);
    }

    async importLessons() {
        const jsonData = document.getElementById('lesson-json').value;
        const subjectId = document.getElementById('import-subject').value;

        if (!jsonData.trim()) {
            this.showToast('Please enter lesson JSON data', 'warning');
            return;
        }

        try {
            const lessons = JSON.parse(jsonData);
            
            const response = await fetch(`${this.apiBaseUrl}/api/lessons/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lessons: lessons,
                    subjectId: subjectId
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Import failed');
            }

            this.showToast(result.message, 'success');
            document.getElementById('lesson-json').value = '';
            this.loadLessons();

        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Invalid JSON format or import failed', 'error');
        }
    }

    async createSyllabus() {
        const name = document.getElementById('syllabus-name').value;
        const description = document.getElementById('syllabus-description').value;
        const subjectId = document.getElementById('syllabus-subject').value;
        const duration = document.getElementById('syllabus-duration').value;

        if (!name || !subjectId) {
            this.showToast('Name and subject are required', 'warning');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/syllabi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    subjectId: subjectId,
                    duration: duration
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Creation failed');
            }

            this.showToast('Syllabus created successfully!', 'success');
            
            // Clear form
            document.getElementById('syllabus-name').value = '';
            document.getElementById('syllabus-description').value = '';
            document.getElementById('syllabus-subject').value = '';
            document.getElementById('syllabus-duration').value = '';

            this.loadSyllabi();

        } catch (error) {
            console.error('Syllabus creation error:', error);
            this.showToast(error.message, 'error');
        }
    }

    renderStudents() {
        const container = document.getElementById('students-grid');
        
        if (this.students.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No students registered</h3>
                    <p>Students will appear here once they register</p>
                </div>
            `;
            return;
        }

        const studentsHTML = this.students.map(student => this.createStudentHTML(student)).join('');
        container.innerHTML = studentsHTML;

        // Bind student click events
        document.querySelectorAll('.student-card').forEach(card => {
            card.addEventListener('click', () => {
                const studentId = card.dataset.studentId;
                this.showStudentDetails(studentId);
            });
        });
    }

    createStudentHTML(student) {
        const totalTime = this.formatTime(student.totalTimeSpent / 1000 / 60); // Convert to minutes

        return `
            <div class="student-card" data-student-id="${student.id}">
                <div class="student-header">
                    <div class="student-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h3 class="student-name">${this.escapeHtml(student.name)}</h3>
                    <p class="student-email">${this.escapeHtml(student.email)}</p>
                </div>
                <div class="student-content">
                    <div class="student-stats">
                        <div class="student-stat">
                            <span class="student-stat-value">${student.totalSessions}</span>
                            <span class="student-stat-label">Sessions</span>
                        </div>
                        <div class="student-stat">
                            <span class="student-stat-value">${totalTime}</span>
                            <span class="student-stat-label">Time Spent</span>
                        </div>
                        <div class="student-stat">
                            <span class="student-stat-value">${student.totalLessonsCompleted}</span>
                            <span class="student-stat-label">Lessons</span>
                        </div>
                        <div class="student-stat">
                            <span class="student-stat-value">${student.averageTypingSpeed}</span>
                            <span class="student-stat-label">WPM</span>
                        </div>
                    </div>
                    <div class="student-info">
                        <p><strong>Grade:</strong> ${student.grade || 'Not specified'}</p>
                        <p><strong>Last Active:</strong> ${this.formatTimeAgo(student.lastActive)}</p>
                    </div>
                    <div class="student-actions">
                        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); aiLearningPlatform.showStudentDetails('${student.id}')">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async showStudentDetails(studentId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/students/${studentId}/details`);
            if (!response.ok) throw new Error('Failed to load student details');
            
            const details = await response.json();
            this.renderStudentDetails(details);
            
            document.getElementById('student-details-title').textContent = `Student Details - ${details.basicInfo.name}`;
            document.getElementById('student-details-modal').classList.add('show');
            document.getElementById('student-details-modal').style.display = 'flex';

        } catch (error) {
            console.error('Error loading student details:', error);
            this.showToast('Failed to load student details', 'error');
        }
    }

    renderStudentDetails(details) {
        const container = document.getElementById('student-details-content');
        
        container.innerHTML = `
            <div class="student-basic-info">
                <h4>Basic Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name</span>
                        <span class="info-value">${this.escapeHtml(details.basicInfo.name)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value">${this.escapeHtml(details.basicInfo.email)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Age</span>
                        <span class="info-value">${details.basicInfo.age || 'Not specified'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Grade</span>
                        <span class="info-value">${details.basicInfo.grade || 'Not specified'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Registered</span>
                        <span class="info-value">${this.formatDate(details.basicInfo.registeredAt)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Last Active</span>
                        <span class="info-value">${this.formatTimeAgo(details.basicInfo.lastActive)}</span>
                    </div>
                </div>
                <div class="info-item">
                    <span class="info-label">Interests</span>
                    <span class="info-value">${details.basicInfo.interests.join(', ') || 'None specified'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Learning Goals</span>
                    <span class="info-value">${this.escapeHtml(details.basicInfo.learningGoals) || 'None specified'}</span>
                </div>
            </div>
            
            <div class="student-analytics">
                <div class="analytics-section">
                    <h4>Learning Statistics</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Total Sessions</span>
                            <span class="info-value">${details.learningStats.totalSessions}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Total Time</span>
                            <span class="info-value">${this.formatTime(details.learningStats.totalTimeSpent / 1000 / 60)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Lessons Accessed</span>
                            <span class="info-value">${details.learningStats.totalLessonsAccessed}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Completed</span>
                            <span class="info-value">${details.learningStats.completedLessons}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Completion Rate</span>
                            <span class="info-value">${details.learningStats.completionRate}%</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Learning Streak</span>
                            <span class="info-value">${details.activity.learningStreak} days</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-section">
                    <h4>Typing Statistics</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Average WPM</span>
                            <span class="info-value">${details.typingStats.averageWpm}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Average Accuracy</span>
                            <span class="info-value">${details.typingStats.averageAccuracy}%</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Total Sessions</span>
                            <span class="info-value">${details.typingStats.totalTypingSessions}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Improvement</span>
                            <span class="info-value">${details.typingStats.improvement > 0 ? '+' : ''}${details.typingStats.improvement} WPM</span>
                        </div>
                    </div>
                    
                    <div class="typing-progress">
                        <h5>Recent Typing Sessions</h5>
                        ${details.typingStats.recentScores.slice(-5).map(session => `
                            <div class="typing-session">
                                <span class="typing-session-date">${this.formatDate(session.timestamp)}</span>
                                <div class="typing-session-stats">
                                    <span class="typing-session-wpm">${session.wpm} WPM</span>
                                    <span class="typing-session-accuracy">${session.accuracy}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderSyllabi() {
        const container = document.getElementById('syllabi-list');
        
        if (this.syllabi.length === 0) {
            container.innerHTML = '<p>No syllabi created yet.</p>';
            return;
        }

        const syllabiHTML = this.syllabi.map(syllabus => `
            <div class="syllabus-item">
                <h4>${this.escapeHtml(syllabus.name)}</h4>
                <p>${this.escapeHtml(syllabus.description)}</p>
                <div class="syllabus-meta">
                    <span class="syllabus-duration">Duration: ${syllabus.duration}</span>
                    <span class="syllabus-lessons">Lessons: ${syllabus.lessons.length}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = syllabiHTML;
    }

    populateAdminSubjectFilters() {
        const importSubject = document.getElementById('import-subject');
        const syllabusSubject = document.getElementById('syllabus-subject');
        
        [importSubject, syllabusSubject].forEach(select => {
            select.innerHTML = '<option value="">Select Subject</option>';
            this.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                select.appendChild(option);
            });
        });
    }

    // ... (rest of the existing methods remain the same)
    // I'll continue with the remaining methods in the next part due to length constraints

    showRegistrationModal() {
        document.getElementById('registration-modal').classList.add('show');
        document.getElementById('registration-modal').style.display = 'flex';
    }

    closeRegistrationModal() {
        document.getElementById('registration-modal').classList.remove('show');
        document.getElementById('registration-modal').style.display = 'none';
    }

    closeStudentDetailsModal() {
        document.getElementById('student-details-modal').classList.remove('show');
        document.getElementById('student-details-modal').style.display = 'none';
    }

    closeAllModals() {
        this.closeModal();
        this.closeRegistrationModal();
        this.closeStudentDetailsModal();
    }

    loadCurrentStudent() {
        try {
            const stored = localStorage.getItem('currentStudent');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading current student:', error);
            return null;
        }
    }

    saveCurrentStudent() {
        try {
            localStorage.setItem('currentStudent', JSON.stringify(this.currentStudent));
        } catch (error) {
            console.error('Error saving current student:', error);
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    // Render methods for different sections
    renderSubjects() {
        const container = document.getElementById('subjects-grid');
        if (!container) return;

        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>No subjects available</h3>
                    <p>Subjects will appear here once they are loaded</p>
                </div>
            `;
            return;
        }

        const subjectsHTML = this.subjects.map(subject => `
            <div class="subject-card" onclick="aiLearningPlatform.showSubjectDetails('${subject.id}')">
                <div class="subject-image">
                    <i class="fas fa-${subject.icon || 'book'}"></i>
                </div>
                <div class="subject-content">
                    <h3 class="subject-title">${this.escapeHtml(subject.name)}</h3>
                    <p class="subject-description">${this.escapeHtml(subject.description)}</p>
                    <div class="subject-meta">
                        <span class="subject-lessons">
                            <i class="fas fa-play-circle"></i>
                            ${this.lessons.filter(l => l.subjectId === subject.id).length} lessons
                        </span>
                        <span class="subject-difficulty">
                            <i class="fas fa-signal"></i>
                            ${subject.difficulty || 'Mixed'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = subjectsHTML;
    }

    renderLessons() {
        const container = document.getElementById('lessons-grid');
        if (!container) return;

        if (this.lessons.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-play-circle"></i>
                    <h3>No lessons available</h3>
                    <p>Lessons will appear here once they are loaded</p>
                </div>
            `;
            return;
        }

        const lessonsHTML = this.lessons.map(lesson => {
            const subject = this.subjects.find(s => s.id === lesson.subjectId);
            const isCompleted = this.progress.some(p => p.lessonId === lesson.id && p.completed);
            
            return `
                <div class="lesson-card" onclick="aiLearningPlatform.showLessonDetails('${lesson.id}')">
                    <div class="lesson-header">
                        <h3 class="lesson-title">${this.escapeHtml(lesson.title)}</h3>
                        <p class="lesson-description">${this.escapeHtml(lesson.description)}</p>
                    </div>
                    <div class="lesson-footer">
                        <div class="lesson-meta">
                            <span class="lesson-difficulty">
                                <i class="fas fa-signal"></i>
                                ${lesson.difficulty}
                            </span>
                            <span class="lesson-duration">
                                <i class="fas fa-clock"></i>
                                ${lesson.duration}
                            </span>
                        </div>
                        <span class="lesson-status ${isCompleted ? 'completed' : 'incomplete'}">
                            ${isCompleted ? 'Completed' : 'Not Started'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = lessonsHTML;
    }

    renderRecommendations() {
        const container = document.getElementById('recommendations-grid');
        if (!container) return;

        if (this.recommendations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-lightbulb"></i>
                    <h3>No recommendations available</h3>
                    <p>AI recommendations will appear here based on your progress</p>
                </div>
            `;
            return;
        }

        const recommendationsHTML = this.recommendations.map(rec => {
            const lesson = this.lessons.find(l => l.id === rec.lessonId);
            if (!lesson) return '';

            return `
                <div class="recommendation-card">
                    <div class="recommendation-content">
                        <div class="recommendation-badge">
                            <i class="fas fa-robot"></i>
                            AI Recommended
                        </div>
                        <h3>${this.escapeHtml(lesson.title)}</h3>
                        <p>${this.escapeHtml(lesson.description)}</p>
                        <div class="lesson-meta">
                            <span class="lesson-difficulty">${lesson.difficulty}</span>
                            <span class="lesson-duration">${lesson.duration}</span>
                        </div>
                        <p class="recommendation-reason">${this.escapeHtml(rec.reason)}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = recommendationsHTML;
    }

    updateDashboard() {
        // Update dashboard statistics
        const totalLessonsEl = document.getElementById('total-lessons');
        const completedLessonsEl = document.getElementById('completed-lessons');
        const timeSpentEl = document.getElementById('time-spent');
        const averageScoreEl = document.getElementById('average-score');

        if (totalLessonsEl) totalLessonsEl.textContent = this.lessons.length;
        if (completedLessonsEl) {
            const completed = this.progress.filter(p => p.completed).length;
            completedLessonsEl.textContent = completed;
        }
        if (timeSpentEl) {
            const totalTime = this.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
            timeSpentEl.textContent = this.formatTime(totalTime / 60);
        }
        if (averageScoreEl) {
            const completedProgress = this.progress.filter(p => p.completed && p.score);
            const avgScore = completedProgress.length > 0 
                ? Math.round(completedProgress.reduce((sum, p) => sum + p.score, 0) / completedProgress.length)
                : 0;
            averageScoreEl.textContent = `${avgScore}%`;
        }
    }

    filterLessons() {
        const searchTerm = document.getElementById('lesson-search')?.value.toLowerCase() || '';
        const subjectFilter = document.getElementById('subject-filter')?.value || '';
        const difficultyFilter = document.getElementById('difficulty-filter')?.value || '';

        const filteredLessons = this.lessons.filter(lesson => {
            const matchesSearch = !searchTerm || 
                lesson.title.toLowerCase().includes(searchTerm) ||
                lesson.description.toLowerCase().includes(searchTerm);
            
            const matchesSubject = !subjectFilter || lesson.subjectId === subjectFilter;
            const matchesDifficulty = !difficultyFilter || lesson.difficulty === difficultyFilter;

            return matchesSearch && matchesSubject && matchesDifficulty;
        });

        // Update the lessons grid with filtered results
        const container = document.getElementById('lessons-grid');
        if (!container) return;

        if (filteredLessons.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No lessons found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        const lessonsHTML = filteredLessons.map(lesson => {
            const subject = this.subjects.find(s => s.id === lesson.subjectId);
            const isCompleted = this.progress.some(p => p.lessonId === lesson.id && p.completed);
            
            return `
                <div class="lesson-card" onclick="aiLearningPlatform.showLessonDetails('${lesson.id}')">
                    <div class="lesson-header">
                        <h3 class="lesson-title">${this.escapeHtml(lesson.title)}</h3>
                        <p class="lesson-description">${this.escapeHtml(lesson.description)}</p>
                    </div>
                    <div class="lesson-footer">
                        <div class="lesson-meta">
                            <span class="lesson-difficulty">${lesson.difficulty}</span>
                            <span class="lesson-duration">${lesson.duration}</span>
                        </div>
                        <span class="lesson-status ${isCompleted ? 'completed' : 'incomplete'}">
                            ${isCompleted ? 'Completed' : 'Not Started'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = lessonsHTML;
    }

    populateSubjectFilter() {
        const filter = document.getElementById('subject-filter');
        if (!filter) return;

        filter.innerHTML = '<option value="">All Subjects</option>';
        this.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            filter.appendChild(option);
        });
    }

    showSubjectDetails(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        console.log(`🔍 Loading details for subject: ${subject.name} (${subjectId})`);
        
        // Filter lessons for this subject
        const subjectLessons = this.lessons.filter(lesson => lesson.subjectId === subjectId);
        console.log(`🔍 Found ${subjectLessons.length} lessons for ${subject.name}`);
        
        if (subjectLessons.length === 0) {
            this.showToast(`No lessons available for ${subject.name}`, 'warning');
            return;
        }

        // Show subject details as full page instead of modal
        this.showSubjectFullPage(subject, subjectLessons);
    }

    showSubjectFullPage(subject, lessons) {
        // Hide all main content sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Create or update the subject full page content
        let subjectPage = document.getElementById('subject-full-page');
        if (!subjectPage) {
            subjectPage = this.createSubjectFullPage();
        }

        // Populate with subject and lessons data
        document.getElementById('subject-page-title').textContent = subject.name;
        document.getElementById('subject-page-description').textContent = subject.description;
        document.getElementById('subject-page-icon').className = `fas fa-${subject.icon}`;
        document.getElementById('subject-page-icon').style.color = subject.color;
        
        // Update lessons count
        const lessonsCount = document.getElementById('subject-page-lessons-count');
        if (lessonsCount) {
            lessonsCount.textContent = `${lessons.length} lessons available`;
        }

        // Populate lessons list
        const lessonsContainer = document.getElementById('subject-page-lessons-list');
        if (lessonsContainer) {
            lessonsContainer.innerHTML = lessons.map(lesson => `
                <div class="lesson-card" onclick="aiLearningPlatform.showLessonDetails('${lesson.id}')">
                    <div class="lesson-card-header">
                        <h4 class="lesson-card-title">${this.escapeHtml(lesson.title)}</h4>
                        <span class="lesson-card-difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                    </div>
                    <p class="lesson-card-description">${this.escapeHtml(lesson.description)}</p>
                    <div class="lesson-card-meta">
                        <span class="lesson-duration">⏱️ ${lesson.duration}</span>
                        <span class="lesson-order">📚 Lesson ${lesson.order}</span>
                    </div>
                </div>
            `).join('');
        }

        // Show the subject page
        subjectPage.style.display = 'block';
        
        this.showToast(`Loaded ${lessons.length} lessons for ${subject.name}`, 'success');
    }

    createSubjectFullPage() {
        const subjectPage = document.createElement('div');
        subjectPage.id = 'subject-full-page';
        subjectPage.className = 'content-section';
        subjectPage.style.display = 'none';
        subjectPage.innerHTML = `
            <div class="subject-page-container">
                <div class="subject-page-header">
                    <button class="btn btn-secondary back-button" onclick="aiLearningPlatform.showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <div class="subject-page-info">
                        <div class="subject-page-icon-container">
                            <i id="subject-page-icon" class="fas fa-book"></i>
                        </div>
                        <div class="subject-page-details">
                            <h1 id="subject-page-title">Subject Name</h1>
                            <p id="subject-page-description">Subject description will appear here.</p>
                            <div class="subject-page-meta">
                                <span id="subject-page-lessons-count" class="subject-lessons-count">
                                    <i class="fas fa-play-circle"></i> 0 lessons available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="subject-page-content">
                    <div class="lessons-section">
                        <h2>Available Lessons</h2>
                        <div id="subject-page-lessons-list" class="lessons-grid">
                            <!-- Lessons will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after the header
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(subjectPage);
        }
        
        return subjectPage;
    }

    showDashboard() {
        // Hide subject page
        const subjectPage = document.getElementById('subject-full-page');
        if (subjectPage) {
            subjectPage.style.display = 'none';
        }

        // Show dashboard section
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection) {
            dashboardSection.style.display = 'block';
        }
    }

    showSubjectLessonsModal(subject, lessons) {
        // Create or update the subject details modal
        let modal = document.getElementById('subject-details-modal');
        if (!modal) {
            modal = this.createSubjectDetailsModal();
        }

        // Populate modal with subject and lessons data
        document.getElementById('subject-details-title').textContent = subject.name;
        document.getElementById('subject-details-description').textContent = subject.description;
        
        // Update lessons count
        const lessonsCount = document.getElementById('subject-lessons-count');
        if (lessonsCount) {
            lessonsCount.textContent = `${lessons.length} lessons`;
        }

        // Populate lessons list
        const lessonsContainer = document.getElementById('subject-lessons-list');
        if (lessonsContainer) {
            lessonsContainer.innerHTML = lessons.map(lesson => `
                <div class="lesson-item" onclick="aiLearningPlatform.showLessonDetails('${lesson.id}')">
                    <div class="lesson-item-header">
                        <h4 class="lesson-item-title">${this.escapeHtml(lesson.title)}</h4>
                        <span class="lesson-item-difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                    </div>
                    <p class="lesson-item-description">${this.escapeHtml(lesson.description)}</p>
                    <div class="lesson-item-meta">
                        <span class="lesson-duration">⏱️ ${lesson.duration}</span>
                        <span class="lesson-order">📚 Lesson ${lesson.order}</span>
                    </div>
                </div>
            `).join('');
        }

        // Show the modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        this.showToast(`Loaded ${lessons.length} lessons for ${subject.name}`, 'success');
    }

    createSubjectDetailsModal() {
        const modal = document.createElement('div');
        modal.id = 'subject-details-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content subject-details-modal">
                <div class="modal-header">
                    <h3 id="subject-details-title">Subject Details</h3>
                    <button class="modal-close" onclick="aiLearningPlatform.closeSubjectDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="subject-details-info">
                        <p id="subject-details-description">Subject description will appear here.</p>
                        <div class="subject-meta">
                            <span id="subject-lessons-count" class="subject-lessons">
                                <i class="fas fa-play-circle"></i> 0 lessons
                            </span>
                        </div>
                    </div>
                    <div class="subject-lessons-section">
                        <h4>Available Lessons</h4>
                        <div id="subject-lessons-list" class="lessons-list">
                            <!-- Lessons will be populated here -->
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="aiLearningPlatform.closeSubjectDetailsModal()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    closeSubjectDetailsModal() {
        const modal = document.getElementById('subject-details-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showLessonDetails(lessonId) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (!lesson) return;

        // Show lesson modal
        const modal = document.getElementById('lesson-modal');
        if (modal) {
            document.getElementById('modal-lesson-title').textContent = lesson.title;
            document.getElementById('modal-lesson-description').textContent = lesson.description;
            document.getElementById('modal-lesson-difficulty').textContent = lesson.difficulty;
            document.getElementById('modal-lesson-duration').textContent = lesson.duration;
            document.getElementById('modal-lesson-content').innerHTML = `<p>${lesson.content}</p>`;
            
            const subject = this.subjects.find(s => s.id === lesson.subjectId);
            document.getElementById('modal-lesson-subject').textContent = subject?.name || 'Unknown';
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    markLessonComplete() {
        const modal = document.getElementById('lesson-modal');
        if (!modal) return;

        const lessonId = modal.dataset.lessonId;
        if (!lessonId) return;

        // Update progress
        const existingProgress = this.progress.find(p => p.lessonId === lessonId);
        if (existingProgress) {
            existingProgress.completed = true;
            existingProgress.score = 100;
        } else {
            this.progress.push({
                lessonId: lessonId,
                completed: true,
                score: 100,
                timeSpent: 0,
                createdAt: new Date().toISOString()
            });
        }

        this.saveProgressToStorage();
        this.updateDashboard();
        this.showToast('Lesson marked as complete!', 'success');
        this.closeModal();
    }

    markLessonIncomplete() {
        const modal = document.getElementById('lesson-modal');
        if (!modal) return;

        const lessonId = modal.dataset.lessonId;
        if (!lessonId) return;

        // Update progress
        const existingProgress = this.progress.find(p => p.lessonId === lessonId);
        if (existingProgress) {
            existingProgress.completed = false;
        }

        this.saveProgressToStorage();
        this.updateDashboard();
        this.showToast('Lesson marked as incomplete', 'info');
        this.closeModal();
    }

    loadProgressFromStorage() {
        try {
            const stored = localStorage.getItem('learningProgress');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading progress:', error);
            return [];
        }
    }

    saveProgressToStorage() {
        try {
            localStorage.setItem('learningProgress', JSON.stringify(this.progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
}

// Global functions for onclick handlers
function showSection(sectionName) {
    if (window.aiLearningPlatform) {
        window.aiLearningPlatform.showSection(sectionName);
    }
}

// Initialize the application
console.log('🚀 Starting AI Learning Platform initialization...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded, creating app instance...');
    
    // Create the app instance
    window.aiLearningPlatform = new AILearningPlatform();
    
    console.log('✅ App instance created successfully');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Add some helpful console commands for development
console.log('🤖 AI Learning Platform loaded! Available commands:');
console.log('- aiLearningPlatform.loadSubjects() - Load all subjects');
console.log('- aiLearningPlatform.loadLessons() - Load all lessons');
console.log('- aiLearningPlatform.loadStudents() - Load all students');
console.log('- aiLearningPlatform.loadRecommendations() - Load AI recommendations');
console.log('- aiLearningPlatform.loadAnalytics() - Load analytics data');

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.aiLearningPlatform) {
        aiLearningPlatform.showToast('Connection restored!', 'success');
        aiLearningPlatform.loadInitialData();
    }
});

window.addEventListener('offline', () => {
    if (window.aiLearningPlatform) {
        aiLearningPlatform.showToast('You are offline. Some features may not be available.', 'warning');
    }
});