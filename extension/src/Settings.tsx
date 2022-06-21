import { ChangeEvent } from "react";
import { Button, Select, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { SketchPicker } from 'react-color';

import { TITLE, UserSettings, WEBAPP_URL } from "./App";

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
        <div className="setting">
          <label className="bg-color-input-label">Background</label>
          <SketchPicker
            width="92.5%"
            presetColors={PRESET_BG_COLORS}
            color={settings.bgColor}
            onChange={color => { setSettings({ ...settings, bgColor: color.hex }) }}
          />
        </div>
        <Button
          href={WEBAPP_URL}
          target="_blank"
          variant="outlined"
        >Presets</Button>
      </FormControl>
    </div>
  );
}

export default Settings;
