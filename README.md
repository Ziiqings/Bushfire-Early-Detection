# Bushfire Early Detection (YOLOv8)

## 1. Download Dataset

* Go to the **Teams channel** and download the dataset folder.
* Place it into the project directory:

```
project/
└── data/
    └── wildfire/
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

---

## 2. Install Dependencies

### Create virtual environment (recommended)

```
python -m venv .venv
.venv\Scripts\activate
```

### Install required packages

```
pip install -r requirements.txt
```

---

## 3. Run YOLO Training (Sanity Check)

Run a quick 1-epoch training to verify everything works:

```
yolo detect train data=data/wildfire/data.yaml model=yolov8n.pt epochs=1
```

If you have GPU:

```
yolo detect train data=data/wildfire/data.yaml model=yolov8n.pt epochs=1 device=0
```

---

## 4. Output

Training results will be saved in:

```
runs/detect/train/
```

Check:

* `results.png` → training curves
* `val_batch*.jpg` → predictions

---

## Notes

* Dataset is **not included in repo** (download from Teams).
* Make sure folder paths match exactly, otherwise training will fail.
* If GPU is not detected, training will run on CPU (slower but works).
