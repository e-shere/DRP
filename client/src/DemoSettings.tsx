import { TextField, MenuItem, FormControl } from "@mui/material";
import { ChangeEvent } from "react";
import { SketchPicker } from 'react-color';
import { Preset } from "./demo-scripts";

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

/* Formula from: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
/* Takes colour hex as parameter */
function Luminance(h: string): number {
  var r: number = parseInt("0x" + h[1] + h[2]);
  var g: number = parseInt("0x" + h[3] + h[4]);
  var b: number = parseInt("0x" + h[5] + h[6]);
  var rgb = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

/* Formula from:https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio */
/* Takes colour hexes as parameter */
function Contrast(c1: string, c2: string): number {
  var lum1 = Luminance(c1);
  var lum2 = Luminance(c2);
  var lighter = Math.max(lum1, lum2);
  var darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* For now will return either white or black */
/* Takes colour hex as parameter */
function OptimumFontColour(background: string): string {
  var white: string = "#ffffff";
  var black: string = "#000000";
  const contrastThreshold = 4.5; /* https://www.w3.org/TR/WCAG21/#contrast-minimum */

  var contrast: number = Contrast(white, background);

  return (contrast >= 4.5) ? white : black;
}

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
          onChange={(color: { hex: string; }) => { setPreset({ ...preset, bgColor: color.hex, fontColor: OptimumFontColour(color.hex) }) }}
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
    </FormControl>
  );
}


export { BackgroundSettings, FontSettings };