# VisionForge

**AI-powered computer vision workspace for image and video analysis.**

VisionForge is a software-first computer vision platform built around a FastAPI backend and a Next.js frontend. The current milestone supports image detection and frame-by-frame video detection using YOLO and OpenCV.

## Current features

- Image upload and YOLO object detection
- Annotated image results
- Detection confidence and object counts
- Video upload and frame-by-frame YOLO detection
- Annotated video playback
- Basic video metadata and class counts

## Stack

- **Frontend:** Next.js, TypeScript
- **Backend:** Python, FastAPI
- **Computer Vision:** Ultralytics YOLO, PyTorch, OpenCV
- **API:** REST

## Local development

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

## Development status

- [x] Repository foundation
- [x] Image detection
- [x] Video detection
- [ ] Object tracking
- [ ] Live webcam detection
- [ ] Results dashboard
- [ ] Exportable reports
- [ ] Custom electronics-component model
- [ ] Tests and deployment

> The first version is intentionally software-only. No electronics purchase is required.
