# invite-io

Wedding invitation website for **Norildeen & Ummay**. Guests access personalized pages via unique token URLs and can RSVP for the Nikkah/Reception and Henna events.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, React Router v7, Zod |
| Backend | FastAPI, SQLAlchemy, PostgreSQL, Pydantic, Uvicorn |

---

## Project Structure

```
invite-io/
├── frontend/src/
│   ├── App.tsx                  # Router — dual public/token routing
│   ├── api.ts                   # API client (verifyGroup, submitRSVP, getRSVPStatus)
│   ├── schemas.ts               # Zod validation schemas
│   ├── index.css                # Global CSS variables (light + dark mode)
│   ├── config/events.ts         # Event dates, times, venues, map links
│   ├── pages/
│   │   ├── NikkahPage.tsx       # Nikkah & Reception info + dress code
│   │   ├── HennaPage.tsx        # Henna night info (women only)
│   │   └── RSVPPage.tsx         # RSVP form with guest management
│   └── components/
│       ├── Layout.tsx           # Auth wrapper, header, public mode
│       ├── TabNavigation.tsx    # Sticky nav tabs (public/token aware)
│       ├── DefaultRedirect.tsx  # Redirects /:token → /:token/rsvp
│       └── EnvelopeIntro.tsx    # Animated envelope opening screen
│
└── backend/src/
    ├── main.py                  # FastAPI app with CORS
    ├── models.py                # SQLAlchemy models (Group, WeddingGuest, HennaGuest)
    ├── schemas.py               # Pydantic request/response schemas
    ├── database.py              # PostgreSQL connection
    ├── init_db.py               # Create database tables
    ├── add_group.py             # CLI for adding guest groups
    └── api/endpoints/groups.py  # API route handlers
```

---

## Routing

### Public (no token)
| URL | Page |
|-----|------|
| `/` | Redirects to `/nikkah` |
| `/nikkah` | Nikkah & Reception info |
| `/henna` | Henna event info |

No RSVP tab shown. Nikkah page shows all attire categories by default.

### Token-based (personalized invite)
| URL | Page |
|-----|------|
| `/:token` | Redirects to `/:token/rsvp` |
| `/:token/nikkah` | Nikkah/Reception info |
| `/:token/henna` | Henna info |
| `/:token/rsvp` | RSVP form |

Tabs shown are conditional on the group's invitation flags (`invited_to_nikkah`, `invited_to_wedding`, `invited_to_henna`).

---

## API

**Base URL:** `VITE_API_URL` env var (default: `http://localhost:8000/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups/verify/:token` | Validate token, return group data |
| GET | `/groups/status/:token` | Get current RSVP status + guest list |
| POST | `/groups/rsvp/:token` | Submit RSVP |
| GET | `/health` | Health check |

**RSVP request body:**
```json
{ "event": "wedding" | "henna", "accept": true | false, "guests": ["Name 1", "Name 2"] }
```

**`max_guests` values:**
- `0` = RSVP yes/no only, no additional guests
- `-1` = Unlimited additional guests
- `> 0` = Specific guest limit

---

## Data Model

```
Group
  id, name, token (unique)
  invited_to_nikkah, invited_to_wedding, invited_to_henna (bool)
  max_guests_wedding, max_guests_henna (int)
  has_accepted_wedding, has_accepted_henna (bool)
  has_rsvped_wedding, has_rsvped_henna (bool)
  wedding_guests → [WeddingGuest]
  henna_guests   → [HennaGuest]

WeddingGuest / HennaGuest
  id, group_id (FK), name, created_at
```

---

## Event Configuration

Edit `frontend/src/config/events.ts` to update dates, times, venues, and map links:

```ts
EVENTS = {
  nikkah:  { name, date, time, venue, mapUrl },
  wedding: { name, date, time, venue, mapUrl },
  henna:   { name, date, time, venue, mapUrl },
}
```

---

## Theming (Dark / Light Mode)

Automatic via `@media (prefers-color-scheme: dark)`. No manual toggle. Key CSS variables in `index.css`:

| Variable | Light | Dark |
|----------|-------|------|
| `--primary-color` | `#a98a23` | `#d4af37` |
| `--background` | `#e8f0f8` | `#0a1628` |
| `--card-background` | `#ffffff` | `#162844` |
| `--text-primary` | `#1a2b4a` | `#e5e9f0` |

---

## Local Development

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m src.init_db
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
API docs: `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

### Environment Variables

`frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

`backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/invites
```

---

## Managing Guest Groups

```bash
cd backend

# Add a group
python -m src.add_group "Family Name" <max_wedding> <max_henna>

# Examples
python -m src.add_group "The Smith Family" 4 2     # Up to 4 wedding, 2 henna guests
python -m src.add_group "John Doe" 0 0             # Solo, no additional guests
python -m src.add_group "Open Table" -1 -1         # Unlimited guests

# List all groups and their tokens
python -m src.add_group --list
```

Share the token URL with guests: `https://yoursite.com/<token>`

---

## Build & Deploy

```bash
# Frontend
cd frontend && npm run build   # Output: dist/

# Backend
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

For production, set `VITE_API_URL` to the live backend URL and update CORS origins in `backend/src/main.py`.

---

## Registry

Amazon registry: https://www.amazon.com/wedding/guest-view/JVLKC30FV72B
