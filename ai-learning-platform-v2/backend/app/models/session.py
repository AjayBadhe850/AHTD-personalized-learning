"""
Session model for tracking student learning sessions
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Session(Base):
    """Session model for tracking learning sessions"""
    
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    
    # Session information
    session_type = Column(String(50), default="learning")  # learning, typing_test, quiz, etc.
    device_info = Column(String(255), nullable=True)
    browser_info = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    user_agent = Column(Text, nullable=True)
    
    # Location and context
    location = Column(String(255), nullable=True)
    referrer = Column(String(500), nullable=True)
    
    # Session timing
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=0)
    
    # Session activity
    pages_visited = Column(JSON, default=list)
    lessons_accessed = Column(JSON, default=list)
    activities = Column(JSON, default=list)  # Detailed activity log
    
    # Performance metrics
    total_actions = Column(Integer, default=0)
    idle_time_minutes = Column(Integer, default=0)
    focus_time_minutes = Column(Integer, default=0)
    
    # Session status
    is_active = Column(Boolean, default=True)
    logout_reason = Column(String(100), nullable=True)  # user_logout, timeout, etc.
    
    # Learning analytics
    learning_efficiency = Column(Float, nullable=True)  # Calculated efficiency score
    engagement_score = Column(Float, nullable=True)  # Calculated engagement score
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    student = relationship("Student", back_populates="sessions")
    
    def __repr__(self):
        return f"<Session(id={self.id}, student_id={self.student_id}, type='{self.session_type}', active={self.is_active})>"
