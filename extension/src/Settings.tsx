import { Select, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import { SketchPicker } from 'react-color';

import { UserSettings } from "./App";

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

function BackgroundSettings(settings: UserSettings, setSettings: (_: UserSettings) => void) {
  return (
    <FormControl fullWidth>
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
  );
}

function FontSettings(settings: UserSettings, setSettings: (_: UserSettings) => void) {
  return (
    <FormControl fullWidth>
        <div className="setting">
          <InputLabel>Font</InputLabel>
          <Select
            fullWidth
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
            fullWidth
            InputProps={{ inputProps: { min: -20, max: 50 } }}
            onWheel={event => event.target instanceof HTMLElement && event.target.blur()}
            label="Font Size Increase"
            variant="outlined"
            type="number"
            value={settings.fontSizeIncrease}
            onChange={event => { setSettings({ ...settings, fontSizeIncrease: Number(event.target.value) }) }}
          />
        </div>
        <div className="setting">
          <TextField
            fullWidth
            InputProps={{ inputProps: { min: 0, max: 10 } }}
            onWheel={event => event.target instanceof HTMLElement && event.target.blur()}
            label="Letter Spacing"
            variant="outlined"
            type="number"
            value={settings.fontSpacingIncrease}
            onChange={event => { setSettings({ ...settings, fontSpacingIncrease: Number(event.target.value) }) }}
          />
        </div>
      </FormControl>
  );
}


export {BackgroundSettings, FontSettings};
