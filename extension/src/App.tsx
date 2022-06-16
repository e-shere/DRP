import { useState, useEffect } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import Settings from "./Settings";
import "./App.css";
import { updatePage } from "./pageStyle";

export const TITLE = "Clarify.";
const DEFAULT_FONT = "Arial";
const DEFAULT_FONT_INCREASE = 0;
const DEFAULT_BG_COLOR = "#ffffff"; /* white */

export interface UserSettings {
  styleChanged: boolean,
  bgColor: string;
  bgChanged: boolean;
  font: string;
  fontSizeIncrease: number;
  fontChanged: boolean;
}

function App() {
  const [page, setPage] = useState("main");
  const [settings, setSettings] = useChromeStorageSync(
    "settings", {
    styleChanged: false,
    bgChanged: false,
    fontChanged: false,
    bgColor: DEFAULT_BG_COLOR,
    font: DEFAULT_FONT,
    fontSizeIncrease: DEFAULT_FONT_INCREASE,
  });

  /* Load settings from chrome sync */
  useChromeStorageSync("settings", setSettings);

  /* Update page on settings change if toggle is set */

  useEffect(() => {
    updatePage(settings)
  }, [settings]);

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
