import { useState, useEffect } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import Settings from "./Settings";
import "./App.css";
import { setPageBgColor, setPageFont } from "./pageStyle";

export const TITLE = "Claraify.";
const DEFAULT_FONT = "Arial";
const DEFAULT_BG_COLOR = "#ffffff"; /* white */
const INITIAL_FONT = document.body.style.fontFamily;
const INITIAL_BG_COLOR = document.body.style.backgroundColor;

export interface UserSettings {
  styleChanged: boolean,
  bgColor: string;
  bgChanged: boolean;
  font: string;
  fontChanged: boolean;
}

function App() {
  const [page, setPage] = useState("main");
  const [settings, setSettings] = useChromeStorageSync(
    "settings",
    { 
      styleChanged: false,
      bgColor: DEFAULT_BG_COLOR, 
      bgChanged: false, 
      font: DEFAULT_FONT, 
      fontChanged: false 
    }
  );

  /* Load settings from chrome sync */
  useChromeStorageSync("settings", setSettings);

  /* Update page on settings change if toggle is set */

  useEffect(() => {
    if (settings.styleChanged && settings.bgChanged) {
      setPageBgColor(settings.bgColor);
    }
  }, [settings.bgColor]);

  useEffect(() => {
    if (settings.styleChanged && settings.fontChanged) {
      setPageFont(settings.font);
    }
  }, [settings.font]);

  /* Reset page when toggle is unset */

  useEffect(() => {
    setPageFont(settings.styleChanged && settings.fontChanged ? settings.font : INITIAL_FONT);
  }, [settings.fontChanged, settings.styleChanged]);
  
  useEffect(() => {
    setPageBgColor(settings.styleChanged && settings.bgChanged ? settings.bgColor : INITIAL_BG_COLOR);
  }, [settings.bgChanged, settings.styleChanged]);

  /* Todo: better method for page navigation */
  function selectPage() {
    switch (page) {
      case "settings":
        return Settings(settings, setSettings, setPage);
      default:
        return Main(settings, setSettings, setPage);
    }
  }

  return (
    <div className="App">
      {selectPage()}
    </div>
  )
}

export default App;
