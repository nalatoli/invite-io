from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class GuestBase(BaseModel):
    name: str


class GuestCreate(GuestBase):
    pass


class WeddingGuest(GuestBase):
    id: int
    group_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class HennaGuest(GuestBase):
    id: int
    group_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class GroupBase(BaseModel):
    name: str


class GroupResponse(GroupBase):
    id: int
    invited_to_nikkah: bool
    invited_to_wedding: bool
    invited_to_henna: bool
    max_guests_wedding: int
    max_guests_henna: int
    has_accepted_wedding: bool
    has_accepted_henna: bool
    has_rsvped_wedding: bool
    has_rsvped_henna: bool
    wedding_guests: List[WeddingGuest] = []
    henna_guests: List[HennaGuest] = []

    class Config:
        from_attributes = True


class RSVPRequest(BaseModel):
    event: str  # "wedding" or "henna"
    accept: bool
    guests: List[str] = []


class RSVPResponse(BaseModel):
    success: bool
    message: str
    group: Optional[GroupResponse] = None
