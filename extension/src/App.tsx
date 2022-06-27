import { useEffect, useState } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import "./App.css";
import { updatePage } from "./pageStyle";
import { Presets } from "./Preset";
import { DEFAULT_PRESET } from "./common/domain";

export const TITLE = "Clarify.";
export const WEBAPP_URL = "https://clarify-this.herokuapp.com/";

function App() {
  const [deleteLabel, setDeleteLabel] = useState("");
  const [settings, setSettings] = useChromeStorageSync(
    "settings", {
    styleChanged: false,
    presets: [DEFAULT_PRESET],
  });

  const [preset, setPreset] = useChromeStorageSync('preset', DEFAULT_PRESET);
  
  /* Refresh page on any settings change */
  useEffect(() => { updatePage(settings, preset) }, [settings, preset]);

  return (
    <div className="App">
      {Main(settings, preset, setSettings, setPreset)}
      {Presets(settings, deleteLabel, setSettings, setPreset, setDeleteLabel)}
    </div>
  )
}

export default App;
