export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">VISIONFORGE · COMPUTER VISION WORKSPACE</p>
        <h1>Analyze images with AI.</h1>
        <p className="subtitle">
          Upload an image, run object detection, and inspect structured results.
        </p>
        <div className="status-card">
          <span className="status-dot" />
          <div>
            <strong>MVP foundation ready</strong>
            <p>FastAPI + YOLO backend is connected in the project architecture.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
