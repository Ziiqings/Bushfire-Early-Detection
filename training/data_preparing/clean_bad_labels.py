from pathlib import Path
from PIL import Image

DATASET_ROOT = Path("training/data/wildfire/data")
SPLITS = ["train", "val", "test"]
IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".bmp", ".webp"]

def find_image(images_dir: Path, stem: str):
    for ext in IMAGE_EXTS:
        p = images_dir / f"{stem}{ext}"
        if p.exists():
            return p
    return None

def check_label(label_path: Path):
    """
    返回 (is_bad, reasons)
    空标签文件不算坏标签
    缺失标签不算坏标签
    """
    reasons = []

    if not label_path.exists():
        return False, ["label_missing_ok"]

    if label_path.stat().st_size == 0:
        return False, ["label_empty_ok"]

    try:
        lines = label_path.read_text(encoding="utf-8").strip().splitlines()
    except UnicodeDecodeError:
        return True, ["label_encoding_error"]

    for i, line in enumerate(lines, start=1):
        parts = line.strip().split()

        if len(parts) != 5:
            reasons.append(f"line_{i}_format_error")
            continue

        # class id
        try:
            class_id = int(parts[0])
            if class_id < 0:
                reasons.append(f"line_{i}_invalid_class")
        except ValueError:
            reasons.append(f"line_{i}_invalid_class")

        # x y w h
        for j, value in enumerate(parts[1:], start=1):
            try:
                v = float(value)
                if not (0.0 <= v <= 1.0):
                    reasons.append(f"line_{i}_field_{j}_out_of_range")
            except ValueError:
                reasons.append(f"line_{i}_field_{j}_non_numeric")

    return len(reasons) > 0, reasons

def main():
    bad_items = []

    for split in SPLITS:
        split_dir = DATASET_ROOT / split
        images_dir = split_dir / "images"
        labels_dir = split_dir / "labels"

        print(f"\n===== SCANNING {split.upper()} =====")

        if not images_dir.exists() or not labels_dir.exists():
            print(f"[SKIP] Missing folders in {split_dir}")
            continue

        for label_path in sorted(labels_dir.glob("*.txt")):
            is_bad, reasons = check_label(label_path)
            if is_bad:
                image_path = find_image(images_dir, label_path.stem)
                bad_items.append((split, label_path, image_path, reasons))
                print(f"[BAD] {label_path}")
                print(f"      reasons: {reasons}")
                print(f"      image: {image_path}")

    print("\n===== SUMMARY =====")
    print(f"Bad label pairs found: {len(bad_items)}")

    if not bad_items:
        print("No bad labels found. Nothing to clean.")
        return

    confirm = input("\nDelete these bad label files and their matched images? (y/n): ").strip().lower()
    if confirm != "y":
        print("Cancelled.")
        return

    deleted_labels = 0
    deleted_images = 0

    for split, label_path, image_path, reasons in bad_items:
        if label_path.exists():
            label_path.unlink()
            deleted_labels += 1
            print(f"[DELETED LABEL] {label_path}")

        if image_path and image_path.exists():
            image_path.unlink()
            deleted_images += 1
            print(f"[DELETED IMAGE] {image_path}")

    print("\n===== CLEAN DONE =====")
    print(f"Deleted labels: {deleted_labels}")
    print(f"Deleted images: {deleted_images}")

if __name__ == "__main__":
    main()