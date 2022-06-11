import { FormEvent, useState, useEffect } from "react";
import { getAll as getStyle, setStyle } from "./styleDB";
import Style from "./style";

import "./App.css";

const PUSHER_URL = "https://js.pusher.com/7.0.3/pusher.min.js"

function App() {
  const [style, setStyle] = useState(new Style("Open Sans", 12, "white"));

  useEffect(() => { setStyle(getStyle()) }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Form()}
        </div>
        <div className="Style-table">
          {Styles(style)}
        </div>
        {/* Not sure what to put here */}
      </header>
    </div>
  );
}

function Styles(style: Style) {
  return (
    <table>
      {(style == null)
        ? []
        : [<tr><td>{style.font}</td><td>{style.fontSize}</td><td>{style.bgColor}</td></tr>]}
    </table>
  );
}

function Form() {
  const [font, setFont] = useState("Open Sans");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(12);

  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Stop page refresh
    setStyle(new Style(font, fontSize, bgColor));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Font</label>
      <select value={font} onChange={event => setFont(event.target.value)}>
        <option value="Open Sans">Open Sans</option>
        <option value="Comic Sans">Comic Sans</option>
        <option value="Roboto">Roboto</option>
      </select>
      <label>Font Size</label>
      <input
        type="number"
        value={fontSize}
        onChange={event => setFontSize(Number(event.target.value))} placeholder="font size"
      />
      <label>Background Colour</label>
      <input
        type="color"
        value={bgColor}
        onChange={event => setBgColor(event.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
