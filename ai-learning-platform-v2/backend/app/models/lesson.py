"""
Lesson model for learning content
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Lesson(Base):
    """Lesson model for learning content"""
    
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    
    # Lesson information
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)  # Main lesson content
    
    # Lesson metadata
    difficulty = Column(String(20), nullable=False)  # beginner, intermediate, advanced
    duration_minutes = Column(Integer, default=30)
    order_index = Column(Integer, default=0)  # For sequencing within subject
    
    # Content structure
    learning_objectives = Column(JSON, default=list)
    prerequisites = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    
    # Media and resources
    video_url = Column(String(500), nullable=True)
    audio_url = Column(String(500), nullable=True)
    attachments = Column(JSON, default=list)  # List of file URLs
    interactive_elements = Column(JSON, default=list)  # Quizzes, exercises, etc.
    
    # Assessment
    has_quiz = Column(Boolean, default=False)
    quiz_questions = Column(JSON, default=list)
    passing_score = Column(Integer, default=70)  # Percentage
    
    # Statistics
    completion_rate = Column(Float, default=0.0)
    average_score = Column(Float, default=0.0)
    total_attempts = Column(Integer, default=0)
    total_completions = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    subject = relationship("Subject", back_populates="lessons")
    progress_records = relationship("Progress", back_populates="lesson")
    
    def __repr__(self):
        return f"<Lesson(id={self.id}, title='{self.title}', difficulty='{self.difficulty}')>"
