import { useRef } from "react";

function DashboardView({
  selectedFile,
  previewUrl,
  model,
  setModel,
  result,
  loading,
  error,
  handleFileChange,
  handleDetect,
  handleClear,
}) {
  const topLabel = (() => {
    if (!result?.summary) return "No detection";

    if (result.summary.fire_count > 0) return "fire";
    if (result.summary.smoke_count > 0) return "smoke";
    return "No detection";
  })();

  const topLabelClassName =
    topLabel === "fire"
      ? "top-label-fire"
      : topLabel === "smoke"
        ? "top-label-smoke"
        : "top-label-safe";

  const riskClassName = result?.risk_level
    ? `risk-${result.risk_level}`
    : "";

  const getDetectionPalette = (className) => {
    if (className === "fire") {
      return {
        border: "#ef4444",
        background: "rgba(239, 68, 68, 0.92)",
      };
    }

    if (className === "smoke") {
      return {
        border: "#f4c95d",
        background: "rgba(244, 201, 93, 0.92)",
      };
    }

    return {
      border: "#38d68d",
      background: "rgba(56, 214, 141, 0.92)",
    };
  };

  const imgRef = useRef(null);

  return (
    <div className="app">
      <header className="header">
        <div className="header-copy">
          <h1>Bushfire Smoke Detection Dashboard</h1>
          <p>A CNN Based Bushfire Smoke Detection AI</p>
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

          <label className="upload-box">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div className="upload-content">
              {selectedFile ? (
                <span>{selectedFile.name}</span>
              ) : (
                <span>Click to upload image</span>
              )}
            </div>
          </label>

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

          <div className="image-box" style={{ position: "relative" }}>
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
                    const scaleX = imgRef.current.clientWidth / result.image_width;
                    const scaleY = imgRef.current.clientHeight / result.image_height;
                    const offsetX = imgRef.current.offsetLeft;
                    const offsetY = imgRef.current.offsetTop;
                    const palette = getDetectionPalette(det.class_name);

                    return (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          left: offsetX + x1 * scaleX,
                          top: offsetY + y1 * scaleY,
                          width: (x2 - x1) * scaleX,
                          height: (y2 - y1) * scaleY,
                          border: `2px solid ${palette.border}`,
                          boxSizing: "border-box",
                          borderRadius: "8px",
                          boxShadow: `0 0 0 1px ${palette.border}33`,
                        }}
                      >
                        <span
                          style={{
                            background: palette.background,
                            color: det.class_name === "smoke" ? "#111111" : "white",
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "3px 6px",
                            borderRadius: "6px 0 6px 0",
                            display: "inline-block",
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
            <span className={`value ${topLabelClassName}`}>{topLabel}</span>
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
    </div>
  );
}

export default DashboardView;
