import { ChangeEvent } from "react";
import { Switch as MuiSwitch, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { TITLE, UserSettings } from "./App";

function Switch(label: string, isOn: boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-item">
      <label>{label}</label>
      <MuiSwitch onChange={onChange} checked={isOn} />
    </div>
  );
}

function Main(settings: UserSettings, setSettings: (_: UserSettings) => void, setPage: (_: string) => void) {
  return (
    <div className="Main">
      <header>
        <div className="nav-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        < Button
          className="nav-button"
          onClick={() => { setPage("settings") }}
          startIcon={<SettingsIcon />}
        />
      </header>
      {Switch(
        "Background",
        settings.bgChanged,
        event => { setSettings({ ...settings, bgChanged: event.target.checked }) }
      )}
      {Switch(
        "Font",
        settings.fontChanged,
        event => { setSettings({ ...settings, fontChanged: event.target.checked }) }
      )}
    </div>
  );
}

export default Main;