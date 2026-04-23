# YOLOv8n Bushfire Smoke/Fire Detection

## Overview
This folder contains the trained YOLOv8n model and prediction script for bushfire smoke/fire detection.

## Files
- `best.pt` – final trained model
- `predict.py` – prediction script that outputs JSON
- `experiments.md` – experiment records and results
- `train.ipynb` – training notebook
- `README.md` – usage instructions

## Model Performance
Final baseline comparison model:

- Precision: 0.772
- Recall: 0.709
- mAP50: 0.776
- mAP50-95: 0.449
- Smoke mAP50: 0.844
- Fire mAP50: 0.707

## Model Path

```text
training/model2_yolov8n/best.pt
```

## Prediction Script Usage

Run from the project root:

```bash
python training/model2_yolov8n/predict.py "path/to/image.jpg"
```

## JSON Output Example

```json
[
  {
    "class": "smoke",
    "conf": 0.855,
    "bbox": [0, 11, 769, 475]
  }
]
```

## Notes

- Dataset is not uploaded to GitHub.
- The script expects an input image path.
- The model outputs class name, confidence score, and bounding box.

## Dataset Path Used During Training

```text
training/data_preparing/data/wildfire/data.yaml
```