import { useState } from "react";
import { Switch, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { UserSettings, Preset } from "./common/domain";
import { StyleSettings } from "./common/Settings";
import { SavePresetButton } from "./Preset";
import { TITLE } from "./App";
import "./App.css";

function Main(
  settings: UserSettings,
  preset: Preset,
  setSettings: (_: UserSettings) => void,
  setPreset: (_: Preset) => void
) {
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <div style={{ height: settings.presets.length == 0 ? "100%" : "77%" }} className="Main">
      <header>
        <div className="header-button">
          <IconButton color="primary" target="_blank" href="https://clarify-this-staging.herokuapp.com">
            <InfoIcon />
          </IconButton>
        </div>
        <h1>{TITLE}</h1>
        <div className="header-button">
          <Switch
            onChange={event => {
              setSettings({ ...settings, styleChanged: event.target.checked });
              setExpanded(false);
            }}
            checked={settings.styleChanged}
          />
        </div>
      </header>
      {SavePresetButton(settings, preset, setSettings)}
      {StyleSettings(preset, setPreset, expanded, setExpanded)}
    </div>
  );
}

export default Main;