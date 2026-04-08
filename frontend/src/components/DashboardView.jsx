import { useRef } from "react";

function DashboardView({
  selectedFile,
  previewUrl,
  model,
  setModel,
  result,
  loading,
  error,
  history,
  handleFileChange,
  handleDetect,
  handleClear,
}) {
  const topLabel =
    result?.detections?.length > 0
      ? result.detections[0].class_name
      : "No detection";

  const riskClassName = result?.risk_level
    ? `risk-${result.risk_level}`
    : "";

  const imgRef = useRef(null);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Bushfire Smoke Detection Dashboard</h1>
          <p>Frontend connected to FastAPI + YOLO detection backend</p>
        </div>

        <div className="status-badge">
          {loading ? "Detecting..." : "System Ready"}
        </div>
      </header>

      <main className="main-layout">
        <aside className="card sidebar">
          <h2>Controls</h2>

          <label className="label">Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="v8n">YOLOv8n</option>
            <option value="v8s">YOLOv8s</option>
          </select>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button className="primary-btn" onClick={handleDetect} disabled={loading}>
            {loading ? "Detecting..." : "Detect"}
          </button>

          <button className="secondary-btn" onClick={handleClear} disabled={loading}>
            Clear
          </button>

          {selectedFile && (
            <div className="info-item">
              <span className="label">File</span>
              <span className="value">{selectedFile.name}</span>
            </div>
          )}

          {error && (
            <div className="info-item">
              <span className="label">Error</span>
              <span className="value">{error}</span>
            </div>
          )}
        </aside>

        <section className="card">
          <h2>Image Preview</h2>

          <div className="image-box" style={{position: "relative"}}>
            {previewUrl ? (
                <>
              <img
                src={previewUrl}
                alt="Preview"
                ref={imgRef}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            {result &&
              imgRef.current &&
              result.detections.map((det, index) => {
                const [x1, y1, x2, y2] = det.bbox;

                const scaleX =
                  imgRef.current.clientWidth / result.image_width;
                const scaleY =
                  imgRef.current.clientHeight / result.image_height;

                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: x1 * scaleX,
                      top: y1 * scaleY,
                      width: (x2 - x1) * scaleX,
                      height: (y2 - y1) * scaleY,
                      border: "2px solid red",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        background: "red",
                        color: "white",
                        fontSize: "12px",
                        padding: "2px 4px",
                      }}
                    >
                      {det.class_name} ({det.confidence})
                    </span>
                  </div>
                );
              })}
          </>
            ) : (
              <span>Image goes here</span>
            )}
          </div>
        </section>

        <aside className="card info-panel">
          <h2>Detection Result</h2>

          <div className="info-item">
            <span className="label">Model</span>
            <span className="value">{result?.model_used || model}</span>
          </div>

          <div className="info-item">
            <span className="label">Top Label</span>
            <span className="value smoke">{topLabel}</span>
          </div>

          <div className="info-item">
            <span className="label">Smoke Count</span>
            <span className="value">{result?.summary?.smoke_count ?? "-"}</span>
          </div>

          <div className="info-item">
            <span className="label">Fire Count</span>
            <span className="value">{result?.summary?.fire_count ?? "-"}</span>
          </div>

          <div className="info-item">
            <span className="label">Max Confidence</span>
            <span className="value">{result?.summary?.max_confidence ?? "-"}</span>
          </div>

          <div className="info-item">
            <span className="label">Risk</span>
            <span className={`value ${riskClassName}`}>
              {result?.risk_level || "-"}
            </span>
          </div>
        </aside>
      </main>

      <section className="card">
        <h2>History</h2>
        <div className="history-list">
          {history.map((item, index) => (
            <div className="history-row" key={`${item.filename}-${index}`}>
              <span>{item.filename}</span>
              <span>{item.label}</span>
              <span>{item.risk}</span>
            </div>
          ))}
        </div>
      </section>

      {result && (
        <section className="card" style={{ marginTop: "20px" }}>
          <h2>Raw API Response</h2>
          <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}

export default DashboardView;