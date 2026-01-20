import secrets
import sys
from src.database import SessionLocal
from src.models import Group


def add_group(
    name: str,
    max_guests_wedding: int,
    max_guests_henna: int,
    invited_to_nikkah: bool = True,
    invited_to_wedding: bool = True,
    invited_to_henna: bool = True
):
    """
    Add a new group to the database and generate their invitation URL.

    Args:
        name: The name of the group (e.g., "The Smith Family")
        max_guests_wedding: Maximum number of guests allowed for Wedding
                           0 = No additional guests (only RSVP yes/no)
                           -1 = Unlimited guests
                           > 0 = Specific limit
        max_guests_henna: Maximum number of guests allowed for Henna
                         0 = No additional guests (only RSVP yes/no)
                         -1 = Unlimited guests
                         > 0 = Specific limit
        invited_to_nikkah: Whether this group is invited to the Nikkah ceremony (default: True)
        invited_to_wedding: Whether this group is invited to the Wedding reception (default: True)
        invited_to_henna: Whether this group is invited to the Henna night (default: True)
    """
    db = SessionLocal()

    try:
        # Generate a secure random token
        token = secrets.token_urlsafe(8)

        # Create the group
        group = Group(
            name=name,
            token=token,
            invited_to_nikkah=invited_to_nikkah,
            invited_to_wedding=invited_to_wedding,
            invited_to_henna=invited_to_henna,
            max_guests_wedding=max_guests_wedding,
            max_guests_henna=max_guests_henna,
            has_accepted_wedding=False,
            has_accepted_henna=False
        )

        db.add(group)
        db.commit()
        db.refresh(group)

        print(f"\n✓ Group created successfully!")
        print(f"  Name: {group.name}")
        print(f"  Invited to: Nikkah={invited_to_nikkah}, Wedding={invited_to_wedding}, Henna={invited_to_henna}")
        print(f"  Max Guests (Wedding): {group.max_guests_wedding}")
        print(f"  Max Guests (Henna): {group.max_guests_henna}")
        print(f"  Token: {group.token}")
        print(f"\n  Invitation URL: http://localhost:5173/{group.token}")
        print(f"  (Update domain for production)")

        return group

    except Exception as e:
        db.rollback()
        print(f"\n✗ Error creating group: {e}")
        return None

    finally:
        db.close()


def list_groups():
    """List all groups in the database."""
    db = SessionLocal()

    try:
        groups = db.query(Group).all()

        if not groups:
            print("\nNo groups found in database.")
            return

        print(f"\n{'='*120}")
        print(f"{'ID':<5} {'Name':<25} {'Nikkah':<8} {'Wedding':<8} {'Henna':<8} {'MaxW':<6} {'MaxH':<6} {'RSVP W':<8} {'RSVP H':<8} {'Token':<20}")
        print(f"{'='*120}")

        for group in groups:
            nikkah_inv = 'Yes' if group.invited_to_nikkah else 'No'
            wedding_inv = 'Yes' if group.invited_to_wedding else 'No'
            henna_inv = 'Yes' if group.invited_to_henna else 'No'
            wedding_rsvp = 'Yes' if group.has_accepted_wedding else 'No'
            henna_rsvp = 'Yes' if group.has_accepted_henna else 'No'
            print(f"{group.id:<5} {group.name:<25} {nikkah_inv:<8} {wedding_inv:<8} {henna_inv:<8} {group.max_guests_wedding:<6} {group.max_guests_henna:<6} {wedding_rsvp:<8} {henna_rsvp:<8} {group.token[:20]}")

        print(f"{'='*120}\n")

    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("\nUsage:")
        print("  python -m src.add_group <name> <max_guests_wedding> <max_guests_henna> [nikkah] [wedding] [henna]")
        print("\nExamples:")
        print("  # All events (default):")
        print("  python -m src.add_group \"The Smith Family\" 3 2")
        print("\n  # Wedding only:")
        print("  python -m src.add_group \"John Doe\" 0 0 false true false")
        print("\n  # Henna only:")
        print("  python -m src.add_group \"Sarah\" 0 5 false false true")
        print("\n  # Nikkah + Wedding only (no Henna):")
        print("  python -m src.add_group \"Friends\" 10 0 true true false")
        print("\nOptions:")
        print("  python -m src.add_group --list    (List all groups)")
        print("\nMax Guests Values:")
        print("  0  = No additional guests (only RSVP yes/no)")
        print("  -1 = Unlimited guests")
        print("  >0 = Specific number of guests allowed")
        print("\nEvent Invitations (optional, default is true true true):")
        print("  nikkah wedding henna = true/false for each event")
        sys.exit(1)

    if sys.argv[1] == "--list":
        list_groups()
    elif len(sys.argv) >= 4:
        name = sys.argv[1]
        try:
            max_guests_wedding = int(sys.argv[2])
            max_guests_henna = int(sys.argv[3])

            # Parse optional event invitations
            invited_to_nikkah = True
            invited_to_wedding = True
            invited_to_henna = True

            if len(sys.argv) >= 7:
                invited_to_nikkah = sys.argv[4].lower() == 'true'
                invited_to_wedding = sys.argv[5].lower() == 'true'
                invited_to_henna = sys.argv[6].lower() == 'true'

            add_group(
                name,
                max_guests_wedding,
                max_guests_henna,
                invited_to_nikkah,
                invited_to_wedding,
                invited_to_henna
            )
        except ValueError:
            print("\nError: max_guests values must be integers")
            sys.exit(1)
    else:
        print("\nError: Invalid arguments")
        print("Usage: python -m src.add_group <name> <max_guests_wedding> <max_guests_henna> [nikkah] [wedding] [henna]")
        sys.exit(1)
