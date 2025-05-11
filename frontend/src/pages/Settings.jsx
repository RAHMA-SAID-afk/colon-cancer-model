import React, { useState, useEffect } from 'react';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const storedDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDark);
    document.body.classList.toggle('dark-mode', storedDark);
  }, []);

  const handleDarkToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const savePreferences = () => {
    localStorage.setItem('darkMode', darkMode);
    alert('✅ Preferences saved!');
  };

  const resetPreferences = () => {
    localStorage.clear();
    setDarkMode(false);
    document.body.classList.remove('dark-mode');
    alert('🔁 Preferences reset to default');
  };

  return (
    <div className="main-content">
      <h2>⚙️ Settings</h2>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Preferences</h3>

          <div className="setting-item">
            <label>🌗 Dark Mode</label>
            <input type="checkbox" checked={darkMode} onChange={handleDarkToggle} />
          </div>

          <div className="setting-buttons">
            <button onClick={savePreferences}>💾 Save Preferences</button>
            <button onClick={resetPreferences} className="danger">♻️ Reset</button>
          </div>
        </div>

        <div className="settings-card">
          <h3>System Info</h3>
          <p><strong>App Version:</strong> 1.0.0</p>
          <p><strong>Environment:</strong> Development</p>
          <p><strong>Database:</strong> MySQL</p>
          <p><strong>User:</strong> Admin</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
