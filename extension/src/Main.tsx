import { ChangeEvent } from "react";
import axios from "axios";
import { Switch, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { TITLE, UserSettings } from "./App";

const TITLE_URL = "claraify";
const HEROKU_URL = `https://${TITLE_URL}.herokuapp.com/`;
const LOCAL_HOSE = `http://localhost:3000/`
const HEROKU_STAGING = `https://${TITLE_URL}-staging.herokuapp.com/`

function LabelledSwitch(label: string, isOn: boolean, enabled: boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-item">
      <label>{label}</label>
      <Switch onChange={onChange} checked={isOn} disabled={!enabled} />
    </div>
  );
}

async function lookupStyle() {
  const res = axios.get(`${HEROKU_STAGING}serve-styles`);
  res.then(res => res.data).then(res => { return res.json().map(JSON.parse) });
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
      {LabelledSwitch(
        "Spaces after punctuation",
        settings.punctuationSpacingChanged,
        settings.styleChanged,
        event => { setSettings({ ...settings, punctuationSpacingChanged: event.target.checked }) }
      )}
      <Button onClick={() => { setPage("settings") }} startIcon={<SettingsIcon />}>
        Settings
      </Button>
    </div>
  );
}

export default Main;