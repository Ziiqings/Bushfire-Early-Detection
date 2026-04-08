from pathlib import Path
from ultralytics import YOLO

BASE_PATH = Path(__file__).resolve().parent.parent / "models"

MODEL_PATHS = {
    "v8n": BASE_PATH / "yolov8n.pt",
    "v8s": BASE_PATH / "yolov8s.pt"
}

MODELS = {
    "v8n": YOLO(str(MODEL_PATHS["v8n"])),
    "v8s": YOLO(str(MODEL_PATHS["v8s"])),
}

def get_model_status():
    return {
        "available_models": list(MODELS.keys()),
        "paths": {k: str(v) for k, v in MODEL_PATHS.items()}
    }

def get_model(model_name: str):
    if model_name not in MODELS:
        raise ValueError(f"Model '{model_name}' not found")

    return MODELS[model_name]
