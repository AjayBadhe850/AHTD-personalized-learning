"""
API v1 router configuration
"""

from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth,
    students,
    subjects,
    lessons,
    progress,
    sessions,
    typing_stats,
    notifications,
    analytics
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(typing_stats.router, prefix="/typing", tags=["typing"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
