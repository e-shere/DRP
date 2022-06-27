import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import { TextField, MenuItem, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio, Switch, Typography, InputLabel, Slider } from "@mui/material";
import { SketchPicker } from 'react-color';
import { Preset, Spacing } from "./domain";

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

/* Formula from: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
/* Takes colour hex as parameter */
function Luminance(h: string): number {
  const r: number = parseInt("0x" + h[1] + h[2]);
  const g: number = parseInt("0x" + h[3] + h[4]);
  const b: number = parseInt("0x" + h[5] + h[6]);
  const rgb = [r, g, b].map(function (v) {
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
  const lum1 = Luminance(c1);
  const lum2 = Luminance(c2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* For now will return either white or black */
/* Takes colour hex as parameter */
function OptimumFontColour(background: string): string {
  const white: string = "#ffffff";
  const black: string = "#000000";
  // const contrastThreshold = 4.5; /* https://www.w3.org/TR/WCAG21/#contrast-minimum */

  const contrast: number = Contrast(white, background);

  return (contrast >= 4.5) ? white : black;
}

function BackgroundSettings(preset: Preset, setPreset: (_: Preset) => void) {
  const [color, setColor] = useState(preset.bgColor);
  return (
    <FormControl fullWidth>
      <div className="setting">
        <SketchPicker
          width="91.5%"
          presetColors={PRESET_BG_COLORS}
          color={color}
          onChange={c => { setColor(c.hex) }}
          onChangeComplete={() => { setPreset({ ...preset, bgColor: color, fontColor: OptimumFontColour(color) }) }}
        />
      </div>
    </FormControl>
  );
}

function FontSettings(preset: Preset, setPreset: (_: Preset) => void) {
  function OnCompleteSlider(
    label: string,
    min: number,
    max: number,
    initialValue: number,
    onComplete: (_: number) => void
  ) {
    const [value, setValue] = useState(initialValue);
    return (
      <div className="setting">
        <label>{label}</label>
        <Slider
          min={min}
          max={max}
          step={(max - min) / 100}
          value={value}
          onChange={(_, val) => { setValue(val as number) }}
          onChangeCommitted={() => { onComplete(value) }}
        />
      </div>
    );
  }

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
          <MenuItem value="Verdana">Verdana</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
          <MenuItem value="Tahoma">Tahoma New</MenuItem>
          <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
          <MenuItem value="Gill Sans">Gill Sans</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
        </TextField>
      </div>
      {OnCompleteSlider("Font Size", -5, 20, preset.fontSize, v => { setPreset({ ...preset, fontSize: v }) } )}
      {OnCompleteSlider("Line Spacing", 0, 25, preset.lineSpacing, v => { setPreset({ ...preset, lineSpacing: v }) } )}
      {OnCompleteSlider("Letter Spacing", 0, 12, preset.letterSpacing, v => { setPreset({ ...preset, letterSpacing: v }) } )}
    </FormControl>
  );
}

function SpacingSettings(preset: Preset, setPreset: (_: Preset) => void) {
  return (
    <FormControl>
      <FormLabel>Split with</FormLabel>
      <RadioGroup
        value={preset.punctuationSpace.valueOf()}
        onChange={(_, val) => setPreset({ ...preset, punctuationSpace: val === Spacing.Spaces.valueOf() ? Spacing.Spaces : Spacing.NewLine })}
      >
        <FormControlLabel value={Spacing.Spaces.valueOf()} control={<Radio />} label="Spaces" />
        <FormControlLabel value={Spacing.NewLine.valueOf()} control={<Radio />} label="New line" />
      </RadioGroup>
    </FormControl>
  );
}

function StyleSettings(preset: Preset, setPreset: (p: Preset) => void, expanded: string | false, setExpanded: (e: string | false) => void) {
  function ExpandedSetting(
    label: string,
    changed: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    getExpandedContent: (s: Preset, _: (_: Preset) => void) => JSX.Element
  ) {
    return (
      <div className="accordion">
        <Accordion
          expanded={expanded === label}
          onChange={(_: SyntheticEvent, newExpanded: boolean) => { setExpanded(newExpanded ? label : false) }}
        >
          <AccordionSummary><Typography>{label}</Typography></AccordionSummary>
          <AccordionDetails>{getExpandedContent(preset, setPreset)}</AccordionDetails>
        </Accordion>
        <div className="accordion-overlay">
          <Switch
            onChange={onChange}
            checked={changed}
          />
        </div>
      </div>
    );
  }
  return (
    <div>
      {ExpandedSetting(
        "Background",
        preset.bgChanged,
        event => { setPreset({ ...preset, bgChanged: event.target.checked }) },
        BackgroundSettings
      )}
      {ExpandedSetting(
        "Font",
        preset.fontChanged,
        event => { setPreset({ ...preset, fontChanged: event.target.checked }) },
        FontSettings
      )}
      {ExpandedSetting(
        "Punctuation Splitting",
        preset.punctuationSpacingChanged,
        event => { setPreset({ ...preset, punctuationSpacingChanged: event.target.checked }) },
        SpacingSettings
      )}
    </div>
  );
}

export { BackgroundSettings, FontSettings, StyleSettings };
