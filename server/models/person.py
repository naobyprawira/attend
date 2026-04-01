from sqlalchemy import Column, Index, Integer, String, Text

from server.models.base import Base


class KnownFace(Base):
    __tablename__ = "known_faces"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    photo_path = Column(String, nullable=False)
    embedding = Column(Text, nullable=True)     # JSON string
    created_at = Column(String, nullable=False)

    __table_args__ = (Index("idx_faces_name", "name"),)
