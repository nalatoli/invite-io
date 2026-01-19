from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Group, WeddingGuest, HennaGuest
from src.schemas import GroupResponse, RSVPRequest, RSVPResponse

router = APIRouter()


@router.get("/verify/{token}", response_model=GroupResponse)
def verify_group(token: str, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.token == token).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invitation token"
        )
    return group


@router.post("/rsvp/{token}", response_model=RSVPResponse)
def submit_rsvp(token: str, rsvp_data: RSVPRequest, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.token == token).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invitation token"
        )

    # Validate event type
    if rsvp_data.event not in ["wedding", "henna"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event must be either 'wedding' or 'henna'"
        )

    # Determine which event we're handling
    is_wedding = rsvp_data.event == "wedding"
    max_guests = group.max_guests_wedding if is_wedding else group.max_guests_henna
    guest_model = WeddingGuest if is_wedding else HennaGuest

    if rsvp_data.accept:
        guest_count = len(rsvp_data.guests)

        # max_guests = 0 means no guests allowed (only RSVP yes/no)
        # max_guests = -1 means unlimited guests
        # max_guests > 0 means specific limit
        if max_guests == 0:
            if guest_count > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This invitation does not allow additional guests"
                )
        elif max_guests > 0 and guest_count > max_guests:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add {guest_count} guests. Maximum allowed: {max_guests}"
            )

        # Clear existing guests for this event
        db.query(guest_model).filter(guest_model.group_id == group.id).delete()

        # Add new guests if any
        for guest_name in rsvp_data.guests:
            if not guest_name.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Guest names cannot be empty"
                )
            new_guest = guest_model(group_id=group.id, name=guest_name.strip())
            db.add(new_guest)

        # Update acceptance status for this event
        if is_wedding:
            group.has_accepted_wedding = True
            group.has_rsvped_wedding = True
        else:
            group.has_accepted_henna = True
            group.has_rsvped_henna = True
    else:
        # Decline invitation - clear all guests for this event
        db.query(guest_model).filter(guest_model.group_id == group.id).delete()

        # Update acceptance status for this event
        if is_wedding:
            group.has_accepted_wedding = False
            group.has_rsvped_wedding = True
        else:
            group.has_accepted_henna = False
            group.has_rsvped_henna = True

    db.commit()
    db.refresh(group)

    return RSVPResponse(
        success=True,
        message=f"RSVP for {rsvp_data.event} submitted successfully",
        group=group
    )


@router.get("/status/{token}", response_model=GroupResponse)
def get_rsvp_status(token: str, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.token == token).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invitation token"
        )
    return group
