"""
Student model for learning platform users
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Student(Base):
    """Student model for learning platform"""
    
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Student information
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    age = Column(Integer, nullable=True)
    grade_level = Column(String(50), nullable=True)
    
    # Learning preferences
    interests = Column(JSON, default=list)  # List of interest strings
    learning_goals = Column(JSON, default=list)  # List of goal strings
    preferred_learning_style = Column(String(50), nullable=True)
    
    # Parent/Guardian information
    parent_name = Column(String(255), nullable=True)
    parent_email = Column(String(255), nullable=True)
    parent_phone = Column(String(20), nullable=True)
    emergency_contact = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    
    # Learning statistics
    total_time_spent = Column(Integer, default=0)  # in minutes
    total_lessons_completed = Column(Integer, default=0)
    average_typing_speed = Column(Integer, default=0)  # WPM
    total_sessions = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_active = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="students")
    progress_records = relationship("Progress", back_populates="student")
    sessions = relationship("Session", back_populates="student")
    typing_stats = relationship("TypingStats", back_populates="student")
    
    def __repr__(self):
        return f"<Student(id={self.id}, name='{self.name}', email='{self.email}')>"
