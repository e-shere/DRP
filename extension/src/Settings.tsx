import { TextField, MenuItem, FormControl } from "@mui/material";
import { ChangeEvent } from "react";
import { SketchPicker } from 'react-color';
import { Preset } from "./App";

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

function BackgroundSettings(preset: Preset, setPreset: (_: Preset) => void) {
  return (
    <FormControl fullWidth>
      <div className="setting">
        <SketchPicker
          width="91.5%"
          presetColors={PRESET_BG_COLORS}
          color={preset.bgColor}
          onChange={color => setPreset({ ...preset, bgColor: color.hex }) }
        />
      </div>
    </FormControl>
  );
}

function FontSettings(preset: Preset, setPreset: (_: Preset) => void) {
  return (
    <FormControl fullWidth>
      <div className="setting">
        <TextField
          select
          fullWidth
          label="Font"
          value={preset.font}
          onChange={event => { setPreset({ ...preset, font: event.target.value }) }}
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
        preset.fontSize,
        event => { setPreset({ ...preset, fontSize: Number(event.target.value) }) }
      )}
      {NumberField(
        "Letter Spacing",
        0,
        20,
        preset.letterSpacing,
        event => { setPreset({ ...preset, letterSpacing: Number(event.target.value) }) }
      )}
      {NumberField(
        "Line Spacing",
        0,
        30,
        preset.lineSpacing,
        event => { setPreset({ ...preset, lineSpacing: Number(event.target.value) }) }
      )}
      <div className="setting">
        <label className="color-input-label">Font Colour</label>
        <SketchPicker
          width="91.5%"
          presetColors={["#ffffff", "#000000"]}
          color={preset.fontColor}
          onChange={color => { setPreset({ ...preset, fontColor: color.hex }) }}
        />
      </div>
    </FormControl>
  );
}


export { BackgroundSettings, FontSettings };
