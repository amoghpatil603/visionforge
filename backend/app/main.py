from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(
    title="VisionForge API",
    version="0.1.0",
    description="Computer vision API for image and video analysis.",
)

app.include_router(router, prefix="/api")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "visionforge-api"}
