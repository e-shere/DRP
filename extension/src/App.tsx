import { useEffect, useState } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import "./App.css";
import { updatePage } from "./pageStyle";
import { Presets } from "./Preset";
import { DEFAULT_PRESET } from "./common/domain";

export const TITLE = "Clarify.";
export const WEBAPP_URL = "https://clarify-this.herokuapp.com/";

var wasTriggeredByDemoWebapp = false;

function App() {
  const [deleteLabel, setDeleteLabel] = useState("");
  const [settings, setSettings] = useChromeStorageSync(
    "settings", {
    styleChanged: false,
    presets: [DEFAULT_PRESET],
  });
  
  const [preset, setPreset] = useChromeStorageSync("preset", DEFAULT_PRESET);

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.msg === "SendPresetToExtension") {
        console.log(`Sender is ${JSON.stringify(request.sender)}`);
        wasTriggeredByDemoWebapp = true;
        /* Store the preset from the webapp into the current extension configuration */
        console.log("Updating");
        setPreset(request.data);
        // console.log(`Setting the preset... ${JSON.stringify(request.data)}`);
        sendResponse({ success: true });
      }
      return true;
  });
  
  /* Refresh page on any settings change */
  useEffect(() => { 
    console.log("Entered");
    if (wasTriggeredByDemoWebapp) {
      console.log("I will not update the page here"); /* updatePage(settings, preset)*/ 
      wasTriggeredByDemoWebapp = false;
    } else {
      console.log("Updating page style");
      updatePage(settings, preset);
    }
    console.log("Exiting");
  }, [settings, preset]);

  return (
    <div className="App">
      {Main(settings, preset, setSettings, setPreset)}
      {Presets(settings, deleteLabel, setSettings, setPreset, setDeleteLabel)}
    </div>
  )
}

export default App;
