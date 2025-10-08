"""
Typing statistics model for tracking typing performance
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class TypingStats(Base):
    """Typing statistics model for tracking typing performance"""
    
    __tablename__ = "typing_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    
    # Typing performance metrics
    words_per_minute = Column(Float, nullable=False)
    accuracy_percentage = Column(Float, nullable=False)
    characters_per_minute = Column(Float, nullable=True)
    
    # Typing test details
    text_length = Column(Integer, nullable=False)  # Total characters in test text
    text_type = Column(String(50), nullable=True)  # practice, assessment, lesson, etc.
    test_duration_seconds = Column(Integer, nullable=False)
    
    # Error analysis
    total_errors = Column(Integer, default=0)
    corrected_errors = Column(Integer, default=0)
    uncorrected_errors = Column(Integer, default=0)
    error_details = Column(JSON, default=list)  # Detailed error analysis
    
    # Typing patterns
    average_keystroke_time = Column(Float, nullable=True)  # Milliseconds
    pause_frequency = Column(Float, nullable=True)  # Pauses per minute
    backspace_frequency = Column(Float, nullable=True)  # Backspaces per minute
    
    # Test content
    test_text = Column(Text, nullable=True)  # The text that was typed
    difficulty_level = Column(String(20), nullable=True)  # beginner, intermediate, advanced
    
    # Performance categories
    speed_category = Column(String(20), nullable=True)  # slow, average, fast, expert
    accuracy_category = Column(String(20), nullable=True)  # poor, good, excellent
    
    # Improvement tracking
    improvement_from_last = Column(Float, nullable=True)  # WPM improvement
    improvement_percentage = Column(Float, nullable=True)  # Percentage improvement
    
    # Session context
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("Student", back_populates="typing_stats")
    session = relationship("Session")
    
    def __repr__(self):
        return f"<TypingStats(id={self.id}, student_id={self.student_id}, wpm={self.words_per_minute}, accuracy={self.accuracy_percentage})>"
