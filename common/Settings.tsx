import { SyntheticEvent } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import { TextField, MenuItem, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio, Switch, Typography, Slider } from "@mui/material";
import { SketchPicker } from 'react-color';
import { Preset, Spacing } from "./domain";
import { bestFontColor, bestAuxFontColor } from "./colorPicker"

const PRESET_BG_COLORS = [
  "#faf2d9",
  "#fae1d9",
  "#d9e8fa",
];

function StyleSettings(preset: Preset, setPreset: (p: Preset) => void, expanded: string | false, setExpanded: (e: string | false) => void) {
  const SUPPORTED_FONTS = ["Arial", "Verdana",  "Helvetica", "Tahoma", "Trebuchet MS", "Gill Sans", "Courier New"];

  function FontSettings() {
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
            {
              SUPPORTED_FONTS.map(f => <MenuItem value={f} style={{fontFamily: f}}> {f} </MenuItem> )
            }
          </TextField>
        </div>
        {OnCompleteSlider("Font Size", 10, 35, "fontSize")}
        {OnCompleteSlider("Line Spacing", 1, 4, "lineSpacing")}
        {OnCompleteSlider("Letter Spacing", 0, 0.6, "letterSpacing")}
      </FormControl>
    );
  }

  function OnCompleteSlider(
    label: string,
    min: number,
    max: number,
    key: keyof Preset
  ) {
    return (
      <div className="setting">
        <label>{label}</label>
        <Slider
          min={min}
          max={max}
          step={(max - min) / 100}
          value={preset[key] as number}
          onChange={(_, val) => {
            const newPreset = JSON.parse(JSON.stringify(preset));
            newPreset[key] = val as number;
            setPreset(newPreset as Preset);
          }}
        />
      </div>
    );
  }

  function BackgroundSettings() {
    return (
      <FormControl fullWidth>
        <div className="setting">
          <SketchPicker
            width="91.5%"
            presetColors={PRESET_BG_COLORS}
            color={preset.bgColor}
            onChange={color => {
              setPreset({
                ...preset,
                bgColor: color.hex,
                fontColor: bestFontColor(color.hex),
                auxFontColor: bestAuxFontColor(color.hex, bestFontColor(color.hex))
              })
            }}
          />
        </div>
      </FormControl>
    );
  }

  function SpacingSettings() {
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

  function ExpandedSetting(label: string, key: keyof Preset, expandedContent: () => JSX.Element) {
    return (
      <div className="accordion">
        <Accordion
          expanded={expanded === label}
          onChange={(_: SyntheticEvent, newExpanded: boolean) => { setExpanded(newExpanded ? label : false) }}
        >
          <AccordionSummary><Typography>{label}</Typography></AccordionSummary>
          <AccordionDetails>{expandedContent()}</AccordionDetails>
        </Accordion>
        <div className="accordion-overlay">
          <Switch
            onChange={(event) => {
              const newPreset = JSON.parse(JSON.stringify(preset));
              newPreset[key] = event.target.checked;
              setPreset(newPreset as Preset);
            }}
            checked={preset[key] as boolean}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {ExpandedSetting("Background", "bgChanged", BackgroundSettings)}
      {ExpandedSetting("Font", "fontChanged", FontSettings)}
      {ExpandedSetting("Punctuation Splitting", "punctuationSpacingChanged", SpacingSettings)}
    </div>
  );
}

export { StyleSettings };
