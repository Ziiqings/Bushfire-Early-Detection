# Training – Bushfire Smoke Detection Model

## Overview
Responsible for training YOLOv8 model for smoke/fire detection.

## Dataset

* Go to the **Teams channel** and download the dataset folder.
* Place it into the project directory:

```
project/
└── training/
    └── data/
```

Final structure should look like:

```
data/wildfire/data/
├── train/
│   ├── images/
│   └── labels/
├── val/
│   ├── images/
│   └── labels/
├── test/
│   ├── images/
│   └── labels/
└── data.yaml
```

## Train
yolo detect train data=data.yaml model=yolov8n.pt epochs=50

## Output
runs/detect/train/weights/
- best.pt
- last.pt

## Workflow
Dataset → Training → best.pt → Backend → Frontend

## Notes
Do not upload dataset to GitHub.
