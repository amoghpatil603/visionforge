"use client";

import { ChangeEvent, useState } from "react";

type Detection = { class_name: string; confidence: number; box: number[] };
type ImageResult = {
  model: string; image: { width: number; height: number };
  detections: Detection[]; counts: Record<string, number>;
  total_objects: number; annotated_image: string;
};
type VideoResult = {
  filename: string; video: string;
  source: { width: number; height: number; fps: number; frames: number; processed_frames: number };
  counts: Record<string, number>; total_detections: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [mode, setMode] = useState<"image" | "video">("image");
  const [file, setFile] = useState<File | null>(null);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (nextMode: "image" | "video") => {
    setMode(nextMode); setFile(null); setImageResult(null); setVideoResult(null); setError("");
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setImageResult(null); setVideoResult(null); setError("");
  };

  const runDetection = async () => {
    if (!file) return;
    setLoading(true); setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/detect/${mode}`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Detection failed.");
      mode === "image" ? setImageResult(data) : setVideoResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the API.");
    } finally { setLoading(false); }
  };

  return (
    <main className="page">
      <section className="workspace">
        <div className="hero">
          <p className="eyebrow">VISIONFORGE · COMPUTER VISION WORKSPACE</p>
          <h1>See what the model sees.</h1>
          <p className="subtitle">Analyze images and videos with YOLO through the VisionForge computer vision pipeline.</p>
        </div>

        <div className="mode-switch">
          <button className={mode === "image" ? "mode active" : "mode"} onClick={() => switchMode("image")}>Image</button>
          <button className={mode === "video" ? "mode active" : "mode"} onClick={() => switchMode("video")}>Video</button>
        </div>

        <div className="upload-card">
          <label className="dropzone">
            <input
              type="file"
              accept={mode === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm,video/quicktime"}
              onChange={handleFile}
            />
            <span className="upload-title">{file ? file.name : `Choose a ${mode}`}</span>
            <span className="upload-hint">
              {mode === "image" ? "JPEG, PNG or WebP · YOLO11n detection" : "MP4, WebM or MOV · frame-by-frame YOLO detection"}
            </span>
          </label>
          <button className="detect-button" disabled={!file || loading} onClick={runDetection}>
            {loading ? (mode === "video" ? "Processing video..." : "Analyzing...") : (mode === "video" ? "Process video" : "Run detection")}
          </button>
          {error && <p className="error">{error}</p>}
        </div>

        {imageResult && (
          <section className="results">
            <div className="result-header"><div><p className="eyebrow">IMAGE RESULT</p><h2>{imageResult.total_objects} objects detected</h2></div><span className="model-badge">{imageResult.model}</span></div>
            <img className="result-image" src={imageResult.annotated_image} alt="Annotated detection result" />
            <div className="stats">
              <div className="stat"><span>Total objects</span><strong>{imageResult.total_objects}</strong></div>
              <div className="stat"><span>Unique classes</span><strong>{Object.keys(imageResult.counts).length}</strong></div>
              <div className="stat"><span>Image size</span><strong>{imageResult.image.width} × {imageResult.image.height}</strong></div>
            </div>
            <div className="detection-list">
              {imageResult.detections.map((d, i) => <div className="detection-row" key={`${d.class_name}-${i}`}><span>{d.class_name}</span><span>{(d.confidence * 100).toFixed(1)}%</span></div>)}
            </div>
          </section>
        )}

        {videoResult && (
          <section className="results">
            <div className="result-header"><div><p className="eyebrow">VIDEO RESULT</p><h2>{videoResult.total_detections} detections across {videoResult.source.processed_frames} frames</h2></div><span className="model-badge">YOLO11n</span></div>
            <video className="result-image" controls src={videoResult.video} />
            <div className="stats">
              <div className="stat"><span>Frames processed</span><strong>{videoResult.source.processed_frames}</strong></div>
              <div className="stat"><span>Source FPS</span><strong>{videoResult.source.fps}</strong></div>
              <div className="stat"><span>Resolution</span><strong>{videoResult.source.width} × {videoResult.source.height}</strong></div>
            </div>
            <div className="detection-list">
              {Object.entries(videoResult.counts).map(([name, count]) => <div className="detection-row" key={name}><span>{name}</span><span>{count}</span></div>)}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
