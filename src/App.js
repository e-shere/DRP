import React from 'react';
import { useState } from 'react';
import './App.css';

class Style {
  constructor(font, fontSize, bgColor) {
    this.font = font;
    this.fontSize = fontSize;
    this.bgColor = bgColor;
  }
}

function App() {
  const testRows = [new Style("Open Sans", 20, "orange"), new Style("Arial", 2, "green")]
  return (
    <div className="App">
      <header className="App-header">
        {form()}
        {styles(testRows)}
      </header>
    </div>
  );
}

function styles(styles) {
  const rows = [];
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    rows.push(
      <tr>
        <td>{style.font + ", " + style.fontSize + ", " + style.bgColor}</td>
      </tr>
    )
  }
  return rows;
}

function form() {
  const [font, setFont] = useState("Open Sans");
  const [bgColor, setBgColor] = useState("white");
  const [fontSize, setFontSize] = useState(12);

  const handleSubmit = event => {
    event.preventDefault(); // Stop page refresh
    alert("Style: " + font + ", " + fontSize + ", " + bgColor);

    setFont("");
    setFontSize("");
    setBgColor("");
  }

  return (
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
  );
}

export default App;
