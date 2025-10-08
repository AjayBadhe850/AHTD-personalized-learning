"""
Subject model for organizing learning content
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Subject(Base):
    """Subject model for organizing lessons"""
    
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)  # Icon class or URL
    color = Column(String(7), nullable=True)  # Hex color code
    
    # Subject metadata
    difficulty_levels = Column(JSON, default=list)  # Available difficulty levels
    prerequisites = Column(JSON, default=list)  # Required subjects
    learning_objectives = Column(JSON, default=list)  # Learning goals
    
    # Content organization
    order_index = Column(Integer, default=0)  # For sorting
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Statistics
    total_lessons = Column(Integer, default=0)
    total_enrollments = Column(Integer, default=0)
    average_rating = Column(Integer, default=0)  # 1-5 scale
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    lessons = relationship("Lesson", back_populates="subject")
    
    def __repr__(self):
        return f"<Subject(id={self.id}, name='{self.name}')>"
