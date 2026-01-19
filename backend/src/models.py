from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database import Base


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)

    # Event visibility flags
    invited_to_nikkah = Column(Boolean, default=True)
    invited_to_wedding = Column(Boolean, default=True)
    invited_to_henna = Column(Boolean, default=True)

    # Guest limits per event
    max_guests_wedding = Column(Integer, nullable=False)
    max_guests_henna = Column(Integer, nullable=False)

    # RSVP status per event
    has_accepted_wedding = Column(Boolean, default=False)
    has_accepted_henna = Column(Boolean, default=False)
    has_rsvped_wedding = Column(Boolean, default=False)
    has_rsvped_henna = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    wedding_guests = relationship("WeddingGuest", back_populates="group", cascade="all, delete-orphan")
    henna_guests = relationship("HennaGuest", back_populates="group", cascade="all, delete-orphan")


class WeddingGuest(Base):
    __tablename__ = "wedding_guests"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("Group", back_populates="wedding_guests")


class HennaGuest(Base):
    __tablename__ = "henna_guests"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("Group", back_populates="henna_guests")
