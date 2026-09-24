from __future__ import annotations

from functools import lru_cache
from typing import Any

from PIL import Image
from ultralytics import YOLO


@lru_cache(maxsize=1)
def get_model() -> YOLO:
    """Load the default YOLO model once per backend process."""
    return YOLO("yolo11n.pt")


def detect_image(image: Image.Image) -> dict[str, Any]:
    model = get_model()
    result = model.predict(source=image, verbose=False)[0]

    detections: list[dict[str, Any]] = []
    counts: dict[str, int] = {}

    names = result.names
    boxes = result.boxes

    if boxes is not None:
        for box in boxes:
            class_id = int(box.cls.item())
            confidence = float(box.conf.item())
            class_name = str(names[class_id])
            xyxy = [round(float(value), 2) for value in box.xyxy[0].tolist()]

            detections.append(
                {
                    "class_name": class_name,
                    "confidence": round(confidence, 4),
                    "box": xyxy,
                }
            )
            counts[class_name] = counts.get(class_name, 0) + 1

    return {
        "model": "yolo11n",
        "image": {
            "width": image.width,
            "height": image.height,
        },
        "detections": detections,
        "counts": counts,
        "total_objects": len(detections),
    }
