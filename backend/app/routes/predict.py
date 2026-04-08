from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pathlib import Path
import shutil
from PIL import Image

from app.services.model_service import get_model

router = APIRouter()

UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def calculate_risk(smoke_count: int, fire_count: int, max_confidence: float) -> str:
    if fire_count >= 1:
        return "high"
    if smoke_count >= 2 or max_confidence >= 0.7:
        return "medium"
    if smoke_count >= 1:
        return "low"
    return "safe"

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
        with Image.open(file_path) as image:
            width, height = image.size

        yolo_model = get_model(model)
        results = yolo_model(str(file_path), conf=0.1)
        result = results[0]

        detections = []
        smoke_count = 0
        fire_count = 0
        max_confidence = 0.0

        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()
                class_name = result.names[cls_id]

                if class_name.lower() == "smoke":
                    smoke_count += 1
                elif class_name.lower() == "fire":
                    fire_count +=1

                max_confidence = max(max_confidence, conf)

                detections.append({
                    "class_name": class_name,
                    "confidence": round(conf, 4),
                    "bbox": [round(x, 2) for x in xyxy]
                })

        risk_level = calculate_risk(smoke_count, fire_count, max_confidence)

        return {
            "model_used": model,
            "filename": file.filename,
            "image_width": width,
            "image_height": height,
            "detections": detections,
            "risk_level": risk_level,
            "summary": {
                "smoke_count": smoke_count,
                "fire_count": fire_count,
                "max_confidence": round(max_confidence, 4)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # delete temp files
        try:
            if file_path.exists():
                file_path.unlink()
        except PermissionError:
            print(f"Warning: could not delete temp file {file_path}")