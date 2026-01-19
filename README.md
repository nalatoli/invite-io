# Wedding Invitation Website

A mobile-first wedding invitation website with token-based group authentication and RSVP management.

## Features

- **Token-based Authentication**: Each group receives a unique URL with their invitation token
- **Three Event Tabs**:
  - Nikkah & Wedding information
  - Henna Night information
  - RSVP management
- **Guest Management**:
  - Groups can accept/decline invitations
  - Add guest names based on their allowed maximum
  - Support for groups with no additional guests (max_guests = 0)
  - Support for unlimited guests (max_guests = -1)
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Dark Mode Support**: Automatically adapts to system dark mode preferences

## Tech Stack

### Backend
- FastAPI
- PostgreSQL (via SQLAlchemy)
- Pydantic for data validation

### Frontend
- React 19
- TypeScript
- React Router
- Zod for schema validation
- Vite for build tooling

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure your PostgreSQL database connection in `local.env`:
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
```

5. Initialize the database:
```bash
python -m src.init_db
```

6. Run the backend server:
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000
API documentation at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:8000):
```env
VITE_API_URL=http://localhost:8000/api
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Database Schema

### Groups Table
- `id`: Primary key
- `name`: Group name (e.g., "The Smith Family")
- `token`: Unique authentication token (used in URL)
- `max_guests`: Maximum number of guests allowed
  - `0` = No additional guests (only RSVP yes/no)
  - `-1` = Unlimited guests
  - `> 0` = Specific limit
- `has_accepted`: Boolean indicating if group accepted invitation
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Guests Table
- `id`: Primary key
- `group_id`: Foreign key to groups table
- `name`: Guest name
- `created_at`: Timestamp

## Adding Groups

You need to manually add groups to the database. Here's an example using Python:

```python
from src.database import SessionLocal
from src.models import Group
import secrets

db = SessionLocal()

# Create a group with 2 guests allowed
group = Group(
    name="The Johnson Family",
    token=secrets.token_urlsafe(32),  # Generate random token
    max_guests=2
)

db.add(group)
db.commit()

print(f"Invitation URL: http://localhost:5173/{group.token}")
```

Or using SQL directly:

```sql
INSERT INTO groups (name, token, max_guests, has_accepted)
VALUES ('The Smith Family', 'your-random-token-here', 3, false);
```

## API Endpoints

- `GET /api/groups/verify/{token}` - Verify a group token
- `GET /api/groups/status/{token}` - Get RSVP status for a group
- `POST /api/groups/rsvp/{token}` - Submit RSVP

## URL Structure

Groups access the website using their unique token:
- `http://yourdomain.com/{token}` - Redirects to Nikkah tab
- `http://yourdomain.com/{token}/nikkah` - Nikkah & Wedding info
- `http://yourdomain.com/{token}/henna` - Henna Night info
- `http://yourdomain.com/{token}/rsvp` - RSVP page

## Customization

### Event Information
Edit the following files to update event details:
- `frontend/src/pages/NikkahPage.tsx` - Nikkah & Wedding details
- `frontend/src/pages/HennaPage.tsx` - Henna Night details

### Styling
- `frontend/src/index.css` - Global styles and color scheme
- Modify CSS variables in `:root` to change colors

### Color Scheme
Current colors (light mode):
- Primary: `#d4af37` (Gold)
- Secondary: `#8b7355` (Brown)
- Background: `#fdf8f3` (Cream)

Dark mode colors are defined in the `@media (prefers-color-scheme: dark)` section.

## Production Deployment

### Backend
1. Set up PostgreSQL database
2. Update `DATABASE_URL` in production environment
3. Deploy using your preferred method (Docker, cloud platform, etc.)
4. Update CORS origins in `src/main.py` to include your frontend domain

### Frontend
1. Update `VITE_API_URL` to your production API URL
2. Build the frontend:
```bash
npm run build
```
3. Deploy the `dist` folder to your hosting service

## License

Private use for wedding invitation.
