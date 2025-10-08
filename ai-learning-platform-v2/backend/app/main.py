"""
AI Learning Platform - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.core.database import engine, Base

# Create FastAPI application
app = FastAPI(
    title="AI Learning Platform API",
    description="A modern, scalable learning platform with AI-powered recommendations",
    version="2.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing information"""
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate processing time
    process_time = time.time() - start_time
    
    # Add timing header
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Learning Platform API",
        "version": "2.0.0",
        "timestamp": time.time()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Learning Platform API v2.0",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "features": [
            "Modern FastAPI backend",
            "React + TypeScript frontend",
            "Real-time WebSocket support",
            "Advanced authentication",
            "Comprehensive analytics",
            "Mobile-first design"
        ]
    }

# Demo endpoints
@app.get("/api/v1/demo/students")
async def demo_students():
    """Demo students endpoint"""
    return {
        "students": [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "age": 16,
                "grade": "10th Grade",
                "total_lessons_completed": 25,
                "average_score": 85
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "email": "jane@example.com",
                "age": 15,
                "grade": "9th Grade",
                "total_lessons_completed": 18,
                "average_score": 92
            }
        ]
    }

@app.get("/api/v1/demo/subjects")
async def demo_subjects():
    """Demo subjects endpoint"""
    return {
        "subjects": [
            {
                "id": 1,
                "name": "Mathematics",
                "description": "Advanced mathematics and problem solving",
                "icon": "fas fa-calculator",
                "color": "#3b82f6",
                "total_lessons": 45
            },
            {
                "id": 2,
                "name": "Science",
                "description": "Physics, Chemistry, and Biology",
                "icon": "fas fa-flask",
                "color": "#10b981",
                "total_lessons": 38
            },
            {
                "id": 3,
                "name": "Programming",
                "description": "Computer programming and software development",
                "icon": "fas fa-code",
                "color": "#8b5cf6",
                "total_lessons": 52
            }
        ]
    }

@app.get("/api/v1/demo/lessons")
async def demo_lessons():
    """Demo lessons endpoint"""
    return {
        "lessons": [
            {
                "id": 1,
                "title": "Introduction to Algebra",
                "description": "Learn the basics of algebraic expressions",
                "subject": "Mathematics",
                "difficulty": "beginner",
                "duration": "30 minutes",
                "completed": False
            },
            {
                "id": 2,
                "title": "Photosynthesis Process",
                "description": "Understanding how plants make food",
                "subject": "Science",
                "difficulty": "intermediate",
                "duration": "45 minutes",
                "completed": True
            },
            {
                "id": 3,
                "title": "Python Basics",
                "description": "Introduction to Python programming",
                "subject": "Programming",
                "difficulty": "beginner",
                "duration": "60 minutes",
                "completed": False
            }
        ]
    }

@app.get("/api/v1/demo/analytics")
async def demo_analytics():
    """Demo analytics endpoint"""
    return {
        "total_students": 150,
        "total_lessons": 135,
        "total_completions": 2847,
        "average_score": 87.5,
        "weekly_progress": [
            {"day": "Mon", "completions": 45},
            {"day": "Tue", "completions": 52},
            {"day": "Wed", "completions": 38},
            {"day": "Thu", "completions": 61},
            {"day": "Fri", "completions": 48},
            {"day": "Sat", "completions": 23},
            {"day": "Sun", "completions": 19}
        ],
        "subject_performance": [
            {"subject": "Mathematics", "average_score": 89.2, "completions": 856},
            {"subject": "Science", "average_score": 85.7, "completions": 743},
            {"subject": "Programming", "average_score": 91.3, "completions": 624},
            {"subject": "Literature", "average_score": 82.1, "completions": 624}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )