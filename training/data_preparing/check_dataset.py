from pathlib import Path
from PIL import Image

DATASET_ROOT = Path("training/data/wildfire/data")

SPLITS = ["train", "val", "test"]
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def is_image_file(p: Path) -> bool:
    return p.suffix.lower() in IMAGE_EXTS

def check_image(img_path: Path):
    """检查图片是否为空文件、是否能正常打开"""
    issues = []

    if not img_path.exists():
        issues.append("image_missing")
        return issues

    if img_path.stat().st_size == 0:
        issues.append("image_empty_file")
        return issues

    try:
        with Image.open(img_path) as im:
            im.verify()
    except Exception:
        issues.append("image_corrupted")

    return issues

def check_label(label_path: Path):
    """
    检查标签：
    - 不存在：允许，表示负样本（无目标）
    - 空文件：也允许，表示负样本
    - 非空时必须是合法 YOLO 格式
    """
    issues = []

    if not label_path.exists():
        issues.append("label_missing")   # 先记下来，不一定是错误
        return issues

    if label_path.stat().st_size == 0:
        issues.append("label_empty_file")  # 先记下来，通常可保留
        return issues

    try:
        lines = label_path.read_text(encoding="utf-8").strip().splitlines()
    except UnicodeDecodeError:
        issues.append("label_encoding_error")
        return issues

    for i, line in enumerate(lines, start=1):
        parts = line.strip().split()
        if len(parts) != 5:
            issues.append(f"label_format_error_line_{i}")
            continue

        # class_id
        try:
            class_id = int(parts[0])
            if class_id < 0:
                issues.append(f"label_invalid_class_line_{i}")
        except ValueError:
            issues.append(f"label_invalid_class_line_{i}")

        # bbox values
        for j, value in enumerate(parts[1:], start=1):
            try:
                v = float(value)
                if not (0.0 <= v <= 1.0):
                    issues.append(f"label_out_of_range_line_{i}_field_{j}")
            except ValueError:
                issues.append(f"label_non_numeric_line_{i}_field_{j}")

    return issues

def main():
    total_images = 0
    total_bad_images = 0
    total_bad_labels = 0

    for split in SPLITS:
        split_dir = DATASET_ROOT / split
        images_dir = split_dir / "images"
        labels_dir = split_dir / "labels"

        print(f"\n========== CHECKING {split.upper()} ==========")

        if not images_dir.exists():
            print(f"[ERROR] Missing folder: {images_dir}")
            continue
        if not labels_dir.exists():
            print(f"[ERROR] Missing folder: {labels_dir}")
            continue

        image_files = sorted([p for p in images_dir.iterdir() if p.is_file() and is_image_file(p)])
        label_files = sorted([p for p in labels_dir.iterdir() if p.is_file() and p.suffix.lower() == ".txt"])

        print(f"Images found: {len(image_files)}")
        print(f"Labels found: {len(label_files)}")

        # 反向检查：有没有孤立标签
        image_stems = {p.stem for p in image_files}
        label_stems = {p.stem for p in label_files}

        orphan_labels = sorted(label_stems - image_stems)
        orphan_images = sorted(image_stems - label_stems)

        if orphan_labels:
            print(f"[WARN] Orphan labels (no matching image): {len(orphan_labels)}")
            for x in orphan_labels[:20]:
                print("   ", x)

        if orphan_images:
            print(f"[INFO] Images without labels: {len(orphan_images)}")
            print("      This can be OK for negative samples.")

        # 逐图检查
        for img_path in image_files:
            total_images += 1
            label_path = labels_dir / f"{img_path.stem}.txt"

            img_issues = check_image(img_path)
            label_issues = check_label(label_path)

            # 真正值得重点关注的问题
            serious_img_issues = [x for x in img_issues if x != "label_missing"]
            serious_label_issues = [
                x for x in label_issues
                if x not in {"label_missing", "label_empty_file"}
            ]

            if img_issues:
                print(f"[IMAGE] {img_path.name}: {img_issues}")
                if any(x in img_issues for x in ["image_empty_file", "image_corrupted", "image_missing"]):
                    total_bad_images += 1

            if label_issues:
                print(f"[LABEL] {label_path.name}: {label_issues}")
                if serious_label_issues:
                    total_bad_labels += 1

        print(f"Finished {split}")

    print("\n========== SUMMARY ==========")
    print(f"Total images checked: {total_images}")
    print(f"Bad images: {total_bad_images}")
    print(f"Bad labels: {total_bad_labels}")

if __name__ == "__main__":
    main()