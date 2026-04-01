from sqlalchemy import Column, Float, Index, Integer, String, Text

from server.models.base import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    person_name = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    bbox = Column(Text, nullable=True)          # JSON string
    thumbnail = Column(Text, nullable=True)
    frame_number = Column(Integer, nullable=True)
    camera_id = Column(String, nullable=True)
    priority = Column(String, nullable=False, default="medium")
    acknowledged = Column(Integer, nullable=False, default=0)
    acknowledged_by = Column(String, nullable=True)
    acknowledged_at = Column(String, nullable=True)

    __table_args__ = (
        Index("idx_events_timestamp", "timestamp"),
        Index("idx_events_type", "event_type"),
        Index("idx_events_person", "person_name"),
        Index("idx_events_camera", "camera_id"),
    )
