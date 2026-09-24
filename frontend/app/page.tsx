"use client";

import { ChangeEvent, useState } from "react";

type Detection = {
  class_name: string;
  confidence: number;
  box: number[];
};

type DetectionResult = {
  model: string;
  image: { width: number; height: number };
  detections: Detection[];
  counts: Record<string, number>;
  total_objects: number;
  annotated_image: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setError("");
  };

  const runDetection = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/detect/image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Detection failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="workspace">
        <div className="hero">
          <p className="eyebrow">VISIONFORGE · COMPUTER VISION WORKSPACE</p>
          <h1>See what the model sees.</h1>
          <p className="subtitle">
            Upload an image and run real YOLO object detection through the
            VisionForge FastAPI backend.
          </p>
        </div>

        <div className="upload-card">
          <label className="dropzone">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
            />
            <span className="upload-title">
              {file ? file.name : "Choose an image"}
            </span>
            <span className="upload-hint">
              JPEG, PNG or WebP · YOLO11n detection
            </span>
          </label>

          <button
            className="detect-button"
            disabled={!file || loading}
            onClick={runDetection}
          >
            {loading ? "Analyzing..." : "Run detection"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>

        {result && (
          <section className="results">
            <div className="result-header">
              <div>
                <p className="eyebrow">RESULT</p>
                <h2>{result.total_objects} objects detected</h2>
              </div>
              <span className="model-badge">{result.model}</span>
            </div>

            <img
              className="result-image"
              src={result.annotated_image}
              alt="Annotated detection result"
            />

            <div className="stats">
              <div className="stat">
                <span>Total objects</span>
                <strong>{result.total_objects}</strong>
              </div>
              <div className="stat">
                <span>Unique classes</span>
                <strong>{Object.keys(result.counts).length}</strong>
              </div>
              <div className="stat">
                <span>Image size</span>
                <strong>{result.image.width} × {result.image.height}</strong>
              </div>
            </div>

            <div className="detection-list">
              {result.detections.map((detection, index) => (
                <div className="detection-row" key={`${detection.class_name}-${index}`}>
                  <span>{detection.class_name}</span>
                  <span>{(detection.confidence * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
