import { FormEvent, useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { getDbStyle, setDbStyle, getAllStyles, addPreset} from "./styleDB";
import Style from "./style";
import "./App.css";
import Button from '@mui/material/Button';
import DataTable from "./preset-selection";
import { triggerMessageToExtension } from "./scripts";
import { Dialog } from "@mui/material";

// this hack is required because env variables are not visible from the frontend
const url = window.location.href;
const STAGING = url.includes("staging");
const PRODUCTION = !url.includes("staging") && !url.includes("localhost");

// TODO: Fetch env vars from the server (they are public so should not be security problem for now)
var PUSHER_KEY = PRODUCTION ? "92e02b3a0a7919063500" : "d99fd8c0f4faeacc4709";
const PUSHER_CLUSTER = "eu";

const PUSHER_CHANNEL = "claraify";
const SUBMIT_EVENT = "submit";
const ADD_TO_EXTENSION = "addex";

function App() {
  const [styles, setStyles] = useState<Style[]>([]);

  // Binding to update styles in real time
  useEffect(() => {
    if (PRODUCTION || STAGING) {
      // subscribe to pusher only in production (to be isolated when runnig locally)
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER })
      pusher.subscribe(PUSHER_CHANNEL).bind(SUBMIT_EVENT, () => getAllStyles().then(setStyles))
      return (() => pusher.unsubscribe(PUSHER_CHANNEL))
    }
  }, []);

  // useEffect(() => {getAllStyles().then(setStyles)}, []);

  return (
    <div className="App">
      <header className="App-header">
          {Form()}
          {DataTable(styles)}
      </header>
    </div>
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
    addPreset(style);
  }

  return (
    <div>
    <form className="preset-form" onSubmit={handleSubmit}>
      <label  >Font</label>
      <select value={font} onChange={event => setFont(event.target.value)}>
        <option value="Open Sans">Open Sans</option>
        <option value="Comic Sans">Comic Sans</option>
        <option value="Roboto">Roboto</option>
      </select>
      <label>Font Size</label>
      <input
        type="number"
        width={"50%"}
        value={fontSize}
        onChange={event => setFontSize(Number(event.target.value))} placeholder="font size"
      />
      <label>Background Colour</label>
      <input
        type="color"
        value={bgColor}
        onChange={event => setBgColor(event.target.value)}
      />
      <input type="submit" value="SAVE STYLE TO YOUR PRESETS" style={{width:500, height: 50, fontSize: 20, font: "Courier New (monospace)"}}/>  
      {/* <div> {[
      <Button className="style-submission" variant="contained" onClick={handleSubmit}
       style={{width:500, height: 50, fontSize: 20, font: "Courier New (monospace)"}}>
        Save style to your presets</Button>]}
        </div> */}
    </form>   
    
    </div>      
  );
}

export default App;
