import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import { TextField, MenuItem, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio, Switch, Typography, InputLabel, Slider } from "@mui/material";
import { SketchPicker } from 'react-color';
import { Preset, Spacing } from "./domain";
import { bestFontColor, bestAuxFontColor } from "./colorPicker"

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

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
          <MenuItem value="Verdana">Verdana</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
          <MenuItem value="Tahoma">Tahoma New</MenuItem>
          <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
          <MenuItem value="Gill Sans">Gill Sans</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
        </TextField>
      </div>
      {OnCompleteSlider("Font Size", -5, 20, preset.fontSize, v => { setPreset({ ...preset, fontSize: v }) })}
      {OnCompleteSlider("Line Spacing", 0, 25, preset.lineSpacing, v => { setPreset({ ...preset, lineSpacing: v }) })}
      {OnCompleteSlider("Letter Spacing", 0, 12, preset.letterSpacing, v => { setPreset({ ...preset, letterSpacing: v }) })}
    </FormControl>
  );
}

function OnCompleteSlider(
  label: string,
  min: number,
  max: number,
  initialValue: number,
  onComplete: (_: number) => void
) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { setValue(initialValue) }, [initialValue]);
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

function BackgroundSettings(preset: Preset, setPreset: (_: Preset) => void) {
  const [color, setColor] = useState(preset.bgColor);
  useEffect(() => { setColor(preset.bgColor) }, [preset.bgColor]);
  return (
    <FormControl fullWidth>
      <div className="setting">
        <SketchPicker
          width="91.5%"
          presetColors={PRESET_BG_COLORS}
          color={color}
          onChange={c => { setColor(c.hex) }}
          onChangeComplete={() => {
            setPreset({
              ...preset, bgColor: color, fontColor: bestFontColor(color), auxFontColor: bestAuxFontColor(color, bestFontColor(color))
            })
          }}
        />
      </div>
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

export { StyleSettings };
