import { useState } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import Settings from "./Settings";
import "./App.css";

export const TITLE = "Claraify.";
const DEFAULT_FONT = "Arial";
const DEFAULT_BG_COLOR = "#ffffff"; /* white */

export interface UserSettings {
  bgColor: string;
  bgChanged: boolean;
  font: string;
  fontChanged: boolean;
}

function App() {
  const [page, setPage] = useState("main");
  const [settings, setSettings] = useChromeStorageSync(
    "settings",
    { bgColor: DEFAULT_BG_COLOR, bgChanged: false, font: DEFAULT_FONT, fontChanged: false }
  );

  useChromeStorageSync("settings", setSettings);

  function selectPage(page: string) {
    switch (page) {
      case "settings":
        return Settings(settings, setSettings, setPage);
      default:
        return Main(settings, setSettings, setPage);
    }
  }

  return (
    <div className="App">
      {selectPage(page)}
    </div>
  );
}

export default App;
