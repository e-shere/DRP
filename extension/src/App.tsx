import { useState, useEffect } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import Settings from "./Settings";
import "./App.css";
import { updatePage } from "./pageStyle";

export const TITLE = "Clarify.";
export const WEBAPP_URL = "https://claraify.herokuapp.com/";

export interface UserSettings {
  styleChanged: boolean,
  bgChanged: boolean;
  fontChanged: boolean;
  bgColor: string;
  font: string;
  fontSize: number;
  letterSpacing: number;
  lineSpacing: number;
  fontColor: string;
}

function App() {
  const [page, setPage] = useState("main");
  const [settings, setSettings] = useChromeStorageSync(
    "settings", {
    styleChanged: true,
    bgChanged: false,
    fontChanged: false,
    bgColor: "#ffffff", /* white */
    font: "Arial",
    fontSize: 0,
    letterSpacing: 0,
    lineSpacing: 0,
    fontColor: "black",
  });

  /* Load settings from chrome sync */
  useChromeStorageSync("settings", setSettings);

  /* Refresh page on any settings change */
  useEffect(() => { updatePage(settings) }, [settings]);

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
