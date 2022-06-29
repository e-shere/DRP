import { useLayoutEffect, useState } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import "./App.css";
import { updatePage } from "./pageStyle";
import { Presets } from "./Preset";
import { DEFAULT_PRESET } from "./common/domain";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

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
  const [tab, setTab] = useState("error");
  const [disbaled, setDisabled] = useState(false);

  useLayoutEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true },
      tab => { setTab(tab[0].url ?? "error") }
    );
  }, []);

  /* Refresh page on any settings change */
  useLayoutEffect(() => {
    if (tab.includes("clarify")) {
      setDisabled(true);
    } else {
      updatePage(settings, preset);
    }
  }, [settings, preset]);


  return (
    <div className="App">
      <Dialog open={disbaled}>
        <DialogTitle>Extension Disabled</DialogTitle>
        <DialogContent>
          <DialogContentText>Disable on Clarify for demonstration purposes.</DialogContentText>
        </DialogContent>
      </Dialog>
      {Main(settings, preset, setSettings, setPreset)}
      {Presets(settings, deleteLabel, setSettings, setPreset, setDeleteLabel)}
    </div>
  )
}

export default App;
