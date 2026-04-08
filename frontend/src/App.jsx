import { useMemo, useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [model, setModel] = useState("v8s");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const riskClassName = useMemo(() => {
    if (!result?.risk_level) return "";
    return `risk-${result.risk_level}`;
  }, [result]);

  const topLabel = useMemo(() => {
    if (!result?.detections?.length) return "No detection";
    const first = result.detections[0]?.class_name || "Unknown";
    return first.charAt(0).toUpperCase() + first.slice(1);
  }, [result]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(
        `http://127.0.0.1:8080/predict?model=${model}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Detection failed.");
      }

      setResult(data);

      const historyItem = {
        filename: data.filename,
        label:
          data.detections?.length > 0
            ? data.detections[0].class_name
            : "No threat",
        risk: data.risk_level || "safe",
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 6));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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

          <div className="image-box">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
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
            <span className="value">
              {result?.summary?.smoke_count ?? "-"}
            </span>
          </div>

          <div className="info-item">
            <span className="label">Fire Count</span>
            <span className="value">
              {result?.summary?.fire_count ?? "-"}
            </span>
          </div>

          <div className="info-item">
            <span className="label">Max Confidence</span>
            <span className="value">
              {result?.summary?.max_confidence ?? "-"}
            </span>
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

export default App;