# Quick Start Guide

## Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed
- PostgreSQL database running (in your LXC container)

## Step 1: Backend Setup

1. **Navigate to backend and activate virtual environment:**
```bash
cd backend
.venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure database connection:**
Edit `local.env` file and add your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://username:password@your-lxc-ip:5432/wedding_invites
```

4. **Initialize the database:**
```bash
python -m src.init_db
```

5. **Start the backend server:**
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend is now running at http://localhost:8000
API docs at http://localhost:8000/docs

## Step 2: Frontend Setup

Open a new terminal window:

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

Frontend is now running at http://localhost:5173

## Step 3: Add Your First Group

Open another terminal window:

1. **Navigate to backend:**
```bash
cd backend
.venv\Scripts\activate
```

2. **Add a test group:**
```bash
# Example: Family of 3 people
python -m src.add_group "The Smith Family" 3

# Example: Individual with no +1
python -m src.add_group "John Doe" 0

# Example: Group with unlimited guests
python -m src.add_group "Sarah & Friends" -1
```

3. **Copy the invitation URL from the output** (it will look like):
```
Invitation URL: http://localhost:5173/abc123xyz...
```

4. **Open the URL in your browser** to see the invitation!

## Step 4: Test the RSVP Flow

1. Navigate to the RSVP tab
2. Select "Yes, I'll be there!"
3. Add guest names (based on the max_guests limit)
4. Submit the RSVP
5. Check the database or use the list command:
```bash
python -m src.add_group --list
```

## Customizing Event Information

Edit these files to add your wedding details:

- `frontend/src/pages/NikkahPage.tsx` - Update with your Nikkah/Wedding info
- `frontend/src/pages/HennaPage.tsx` - Update with your Henna event info

Just replace the placeholder text with your actual event details.

## Useful Commands

**Backend:**
```bash
# List all groups
python -m src.add_group --list

# Add a new group
python -m src.add_group "Group Name" <max_guests>

# Start backend server
uvicorn src.main:app --reload
```

**Frontend:**
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

**Database connection errors:**
- Verify PostgreSQL is running in your LXC
- Check the DATABASE_URL in `local.env`
- Ensure the database exists (you may need to create it first)

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check browser console for errors
- Verify CORS settings in `backend/src/main.py`

**Module not found errors:**
- Frontend: Run `npm install` in the frontend directory
- Backend: Run `pip install -r requirements.txt` in the backend directory

## Next Steps

1. Customize the event pages with your actual wedding details
2. Adjust the color scheme in `frontend/src/index.css` if desired
3. Add all your guest groups using the `add_group.py` script
4. Share the unique URLs with your guests
5. Monitor RSVPs through the database or build an admin panel

Congratulations! Your wedding invitation website is ready! 🎉
