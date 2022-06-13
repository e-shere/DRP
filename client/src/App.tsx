import { FormEvent, useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { getDbStyle, setDbStyle } from "./styleDB";
import Style from "./style";
import "./App.css";

// TODO: Fetch env vars from the server (they are public so should not be security problem for now)
const PUSHER_KEY = "92e02b3a0a7919063500"
const PUSHER_CLUSTER = "eu"

const PUSHER_CHANNEL = "claraify";
const SUBMIT_EVENT = "submit";

const PRODUCTION = process.env.PRODUCTION || false;

function App() {
  const [style, setStyle] = useState(new Style("Open Sans", 12, "white"));

  // Binding to update styles in real time
  useEffect(() => {
    if (PRODUCTION) {
      // subscribe to pusher only in production (to be isolated when runnig locally)
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER })
      pusher.subscribe(PUSHER_CHANNEL).bind(SUBMIT_EVENT, (style: Style) => setStyle(style))
      return (() => pusher.unsubscribe(PUSHER_CHANNEL))
    }
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

    // Pusher submit event 
    axios.post(`/${SUBMIT_EVENT}`, style);

    // Update db
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
