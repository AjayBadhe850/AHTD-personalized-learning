"""
Student management endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import structlog

from app.core.database import get_db
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse, StudentList
from app.services.student_service import StudentService
from app.core.exceptions import NotFoundError, ValidationError

logger = structlog.get_logger()
router = APIRouter()


@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_data: StudentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new student"""
    try:
        student_service = StudentService(db)
        student = await student_service.create_student(student_data)
        
        logger.info(
            "Student created successfully",
            student_id=student.id,
            student_email=student.email
        )
        
        return student
    except Exception as e:
        logger.error("Failed to create student", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create student"
        )


@router.get("/", response_model=StudentList)
async def list_students(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all students with optional filtering"""
    try:
        student_service = StudentService(db)
        students, total = await student_service.list_students(
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active
        )
        
        return StudentList(
            students=students,
            total=total,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        logger.error("Failed to list students", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve students"
        )


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific student by ID"""
    try:
        student_service = StudentService(db)
        student = await student_service.get_student_by_id(student_id)
        
        if not student:
            raise NotFoundError("Student", str(student_id))
        
        return student
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Failed to get student", student_id=student_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve student"
        )


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_data: StudentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a student"""
    try:
        student_service = StudentService(db)
        student = await student_service.update_student(student_id, student_data)
        
        if not student:
            raise NotFoundError("Student", str(student_id))
        
        logger.info("Student updated successfully", student_id=student_id)
        return student
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Failed to update student", student_id=student_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update student"
        )


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a student (soft delete)"""
    try:
        student_service = StudentService(db)
        success = await student_service.delete_student(student_id)
        
        if not success:
            raise NotFoundError("Student", str(student_id))
        
        logger.info("Student deleted successfully", student_id=student_id)
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Failed to delete student", student_id=student_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete student"
        )


@router.get("/{student_id}/analytics")
async def get_student_analytics(
    student_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed analytics for a student"""
    try:
        student_service = StudentService(db)
        analytics = await student_service.get_student_analytics(student_id)
        
        if not analytics:
            raise NotFoundError("Student", str(student_id))
        
        return analytics
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Failed to get student analytics", student_id=student_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve student analytics"
        )
