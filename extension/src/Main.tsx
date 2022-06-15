import { ChangeEvent } from "react";
import axios from "axios";
import { Switch as MuiSwitch, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { TITLE, UserSettings } from "./App";
const HEROKU_URL = `https://${TITLE}.herokuapp.com/`

function AllSwitch(isOn:boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {

}

function Switch(label: string, isOn: boolean, disabled:boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-item">
      <label>{label}</label>
      <MuiSwitch onChange={onChange} checked={isOn} disabled={disabled}/>
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
        <div className="nav-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        {Switch(
        "",
        settings.styleChanged,
        false,
        event => { setSettings({ ...settings, styleChanged: event.target.checked }) }
      )}
      </header>
      {Switch(
        "Background",
        settings.bgChanged,
        !settings.styleChanged,
        event => { setSettings({ ...settings, bgChanged: event.target.checked }) }
      )}
      {Switch(
        "Font",
        settings.fontChanged,
        !settings.styleChanged,
        event => { setSettings({ ...settings, fontChanged: event.target.checked }) }
      )}
      <Button onClick={lookupStyle} startIcon={<AddCircleIcon />}></Button>
      < Button
          className="nav-button"
          onClick={() => { setPage("settings") }}
          startIcon={<SettingsIcon />}
        />
    </div>
  );
}

export default Main;