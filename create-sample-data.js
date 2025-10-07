const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Sample subjects data
const sampleSubjects = [
    {
        id: 'math-001',
        name: 'Mathematics',
        description: 'Comprehensive mathematics curriculum covering algebra, geometry, calculus, and statistics.',
        difficulty: 'mixed',
        icon: 'calculator',
        color: '#4f46e5',
        createdAt: new Date().toISOString()
    },
    {
        id: 'science-001',
        name: 'Science',
        description: 'Explore physics, chemistry, biology, and earth sciences with interactive experiments.',
        difficulty: 'mixed',
        icon: 'flask',
        color: '#059669',
        createdAt: new Date().toISOString()
    },
    {
        id: 'programming-001',
        name: 'Programming',
        description: 'Learn programming languages, algorithms, and software development practices.',
        difficulty: 'mixed',
        icon: 'code',
        color: '#7c3aed',
        createdAt: new Date().toISOString()
    },
    {
        id: 'literature-001',
        name: 'Literature',
        description: 'Study classic and contemporary literature, writing techniques, and literary analysis.',
        difficulty: 'mixed',
        icon: 'book',
        color: '#ea580c',
        createdAt: new Date().toISOString()
    },
    {
        id: 'history-001',
        name: 'History',
        description: 'Discover world history, historical events, and their impact on modern society.',
        difficulty: 'mixed',
        icon: 'landmark',
        color: '#dc2626',
        createdAt: new Date().toISOString()
    }
];

// Sample lessons data
const sampleLessons = [
    // Mathematics lessons
    {
        id: 'math-lesson-001',
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebraic expressions, variables, and equations.',
        content: 'Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. In this lesson, we will explore the fundamental concepts of algebra including variables, constants, coefficients, and algebraic expressions.',
        subjectId: 'math-001',
        difficulty: 'beginner',
        duration: '45 minutes',
        order: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 'math-lesson-002',
        title: 'Linear Equations',
        description: 'Master solving linear equations with one and two variables.',
        content: 'Linear equations are equations of the first degree, meaning they involve only first powers of variables. We will learn various methods to solve linear equations including substitution, elimination, and graphical methods.',
        subjectId: 'math-001',
        difficulty: 'intermediate',
        duration: '60 minutes',
        order: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 'math-lesson-003',
        title: 'Quadratic Functions',
        description: 'Explore quadratic equations and their graphical representations.',
        content: 'Quadratic functions are polynomial functions of degree 2. They have the general form f(x) = ax² + bx + c. We will study their properties, graphing techniques, and methods for solving quadratic equations.',
        subjectId: 'math-001',
        difficulty: 'advanced',
        duration: '75 minutes',
        order: 3,
        createdAt: new Date().toISOString()
    },
    // Science lessons
    {
        id: 'science-lesson-001',
        title: 'Introduction to Physics',
        description: 'Discover the fundamental principles of physics and motion.',
        content: 'Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force. We will explore Newton\'s laws of motion, gravity, and basic mechanics.',
        subjectId: 'science-001',
        difficulty: 'beginner',
        duration: '50 minutes',
        order: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 'science-lesson-002',
        title: 'Chemical Reactions',
        description: 'Learn about different types of chemical reactions and their applications.',
        content: 'Chemical reactions are processes that lead to the chemical transformation of one set of chemical substances to another. We will study synthesis, decomposition, single replacement, and double replacement reactions.',
        subjectId: 'science-001',
        difficulty: 'intermediate',
        duration: '55 minutes',
        order: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 'science-lesson-003',
        title: 'Cell Biology',
        description: 'Explore the structure and function of cells in living organisms.',
        content: 'Cell biology is the study of cell structure and function, and it revolves around the concept that the cell is the fundamental unit of life. We will examine prokaryotic and eukaryotic cells, organelles, and cellular processes.',
        subjectId: 'science-001',
        difficulty: 'intermediate',
        duration: '65 minutes',
        order: 3,
        createdAt: new Date().toISOString()
    },
    // Programming lessons
    {
        id: 'programming-lesson-001',
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming language.',
        content: 'JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web. We will cover variables, data types, functions, and basic programming concepts.',
        subjectId: 'programming-001',
        difficulty: 'beginner',
        duration: '90 minutes',
        order: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 'programming-lesson-002',
        title: 'Object-Oriented Programming',
        description: 'Master the concepts of classes, objects, and inheritance.',
        content: 'Object-oriented programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code. We will learn about classes, objects, inheritance, polymorphism, and encapsulation.',
        subjectId: 'programming-001',
        difficulty: 'intermediate',
        duration: '120 minutes',
        order: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 'programming-lesson-003',
        title: 'Data Structures and Algorithms',
        description: 'Study fundamental data structures and algorithmic problem-solving.',
        content: 'Data structures are ways of organizing and storing data in a computer so that it can be accessed and modified efficiently. We will explore arrays, linked lists, stacks, queues, trees, and graphs along with common algorithms.',
        subjectId: 'programming-001',
        difficulty: 'advanced',
        duration: '150 minutes',
        order: 3,
        createdAt: new Date().toISOString()
    },
    // Literature lessons
    {
        id: 'literature-lesson-001',
        title: 'Introduction to Poetry',
        description: 'Explore different forms of poetry and literary devices.',
        content: 'Poetry is a form of literature that uses aesthetic and rhythmic qualities of language to evoke meanings. We will study various poetic forms, literary devices like metaphor and simile, and analyze famous poems.',
        subjectId: 'literature-001',
        difficulty: 'beginner',
        duration: '40 minutes',
        order: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 'literature-lesson-002',
        title: 'Shakespearean Drama',
        description: 'Study the works of William Shakespeare and Elizabethan theater.',
        content: 'William Shakespeare is widely regarded as the greatest writer in the English language. We will examine his major plays, sonnets, and the historical context of Elizabethan theater.',
        subjectId: 'literature-001',
        difficulty: 'intermediate',
        duration: '80 minutes',
        order: 2,
        createdAt: new Date().toISOString()
    },
    // History lessons
    {
        id: 'history-lesson-001',
        title: 'Ancient Civilizations',
        description: 'Discover the rise and fall of ancient civilizations.',
        content: 'Ancient civilizations laid the foundation for modern society. We will explore the achievements of Mesopotamia, Egypt, Greece, Rome, and other early civilizations.',
        subjectId: 'history-001',
        difficulty: 'beginner',
        duration: '70 minutes',
        order: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 'history-lesson-002',
        title: 'World Wars',
        description: 'Study the causes, events, and consequences of World War I and II.',
        content: 'The World Wars were global conflicts that shaped the 20th century. We will analyze the political, economic, and social factors that led to these wars and their lasting impact.',
        subjectId: 'history-001',
        difficulty: 'intermediate',
        duration: '100 minutes',
        order: 2,
        createdAt: new Date().toISOString()
    }
];

