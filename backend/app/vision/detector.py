from __future__ import annotations

import base64
from functools import lru_cache
from io import BytesIO
from typing import Any

import cv2
import numpy as np
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

    annotated_bgr = result.plot()
    annotated_rgb = cv2.cvtColor(annotated_bgr, cv2.COLOR_BGR2RGB)
    annotated_image = Image.fromarray(annotated_rgb)

    buffer = BytesIO()
    annotated_image.save(buffer, format="JPEG", quality=90)
    image_base64 = base64.b64encode(buffer.getvalue()).decode("ascii")

    return {
        "model": "yolo11n",
        "image": {
            "width": image.width,
            "height": image.height,
        },
        "detections": detections,
        "counts": counts,
        "total_objects": len(detections),
        "annotated_image": f"data:image/jpeg;base64,{image_base64}",
    }
