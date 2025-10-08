"""
Notification model for tracking system notifications
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Notification(Base):
    """Notification model for system notifications"""
    
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    
    # Notification details
    type = Column(String(50), nullable=False)  # login, logout, progress, achievement, etc.
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    # Recipient information
    recipient_type = Column(String(20), default="student")  # student, parent, admin
    recipient_email = Column(String(255), nullable=True)
    recipient_phone = Column(String(20), nullable=True)
    
    # Delivery information
    delivery_method = Column(String(20), nullable=False)  # email, sms, push, in_app
    delivery_status = Column(String(20), default="pending")  # pending, sent, delivered, failed
    
    # Notification data
    notification_data = Column(JSON, default=dict)  # Additional data for the notification
    template_id = Column(String(100), nullable=True)  # Template used for the notification
    
    # Timing
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Status
    is_read = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    priority = Column(String(10), default="normal")  # low, normal, high, urgent
    
    # Error handling
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    student = relationship("Student")
    
    def __repr__(self):
        return f"<Notification(id={self.id}, type='{self.type}', status='{self.delivery_status}')>"
