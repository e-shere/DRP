import { ChangeEvent } from "react";
import { Switch, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { changeBgColor, changeFont, lookupStyle } from "./storage";
import { TITLE } from "./App";

const oldFont = document.body.style.fontFamily;
const TRANSPARENT = "#ff000000";

function Toggle(label: string, isOn: boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-item">
      <label>{label}</label>
      <Switch onChange={onChange} checked={isOn} />
    </div>
  );
}

function Main(state: any) {
  return (
    <div className="Main">
      <header>
        <div className="nav-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        < Button
          className="nav-button"
          onClick={() => state.setPage("settings")}
          startIcon={<SettingsIcon />}
        />
      </header>
      {
        Toggle("Background", state.bgChanged, event => {
          state.setBgChanged(event.target.checked);
          if (event.target.checked) {
            chrome.storage.sync.get("bgColor", ({ bgColor }) => { changeBgColor(bgColor); });
          } else {
            changeBgColor(TRANSPARENT);
          }
        })
      }
      {
        Toggle("Font", state.fontChanged, event => {
          state.setFontChanged(event.target.checked);
          if (event.target.checked) {
            chrome.storage.sync.get("font", ({ font }) => { changeFont(font); });
          } else {
            changeFont(oldFont);
          }
        })
      }
      <Button
      className="give the button a nice name nick"
      onClick={lookupStyle}
      startIcon={<AddCircleIcon />}
      >GET STYLE</Button>
    </div>
  );
}

export default Main;