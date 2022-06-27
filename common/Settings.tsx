import { SyntheticEvent, useEffect, useState } from "react";
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
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
            <MenuItem value="Helvetica">Helvetica</MenuItem>
            <MenuItem value="Tahoma">Tahoma New</MenuItem>
            <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
            <MenuItem value="Gill Sans">Gill Sans</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </TextField>
        </div>
        {OnCompleteSlider("Font Size", -5, 20, "fontSize")}
        {OnCompleteSlider("Line Spacing", 0, 25, "lineSpacing")}
        {OnCompleteSlider("Letter Spacing", 0, 12, "letterSpacing")}
      </FormControl>
    );
  }

  function OnCompleteSlider(
    label: string,
    min: number,
    max: number,
    key: keyof Preset
  ) {
    /* Casting is ok assuming key is of a numeric preset field */
    const [value, setValue] = useState<number>(preset[key] as number);
    useEffect(() => { setValue(preset[key] as number) }, [preset[key]]);
    return (
      <div className="setting">
        <label>{label}</label>
        <Slider
          min={min}
          max={max}
          step={(max - min) / 100}
          value={value}
          onChange={(_, val) => { setValue(val as number) }}
          onChangeCommitted={() => {
            const newPreset = JSON.parse(JSON.stringify(preset));
            newPreset[key] = value;
            setPreset(newPreset as Preset);
          }}
        />
      </div>
    );
  }

  function BackgroundSettings() {
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
