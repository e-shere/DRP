import { Button, Select, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { SketchPicker } from 'react-color';

import { TITLE, UserSettings, WEBAPP_URL } from "./App";

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
            value={settings.fontSize}
            onChange={event => { setSettings({ ...settings, fontSize: Number(event.target.value) }) }}
          />
        </div>
        <div className="setting">
          <TextField
            fullWidth
            InputProps={{ inputProps: { min: 0, max: 20 } }}
            onWheel={event => event.target instanceof HTMLElement && event.target.blur()}
            label="Letter Spacing"
            variant="outlined"
            type="number"
            value={settings.letterSpacing}
            onChange={event => { setSettings({ ...settings, letterSpacing: Number(event.target.value) }) }}
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
