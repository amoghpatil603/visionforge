from __future__ import annotations

import base64
import tempfile
from pathlib import Path
from typing import Any

import cv2

from app.vision.detector import get_model


def process_video(video_bytes: bytes, filename: str) -> dict[str, Any]:
    suffix = Path(filename).suffix.lower() or ".mp4"

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = Path(temp_dir) / f"input{suffix}"
        output_path = Path(temp_dir) / "processed.mp4"
        input_path.write_bytes(video_bytes)

        capture = cv2.VideoCapture(str(input_path))
        if not capture.isOpened():
            raise ValueError("Unable to open the uploaded video.")

        fps = capture.get(cv2.CAP_PROP_FPS) or 30.0
        width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
        frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))

        if width <= 0 or height <= 0:
            capture.release()
            raise ValueError("Unable to read video dimensions.")

        writer = cv2.VideoWriter(
            str(output_path),
            cv2.VideoWriter_fourcc(*"mp4v"),
            fps,
            (width, height),
        )

        if not writer.isOpened():
            capture.release()
            raise ValueError("Unable to create the processed video.")

        model = get_model()
        counts: dict[str, int] = {}
        processed_frames = 0
        total_detections = 0

        while True:
            ok, frame = capture.read()
            if not ok:
                break

            result = model.predict(source=frame, verbose=False)[0]
            annotated = result.plot()

            if result.boxes is not None:
                for class_id in result.boxes.cls.tolist():
                    class_name = str(result.names[int(class_id)])
                    counts[class_name] = counts.get(class_name, 0) + 1
                    total_detections += 1

            writer.write(annotated)
            processed_frames += 1

        capture.release()
        writer.release()

        if processed_frames == 0 or not output_path.exists():
            raise ValueError("No video frames could be processed.")

        encoded = base64.b64encode(output_path.read_bytes()).decode("ascii")

        return {
            "filename": "visionforge_processed.mp4",
            "video": f"data:video/mp4;base64,{encoded}",
            "source": {
                "width": width,
                "height": height,
                "fps": round(fps, 2),
                "frames": frame_count,
                "processed_frames": processed_frames,
            },
            "counts": counts,
            "total_detections": total_detections,
        }
