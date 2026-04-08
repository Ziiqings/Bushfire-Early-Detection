from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pathlib import Path
import shutil

from app.services.model_service import get_model

router = APIRouter()

UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/predict")
async def predict(
        file: UploadFile = File(...),
        model: str = Query("v8s")
):
    # Check if it's a picture
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    # Save files
    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Get model
        yolo_model = get_model(model)

        # Run model
        results = yolo_model(str(file_path))
        result = results[0]

        detections = []

        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()

                class_name = result.names[cls_id]

                detections.append({
                    "class_name": class_name,
                    "confidence": round(conf, 4),
                    "bbox": [round(x, 2) for x in xyxy]
                })

        return {
            "model_used": model,
            "filename": file.filename,
            "detections": detections
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # delete temp files
        if file_path.exists():
            file_path.unlink()