// Sample syllabi data
const sampleSyllabi = [
    {
        id: 'syllabus-math-001',
        name: 'Complete Mathematics Course',
        description: 'A comprehensive mathematics curriculum covering all major topics from basic algebra to advanced calculus.',
        subjectId: 'math-001',
        lessons: ['math-lesson-001', 'math-lesson-002', 'math-lesson-003'],
        duration: '12 weeks',
        createdAt: new Date().toISOString(),
        isActive: true
    },
    {
        id: 'syllabus-science-001',
        name: 'Integrated Science Program',
        description: 'An integrated approach to learning physics, chemistry, and biology with hands-on experiments.',
        subjectId: 'science-001',
        lessons: ['science-lesson-001', 'science-lesson-002', 'science-lesson-003'],
        duration: '16 weeks',
        createdAt: new Date().toISOString(),
        isActive: true
    },
    {
        id: 'syllabus-programming-001',
        name: 'Full-Stack Development Track',
        description: 'Complete programming curriculum from basics to advanced web development.',
        subjectId: 'programming-001',
        lessons: ['programming-lesson-001', 'programming-lesson-002', 'programming-lesson-003'],
        duration: '20 weeks',
        createdAt: new Date().toISOString(),
        isActive: true
    }
];

// Create all data files
async function createSampleData() {
    try {
        console.log('Creating sample data for AI Learning Platform...');
        
        // Create subjects
        fs.writeJsonSync(path.join(DATA_DIR, 'subjects.json'), sampleSubjects);
        console.log('✅ Subjects data created');
        
        // Create lessons
        fs.writeJsonSync(path.join(DATA_DIR, 'lessons.json'), sampleLessons);
        console.log('✅ Lessons data created');
        
        // Create syllabi
        fs.writeJsonSync(path.join(DATA_DIR, 'syllabi.json'), sampleSyllabi);
        console.log('✅ Syllabi data created');
        
        // Create empty data files
        fs.writeJsonSync(path.join(DATA_DIR, 'students.json'), []);
        fs.writeJsonSync(path.join(DATA_DIR, 'sessions.json'), []);
        fs.writeJsonSync(path.join(DATA_DIR, 'typingStats.json'), []);
        fs.writeJsonSync(path.join(DATA_DIR, 'progress.json'), []);
        fs.writeJsonSync(path.join(DATA_DIR, 'recommendations.json'), []);
        console.log('✅ Empty data files created');
        
        console.log('\n🎉 Sample data creation completed!');
        console.log('\nFeatures available:');
        console.log('📚 5 Subjects with comprehensive lessons');
        console.log('🎓 13 Lessons across different difficulty levels');
        console.log('📋 3 Sample syllabi');
        console.log('👥 Student registration and management');
        console.log('⌨️  Typing speed testing and tracking');
        console.log('📊 Detailed analytics and progress tracking');
        console.log('🔄 Session tracking and time monitoring');
        console.log('\nYou can now start the server with: npm start');
        
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

createSampleData();