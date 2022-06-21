import { useEffect } from "react";
import { useChromeStorageSync } from 'use-chrome-storage';

import Main from "./Main";
import "./App.css";
import { updatePage } from "./pageStyle";

export const TITLE = "Clarify.";
export const WEBAPP_URL = "https://clarify-this.herokuapp.com/";

export interface UserSettings {
  styleChanged: boolean,
  bgChanged: boolean;
  fontChanged: boolean;
  punctuationSpacingChanged: boolean;
  bgColor: string;
  font: string;
  fontSize: number;
  letterSpacing: number;
  lineSpacing: number;
  fontColor: string;
}

function App() {
  const [settings, setSettings] = useChromeStorageSync(
    "settings", {
    styleChanged: true,
    bgChanged: false,
    fontChanged: false,
    punctuationSpacing: false,
    bgColor: "white",
    font: "Arial",
    fontSize: 0,
    letterSpacing: 0,
    lineSpacing: 0,
    fontColor: "black",
  });

  /* Refresh page on any settings change */
  useEffect(() => { updatePage(settings) }, [settings]);

  return (
    <div className="App">
      {Main(settings, setSettings)}
    </div>
  )
}

export default App;
