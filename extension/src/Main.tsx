import { ChangeEvent } from "react";
import axios from "axios";
import { Switch, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { TITLE, UserSettings } from "./App";
const HEROKU_URL = `https://${TITLE}.herokuapp.com/`

function LabelledSwitch(label: string, isOn: boolean, enabled: boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-item">
      <label>{label}</label>
      <Switch onChange={onChange} checked={isOn} disabled={!enabled} />
    </div>
  );
}

async function lookupStyle() {
  const res = axios.get(`${HEROKU_URL}serve-style`);
  res.then(res => res.data).then(res => { console.log(res) });
  return (await res).data;
}

function Main(settings: UserSettings, setSettings: (_: UserSettings) => void, setPage: (_: string) => void) {
  return (
    <div className="Main">
      <header>
        <div className="header-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        <div className="header-button">
          <Switch
            onChange={event => setSettings({ ...settings, styleChanged: event.target.checked })}
            checked={settings.styleChanged}
          />
        </div>
      </header>
      {LabelledSwitch(
        "Background",
        settings.bgChanged,
        settings.styleChanged,
        event => { setSettings({ ...settings, bgChanged: event.target.checked }) }
      )}
      {LabelledSwitch(
        "Font",
        settings.fontChanged,
        settings.styleChanged,
        event => { setSettings({ ...settings, fontChanged: event.target.checked }) }
      )}
      {/* <Button onClick={lookupStyle} startIcon={<AddCircleIcon />}></Button> */}
      < Button
        onClick={() => { setPage("settings") }}
        startIcon={<SettingsIcon />}
      />
    </div>
  );
}

export default Main;