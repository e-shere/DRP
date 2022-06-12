import { FormEvent, useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { getDbStyle, setDbStyle } from "./styleDB";
import Style from "./style";
import "./App.css";

const CHANNEL = "claraify"
const PORT = process.env.PORT || 4001;

function App() {
  const [style, setStyle] = useState(new Style("Open Sans", 12, "white"));
  
  // real time update style binding
  useEffect(() => {
    // TODO: pretty sure this is safe but idk why process.env is not working?
    const pusher = new Pusher( process.env.PUSHER_KEY || "92e02b3a0a7919063500", {
      cluster: process.env.PUSHER_CLUSTER || "eu"
    })
    const channel = pusher.subscribe(CHANNEL);
    channel.bind("submit", function (style: Style) {
      setStyle(style);
    })

    return (() => {
      pusher.unsubscribe(CHANNEL)
    })
  }, []);

  // Set style from DB on initial load
  useEffect(() => { getDbStyle().then(style => setStyle(style)) }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Form()}
        </div>
        <div className="Style-table">
          {Styles(style)}
        </div>
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
  const [fontSize, setFontSize] = useState(12);
  const [bgColor, setBgColor] = useState("#FFFFFF");

  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Stop page refresh
    const style = new Style(font, fontSize, bgColor);

    // real time pusher
    axios.post(`http://localhost:${PORT}/submit`, style);

    // update db
    setDbStyle(style);
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
