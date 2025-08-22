# BestSellers Setup Guide - Fix 404 Error

## 🚨 Problem
The BestSellers API is returning a 404 error: `127.0.0.1 - - [17/Aug/2025 02:21:58] "GET /api/product/bestsellers HTTP/1.1" 404`

## 🔧 Solution Steps

### Step 1: Fix Route Conflict (✅ FIXED)
**Fixed**: Changed the endpoint from `/api/product/bestsellers` to `/api/bestsellers` to avoid conflicts with the existing `/api/product` route.

### Step 2: Seed the Database
The 404 error might be because there's no data in the database. Let's populate it:

```bash
# Navigate to backend directory
cd BACKEND

# Run the seed script
pipenv run python server/seed.py
```

**Expected Output:**
```
🌱 Starting database seeding...
🗑️  Clearing existing data...
✅ Existing data cleared
👥 Creating sample users...
✅ Created 4 users
📂 Creating sample categories...
✅ Created 5 categories
🪑 Creating sample products...
✅ Created 8 products
🖼️  Creating sample product images...
✅ Created product images
📦 Creating sample orders...
✅ Created 9 orders
📋 Creating sample order items...
✅ Created 27 order items
⭐ Creating sample reviews...
✅ Created 32 reviews

🎉 Database seeding completed successfully!
```

### Step 3: Restart Backend Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it
pipenv run python server/app.py
```

### Step 4: Test the API Endpoint
```bash
# Test with curl
curl http://localhost:5000/api/bestsellers

# Or use the test script
python test_api.py
```

**Expected Response:**
```json
[
  {
    "product_id": 1,
    "product_name": "Trenton Modular Sofa",
    "product_price": 25000.0,
    "order_count": 5,
    "avg_rating": 4.5,
    "primary_image": "http://localhost:5000/static/placeholder.jpg"
  }
]
```

### Step 5: Test Frontend
```bash
# In another terminal, start the frontend
cd FRONTEND/vitrax-limited
npm run dev
```

Navigate to `http://localhost:5173` and scroll to the "Top Picks For You" section.

## 🐛 Troubleshooting

### If Still Getting 404:

1. **Check Backend Logs:**
   ```bash
   # Look for route registration in backend logs
   pipenv run python server/app.py
   ```

2. **Verify Route Registration:**
   ```python
   # In app.py, make sure this line exists:
   app.register_blueprint(product_bp,url_prefix = '/api')
   ```

3. **Check Database Connection:**
   ```bash
   # Test if database is accessible
   pipenv run python -c "
   from server.app import app
   from server.extensions import db
   with app.app_context():
       print('Database tables:', db.engine.table_names())
   "
   ```

### If Database Issues:

1. **Reset Database:**
   ```bash
   cd BACKEND
   pipenv run python server/seed.py
   ```

2. **Check Database File:**
   ```bash
   # Look for the database file
   ls -la server/instance/
   ```

### If Frontend Issues:

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for network errors
   - Check if the API call is being made

2. **Test API Directly:**
   ```bash
   curl -v http://localhost:5000/api/bestsellers
   ```

## 📋 Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Database is seeded with sample data
- [ ] API endpoint returns 200 status code
- [ ] Frontend can fetch data from API
- [ ] BestSellers component displays products
- [ ] Images load (or show placeholder)
- [ ] Star ratings display correctly
- [ ] Order counts show correctly

## 🎯 Expected Results

After following these steps, you should see:

1. **Backend API Response:**
   ```json
   [
     {
       "product_id": 1,
       "product_name": "Trenton Modular Sofa",
       "product_price": 25000.0,
       "order_count": 5,
       "avg_rating": 4.5
     }
   ]
   ```

2. **Frontend Display:**
   - Loading indicator while fetching data
   - Product cards with images, names, prices
   - Star ratings (★★★★☆)
   - Order counts ("5 sold")
   - Hover effects and animations

## 🔗 Quick Commands

```bash
# 1. Seed database
cd BACKEND && pipenv run python server/seed.py

# 2. Start backend
pipenv run python server/app.py

# 3. Test API
curl http://localhost:5000/api/bestsellers

# 4. Start frontend (in new terminal)
cd FRONTEND/vitrax-limited && npm run dev
```

## 📞 Support

If you're still experiencing issues:

1. Check the backend logs for specific error messages
2. Verify the database has data: `pipenv run python -c "from server.app import app; from server.models import Product; print(Product.query.count())"`
3. Test the API endpoint directly with curl or Postman
4. Check browser network tab for failed requests
