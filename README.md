# Bushfire Smoke Detection System

## Overview
This project is an AI-based system for detecting bushfire smoke and fire from images.

It is designed as a full-stack application with:
- Frontend dashboard (React + Vite)
- Backend API (FastAPI)
- YOLOv8 model for detection

The goal is to provide a practical early warning and monitoring tool for bushfire risk.

---

## Project Structure

```
project-root/
├── frontend/    # React dashboard UI
├── backend/     # FastAPI + model inference
├── training/    # YOLO training pipeline
└── README.md
```

---

## System Architecture

```
Frontend (React)
        ↓
Backend (FastAPI)
        ↓
YOLO Model (.pt)
        ↓
Detection Results (JSON)
        ↓
Frontend Visualization
```

---

## Features

### Frontend
- Dashboard interface
- Image upload (planned)
- Detection result display
- Risk level visualization
- History panel

### Backend
- REST API
- Model inference endpoint
- JSON result formatting

### Model
- YOLOv8 object detection
- Smoke and fire classification
- Bounding box output

---

## Workflow

1. Train model using YOLO (training module)
2. Export `best.pt`
3. Load model in backend
4. Frontend sends image to `/predict`
5. Backend runs inference
6. Results returned and visualized

---

## Getting Started

### Frontend
install Node.js first

```
https://nodejs.org/en/download
```

```
cd frontend
npm install
npm run dev
```

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Training

```
cd training
yolo detect train data=data.yaml model=yolov8n.pt epochs=50
```

---

## Future Improvements

- Real-time video detection
- WebSocket live updates
- Better UI/UX
- Risk scoring system
- Model optimization

---

## Notes

- Dataset is not included in this repository
- Only trained model (`best.pt`) is used for deployment
- Frontend does not directly access the model
