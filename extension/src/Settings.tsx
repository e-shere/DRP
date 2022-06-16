import { Button, Select, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { SketchPicker } from 'react-color';

import { TITLE, UserSettings } from "./App";

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

function Settings(settings: UserSettings, setSettings: (_: UserSettings) => void, setPage: (_: string) => void) {
  return (
    <div className="Settings">
      <header>
        <Button
          className="nav-button"
          onClick={() => setPage("main")}
          startIcon={<ArrowBackIosNewIcon />}
        />
        <h1>{TITLE}</h1>
      </header>
      <FormControl fullWidth>
        <div className="setting">
          <InputLabel>Font</InputLabel>
          <Select
            label="Font"
            value={settings.font}
            onChange={event => { setSettings({ ...settings, font: event.target.value }) }}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Roboto">Roboto</MenuItem>
          </Select>
        </div>
        <div className="setting">
          <TextField
            label="Font Size Increase"
            variant="outlined"
            type="number"
            value={settings.fontSizeIncrease}
            onChange={event => { setSettings({ ...settings, fontSizeIncrease: Number(event.target.value) }) }}
          />
        </div>
        <div className="setting">
          <TextField
            label="Letter Spacing"
            variant="outlined"
            type="number"
            value={settings.fontSpacingIncrease}
            onChange={event => { setSettings({ ...settings, fontSpacingIncrease: Number(event.target.value) }) }}
          />
        </div>
        <div className="setting">
          <label className="bg-color-input-label">Background</label>
          <SketchPicker
            width="92.5%"
            presetColors={PRESET_BG_COLORS}
            color={settings.bgColor}
            onChange={color => { setSettings({ ...settings, bgColor: color.hex }) }}
          />
        </div>
      </FormControl>
    </div>
  );
}

export default Settings;
