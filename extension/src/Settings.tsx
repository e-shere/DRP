import { Select, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ChangeEvent } from "react";
import { SketchPicker } from 'react-color';

import { UserSettings } from "./App";

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

function NumberField(label: string, min: number, max: number, value: number, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="setting">
      <TextField
        fullWidth
        InputProps={{ inputProps: { min, max } }}
        onWheel={event => event.target instanceof HTMLElement && event.target.blur()}
        label={label}
        variant="outlined"
        type="number"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function BackgroundSettings(settings: UserSettings, setSettings: (_: UserSettings) => void) {
  return (
    <FormControl fullWidth>
      <div className="setting">
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
          <TextField
            select
            label="Font"
            value={settings.font}
            onChange={event => { setSettings({ ...settings, font: event.target.value }) }}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Roboto">Roboto</MenuItem>
          </TextField>
        </div>
        {NumberField(
          "Font Size",
          -5,
          50,
          settings.fontSize,
          event => { setSettings({ ...settings, fontSize: Number(event.target.value) }) }
        )}
        {NumberField(
          "Letter Spacing",
          0,
          20,
          settings.letterSpacing,
          event => { setSettings({ ...settings, letterSpacing: Number(event.target.value) }) }
        )}
        {NumberField(
          "Line Spacing",
          0,
          30,
          settings.lineSpacing,
          event => { setSettings({ ...settings, lineSpacing: Number(event.target.value) }) }
        )}
        <div className="setting">
          <label className="color-input-label">Font Colour</label>
          <SketchPicker
            width="92.5%"
            presetColors={["#ffffff", "#000000"]}
            color={settings.fontColor}
            onChange={color => { setSettings({ ...settings, fontColor: color.hex }) }}
          />
        </div>
      </FormControl>
  );
}


export {BackgroundSettings, FontSettings};
