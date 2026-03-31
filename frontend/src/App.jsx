import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Bushfire Smoke Detection Dashboard</h1>
          <p>Frontend prototype for smoke and fire detection</p>
        </div>
        <div className="status-badge">Mock Mode</div>
      </header>

      <main className="main-layout">
        <aside className="card sidebar">
          <h2>Controls</h2>
          <button className="primary-btn">Upload</button>
          <button className="secondary-btn">Detect</button>
          <button className="secondary-btn">Clear</button>
        </aside>

        <section className="card image-area">
          <h2>Image Preview</h2>
          <div className="image-box">Image goes here</div>
        </section>

        <aside className="card info-panel">
          <h2>Detection Result</h2>
          <div className="info-item">
            <span className="label">Label</span>
            <span className="value smoke">Smoke</span>
          </div>
          <div className="info-item">
            <span className="label">Confidence</span>
            <span className="value">0.87</span>
          </div>
          <div className="info-item">
            <span className="label">Risk</span>
            <span className="value risk-medium">Medium</span>
          </div>
        </aside>
      </main>

      <section className="card history">
        <h2>History</h2>
        <div className="history-list">
          <div className="history-row">
            <span>image1.jpg</span>
            <span>Smoke</span>
            <span className="risk-medium">Medium</span>
          </div>
          <div className="history-row">
            <span>image2.jpg</span>
            <span>No threat</span>
            <span className="risk-low">Low</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;