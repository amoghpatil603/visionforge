# VisionForge

**AI-powered computer vision workspace for image and video analysis.**

VisionForge is a software-first computer vision platform built around a FastAPI backend and a Next.js frontend. The first milestone is a working image object-detection pipeline using YOLO and OpenCV, with video analysis and additional vision tasks added incrementally.

## MVP

- Upload an image
- Run YOLO object detection
- Return an annotated image
- Show detected classes, confidence and object counts
- Keep inference logic isolated from the API layer
- Provide a clean web UI

## Planned stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI
- **Computer Vision:** Ultralytics YOLO, PyTorch, OpenCV
- **API:** REST
- **Testing:** Pytest

## Repository structure

```
visionforge/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── vision/
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Development status

- [x] Repository foundation
- [x] FastAPI health endpoint
- [x] YOLO image-detection service
- [ ] Image upload UI
- [ ] End-to-end image detection
- [ ] Video detection and tracking
- [ ] Results dashboard
- [ ] Tests and deployment

## Local development

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

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

> The first version is intentionally software-only. No electronics purchase is required.
