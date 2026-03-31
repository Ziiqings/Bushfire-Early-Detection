# Backend – Bushfire Smoke Detection API

## Overview
Backend service providing APIs for image upload and model inference.

## Tech Stack
- Python
- FastAPI
- Uvicorn
- YOLOv8

## Setup
```
python -m venv venv
pip install -r requirements.txt
```

## Run
```
uvicorn app.main:app --reload
```

## API

TODO

## Example Output
{
  "detections": [
    {
      "label": "smoke",
      "confidence": 0.91,
      "bbox": [100,120,220,260]
    }
  ],
  "risk_level": "Medium"
}

## Structure
```
app/
models/best.pt
```

## Notes
Frontend does not access model directly.
