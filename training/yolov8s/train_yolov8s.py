from pathlib import Path
import torch
from ultralytics import YOLO


def main():
    # -----------------------------
    # 1. Basic environment check
    # -----------------------------
    print("=" * 50)
    print("YOLOv8s Training Script")
    print("=" * 50)

    print(f"Torch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")

    if torch.cuda.is_available():
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        device = 0
    else:
        print("No GPU detected, using CPU.")
        device = "cpu"

    # -----------------------------
    # 2. Dataset config path check
    # -----------------------------
    data_yaml = Path("training/data/wildfire/data.yaml")

    if not data_yaml.exists():
        raise FileNotFoundError(f"Dataset YAML not found: {data_yaml}")

    print(f"Using dataset config: {data_yaml}")

    # -----------------------------
    # 3. Load model
    # -----------------------------
    print("\nLoading YOLOv8s model...")
    model = YOLO("yolov8s.pt")  # auto-download if not found

    # -----------------------------
    # 4. Train settings
    # -----------------------------
    print("\nStart training...")

    results = model.train(
        data=str(data_yaml),
        model="yolov8s.pt",
        epochs=3,                 # first only test the whole pipeline
        imgsz=640,
        batch=4,                  # suitable initial setting for RTX 4060 Laptop 8GB
        device=device,
        workers=2,                # lower workers for laptop stability
        project="training/runs",
        name="yolov8s_local_test",
        pretrained=True,
        cache=False,
        verbose=True,
        exist_ok=True
    )

    # -----------------------------
    # 5. Finish message
    # -----------------------------
    print("\nTraining finished.")
    print(results)

    print("\nCheck output folder:")
    print("training/runs/yolov8s_local_test")
    print("The trained weights should be inside:")
    print("training/runs/yolov8s_local_test/weights/")


if __name__ == "__main__":
    main()