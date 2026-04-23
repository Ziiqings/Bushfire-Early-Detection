# YOLOv8n Experiments

## Experiment 1 – Initial Local Test Run

### Objective
Verify dataset path, training pipeline, and initial baseline performance.

### Model
YOLOv8n pretrained model (`yolov8n.pt`)

### Training Command

```bash
yolo detect train model=yolov8n.pt data=data.yaml epochs=3 imgsz=640 batch=8
```

### Hyperparameters
- Epochs: 3
- Image Size: 640
- Batch Size: 8
- Optimizer: AdamW
- Device: CPU

### Results
- mAP50: 0.564
- mAP50-95: 0.273
- Smoke mAP50: 0.622
- Fire mAP50: 0.506
- Time: 3.14 hours

### Observations
- Training pipeline worked successfully.
- Smoke detection performed better than fire detection.
- CPU training was slow.
- The model already showed a learning trend after 3 epochs.

### Next Plan
Run a full GPU training experiment on SageMaker.

---

## Experiment 1.5 – Inference Script Validation

### Input Image
WEB11792.jpg

### Result
- 1 smoke detected
- Confidence: 0.855
- Inference time: 45.9 ms

### Conclusion
JSON output was generated successfully and the prediction script worked as expected.

---

## Experiment 2 – Optimized YOLOv8n Run

### Objective
Improve detection performance by increasing the number of epochs and using a larger input image size.

### Model
YOLOv8n pretrained model (`yolov8n.pt`)

### Hyperparameters
- Epochs: 100
- Image Size: 768
- Batch Size: 8
- Device: Tesla T4 GPU

### Results
- Precision: 0.792
- Recall: 0.730
- mAP50: 0.796
- mAP50-95: 0.467
- Smoke mAP50: 0.852
- Fire mAP50: 0.741

### Conclusion
The optimized YOLOv8n model achieved stronger overall performance and was useful for exploring the upper bound of the lightweight model.

---

## Experiment 3 – Fair Comparison Run

### Objective
Compare YOLOv8n and YOLOv8s under identical training settings.

### Model
YOLOv8n pretrained model (`yolov8n.pt`)

### Training Settings
- Epochs: 50
- Image Size: 640
- Batch Size: 16
- Optimizer: default YOLOv8 optimizer
- Hardware: NVIDIA Tesla T4 GPU (AWS SageMaker)
- Seed: 42

### Results
- Precision: 0.772
- Recall: 0.709
- mAP50: 0.776
- mAP50-95: 0.449
- Smoke mAP50: 0.844
- Fire mAP50: 0.707

### Conclusion
This run was selected as the fairest baseline comparison with YOLOv8s because both models were trained under the same settings.

The results show that YOLOv8n achieved competitive performance while using a smaller and lighter model architecture.