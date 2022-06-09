import React from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const [font, setFont] = useState("Open Sans");
  const [bgColor, setBgColor] = useState("white");
  const [fontSize, setFontSize] = useState(12);

  const handleSubmit = event => {
    event.preventDefault(); // Stop page refresh
    alert("Style: " + font + ", " + fontSize + ", " + bgColor);

    setFont("");
    setBgColor("");
    setFontSize("");
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <select value={font} name="font" onChange={event => setFont(event.target.value)}>
            <option value="Open Sans">Open Sans</option>
            <option value="Comic Sans">Comic Sans</option>
            <option value="Roboto">Roboto</option>
          </select>
          <input type="number" value={fontSize} name="font_size" onChange={event => setFontSize(event.target.value)} placeholder="font size" />
          <input type="text" value={bgColor} name="bgColor" onChange={event => setBgColor(event.target.value)} />
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default App;
