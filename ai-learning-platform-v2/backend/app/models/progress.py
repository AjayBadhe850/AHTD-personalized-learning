"""
Progress model for tracking student learning progress
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Progress(Base):
    """Progress model for tracking student learning"""
    
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    
    # Progress status
    is_completed = Column(Boolean, default=False)
    completion_percentage = Column(Float, default=0.0)  # 0.0 to 100.0
    
    # Performance metrics
    score = Column(Float, default=0.0)  # Quiz/assessment score
    time_spent_minutes = Column(Integer, default=0)
    attempts_count = Column(Integer, default=0)
    
    # Detailed progress data
    progress_data = Column(JSON, default=dict)  # Detailed progress tracking
    quiz_answers = Column(JSON, default=list)  # Student's quiz responses
    notes = Column(String(1000), nullable=True)  # Student notes
    
    # Learning analytics
    difficulty_rating = Column(Integer, nullable=True)  # Student's difficulty rating (1-5)
    helpfulness_rating = Column(Integer, nullable=True)  # Student's helpfulness rating (1-5)
    learning_style_preference = Column(String(50), nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    last_accessed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("Student", back_populates="progress_records")
    lesson = relationship("Lesson", back_populates="progress_records")
    
    def __repr__(self):
        return f"<Progress(id={self.id}, student_id={self.student_id}, lesson_id={self.lesson_id}, completed={self.is_completed})>"
