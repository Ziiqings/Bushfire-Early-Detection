from ultralytics import YOLO
import json
import sys
import os

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "best.pt")


def predict_image(image_path):
    model = YOLO(MODEL_PATH)
    results = model(image_path, verbose=False)

    output = []

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            output.append({
                "class": model.names[cls_id],
                "conf": round(conf, 3),
                "bbox": [int(x) for x in xyxy]
            })

    return output


def main():
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        return

    image_path = sys.argv[1]

    try:
        output = predict_image(image_path)
        print(json.dumps(output, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}, indent=2))


if __name__ == "__main__":
    main()