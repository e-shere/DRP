import { ChangeEvent, SyntheticEvent } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import { TextField, MenuItem, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio, Switch, Typography } from "@mui/material";
import { SketchPicker } from 'react-color';
import { Preset, Spacing } from "./domain";
import {bestFontColor, bestAuxFontColor} from "./colorPicker"

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
          onChange={color => { setPreset({ ...preset, bgColor: color.hex, fontColor: bestFontColor(color.hex), auxFontColor: bestAuxFontColor(color.hex, bestFontColor(color.hex)) }) }}
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

function SpacingSettings(preset: Preset, setPreset: (_: Preset) => void) {
  return (
    <FormControl>
      <FormLabel>Split with</FormLabel>
      <RadioGroup
        value={preset.punctuationSpace.valueOf()}
        onChange={(_, val) => setPreset({...preset, punctuationSpace: val === Spacing.Spaces.valueOf() ? Spacing.Spaces : Spacing.NewLine})}
      >
        <FormControlLabel value={Spacing.Spaces.valueOf()} control={<Radio />} label="spaces" />
        <FormControlLabel value={Spacing.NewLine.valueOf()} control={<Radio />} label="new line" />
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
