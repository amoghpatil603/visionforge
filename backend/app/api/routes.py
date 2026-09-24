from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.vision.detector import detect_image
from app.vision.video import process_video

router = APIRouter(tags=["vision"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}


@router.get("/health")
def api_health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/detect/image")
async def detect_uploaded_image(file: UploadFile = File(...)) -> dict:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG and WebP images are supported.")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        image = Image.open(BytesIO(data)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc

    return detect_image(image)


@router.post("/detect/video")
async def detect_uploaded_video(file: UploadFile = File(...)) -> dict:
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=415, detail="Only MP4, WebM and QuickTime videos are supported.")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded video is empty.")

    try:
        return process_video(data, file.filename or "video.mp4")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
