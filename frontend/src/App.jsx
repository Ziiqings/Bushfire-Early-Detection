import { useState } from "react";
import "./App.css";
import DashboardView from "./components/DashboardView.jsx";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [model, setModel] = useState("v8s");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

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

  const getPrimaryLabel = (data) => {
    if (!data?.summary) return "No threat";

    if (data.summary.fire_count > 0) return "fire";
    if (data.summary.smoke_count > 0) return "smoke";
    return "No threat";
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
        label: getPrimaryLabel(data),
        risk: data.risk_level || "safe",
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 6));
    } catch (err) {
      console.error("Detect error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardView
      selectedFile={selectedFile}
      previewUrl={previewUrl}
      model={model}
      setModel={setModel}
      result={result}
      loading={loading}
      error={error}
      history={history}
      handleFileChange={handleFileChange}
      handleDetect={handleDetect}
      handleClear={handleClear}
    />
  );
}

export default App;