# How to Run ChainForecast Application

This application consists of three parts that need to be running simultaneously:
1. **ML Server** (FastAPI) - Port 8000
2. **Backend Server** (Node.js/Express) - Port 5000
3. **Frontend** (React/Vite) - Port 5173

---

## Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **MongoDB** (optional - not required for now as auth is skipped)

---

## Step 1: Start ML Server (FastAPI)

1. Open a terminal/command prompt
2. Navigate to the ML folder:
   ```bash
   cd ml
   ```

3. Install Python dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

   **Note:** Use `python -m uvicorn` instead of just `uvicorn` as it may not be in your PATH.

5. Verify it's running:
   - You should see: `Uvicorn running on http://127.0.0.1:8000`
   - Test: Open http://localhost:8000 in browser (should show JSON response)

---

## Step 2: Start Backend Server (Node.js)

1. Open a **NEW** terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend folder (if it doesn't exist):
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   FASTAPI_URL=http://localhost:8000
   MONGODB_URI=mongodb://localhost:27017/chainforecast
   JWT_SECRET=your-secret-key-here
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   Or if you have nodemon:
   ```bash
   node server.js
   ```

6. Verify it's running:
   - You should see: `Server running on port 5000`
   - Test: Open http://localhost:5000/api/auth/ in browser

---

## Step 3: Start Frontend (React/Vite)

1. Open a **NEW** terminal/command prompt
2. Navigate to the frontend folder:
   ```bash
   cd frontend/redact_data_drifters
   ```

3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

4. Create a `.env` file in the frontend/redact_data_drifters folder (optional):
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Verify it's running:
   - You should see: `Local: http://localhost:5173`
   - The browser should automatically open to the landing page

---

## Step 4: Access the Application

1. **Landing Page**: http://localhost:5173
   - Click "Get Started" or "SignIn" button
   - This will navigate directly to the dashboard (auth is skipped for now)

2. **Dashboard**: http://localhost:5173/dashboard
   - View sales forecasts, customer segments, and targeted offers
   - All data comes from the ML APIs via the backend

---

## Troubleshooting

### ML Server Issues:
- **Port 8000 already in use**: Change port in `ml/main.py` or kill the process using port 8000
- **Module not found**: Run `pip install -r requirements.txt` again
- **Data file missing**: Ensure `ml/data/online_retail_II.csv` exists

### Backend Server Issues:
- **Port 5000 already in use**: Change PORT in `.env` file
- **Cannot connect to ML**: Ensure ML server is running on port 8000
- **CORS errors**: Check that `FRONTEND_URL` in backend `.env` matches your frontend URL

### Frontend Issues:
- **Port 5173 already in use**: Vite will automatically use the next available port
- **API connection errors**: 
  - Check that backend is running on port 5000
  - Check browser console for CORS errors
  - Verify `VITE_API_BASE_URL` in frontend `.env` matches backend URL
- **Cannot find module**: Run `npm install` again

### General Issues:
- **All services must be running**: ML, Backend, and Frontend all need to be active
- **Check terminal outputs**: Look for error messages in each terminal
- **Browser console**: Open DevTools (F12) to see JavaScript errors

---

## Quick Start Commands (All in One)

If you want to start all services quickly, open 3 terminals:

**Terminal 1 (ML):**
```bash
cd ml
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 (Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 3 (Frontend):**
```bash
cd frontend/redact_data_drifters
npm install
npm run dev
```

---

## API Endpoints Available

- `GET /api/auth/forecast` - Get sales forecast (protected)
- `GET /api/auth/rfm` - Get customer segmentation (protected)
- `GET /api/auth/discounts` - Get discount offers
- `GET /api/auth/run-all` - Get all data at once (forecast + rfm + discounts)
- `GET /api/auth/explain_forecast` - Get forecast explanation

---

## Notes

- **MongoDB is not required** - Authentication is currently skipped, so MongoDB connection will fail but won't affect functionality. The server will continue running without MongoDB.
- **CORS is configured** - ML server has CORS enabled to allow requests from frontend and backend
- **Error handling improved** - Better error messages when servers aren't running
- **Data is real** - All dashboard data comes from ML models processing the retail dataset
- **Hot reload enabled** - All servers support hot reload for development

---

## Stopping the Application

Press `Ctrl+C` in each terminal to stop the respective service.

