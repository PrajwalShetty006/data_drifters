#!/bin/bash

echo "Starting ChainForecast Application..."
echo ""

# Start ML Server
echo "Starting ML Server (Port 8000)..."
cd ml
python -m uvicorn main:app --reload --port 8000 &
ML_PID=$!
cd ..

sleep 2

# Start Backend Server
echo "Starting Backend Server (Port 5000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 2

# Start Frontend
echo "Starting Frontend (Port 5173)..."
cd frontend/redact_data_drifters
npm run dev &
FRONTEND_PID=$!
cd ../../

echo ""
echo "All services are starting..."
echo "- ML Server: http://localhost:8000 (PID: $ML_PID)"
echo "- Backend Server: http://localhost:5000 (PID: $BACKEND_PID)"
echo "- Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $ML_PID $BACKEND_PID $FRONTEND_PID; exit" INT
wait

