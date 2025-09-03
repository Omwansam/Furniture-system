# Troubleshooting Guide for Backend Connection Issues

## Problem: "Failed to fetch" Error

The "Failed to fetch" error typically indicates that the frontend cannot connect to the backend server. Here's how to fix it:

## Step 1: Start the Backend Server

### Option A: Using the startup script
```bash
cd BACKEND
python start_server.py
```

### Option B: Manual startup
```bash
cd BACKEND/server
python app.py
```

You should see output like:
```
Starting Furniture System Backend Server...
==================================================
Starting Flask server on http://localhost:5000
Press Ctrl+C to stop the server
--------------------------------------------------
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

## Step 2: Verify Backend is Running

Open your browser and go to: `http://localhost:5000`

You should see: `Hello, World!`

## Step 3: Test API Endpoints

Use the test script to verify endpoints:
```bash
cd BACKEND
python test_backend.py
```

## Common Issues and Solutions

### Issue 1: Port 5000 is already in use
**Solution:**
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 2: Python dependencies not installed
**Solution:**
```bash
cd BACKEND
pip install -r requirements.txt
# or if using pipenv
pipenv install
```

### Issue 3: Database not initialized
**Solution:**
```bash
cd BACKEND/server
flask db upgrade
```

### Issue 4: CORS issues
**Solution:**
The backend already has CORS configured. Make sure the frontend is running on a different port (e.g., 3000 for React).

## Step 4: Check Frontend Configuration

Make sure your frontend is configured to connect to the correct backend URL:

1. Check `FRONTEND/vitrax-limited/src/services/adminService.js`
2. Verify `API_BASE_URL` points to `http://localhost:5000`
3. Ensure the backend server is running before starting the frontend

## Step 5: Start Frontend

In a new terminal:
```bash
cd FRONTEND/vitrax-limited
npm start
```

## Debugging Steps

### 1. Check Browser Console
- Open Developer Tools (F12)
- Look for network errors in the Console tab
- Check the Network tab for failed requests

### 2. Check Backend Logs
- Look at the terminal where the backend is running
- Check for error messages or exceptions

### 3. Test Individual Endpoints
```bash
# Test basic connection
curl http://localhost:5000/

# Test protected endpoints (should return 401/403)
curl http://localhost:5000/orders/admin/all
curl http://localhost:5000/customers/admin/customers
```

### 4. Check Database Connection
```bash
cd BACKEND/server
python -c "
from app import app
from extensions import db
with app.app_context():
    try:
        db.engine.execute('SELECT 1')
        print('Database connection successful')
    except Exception as e:
        print(f'Database connection failed: {e}')
"
```

## File Structure Check

Ensure these files exist and are properly configured:

```
BACKEND/
├── server/
│   ├── app.py                    # Main Flask app
│   ├── models.py                 # Database models
│   ├── extensions.py             # Flask extensions
│   ├── config.py                 # Configuration
│   └── routes/
│       ├── order_route.py        # Order management
│       ├── customers_route.py    # Customer management
│       └── users_route.py        # User management
├── start_server.py               # Startup script
└── test_backend.py               # Test script

FRONTEND/
└── vitrax-limited/
    └── src/
        ├── services/
        │   └── adminService.js   # API service
        └── components/
            └── adminpage/
                ├── OrdersManagement.jsx
                └── CustomerManagement.jsx
```

## Environment Variables

Make sure these environment variables are set (if required):
```bash
export FLASK_APP=app.py
export FLASK_ENV=development
export DATABASE_URL=sqlite:///vitraxlimited.db
```

## Final Verification

After following all steps:

1. Backend should be running on `http://localhost:5000`
2. Frontend should be running on `http://localhost:3000`
3. Admin dashboard should load without "Failed to fetch" errors
4. Orders and Customers pages should display data

## Still Having Issues?

1. Check the backend terminal for Python errors
2. Verify all required Python packages are installed
3. Ensure the database file exists and is accessible
4. Check if any antivirus/firewall is blocking localhost connections
5. Try using a different port by modifying `app.py`

## Quick Fix Commands

```bash
# Kill any existing Python processes
pkill -f python

# Clear Python cache
find . -type d -name "__pycache__" -exec rm -r {} +

# Restart backend
cd BACKEND
python start_server.py

# In another terminal, restart frontend
cd FRONTEND/vitrax-limited
npm start
```
