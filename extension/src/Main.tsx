import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Switch } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "./Accordion";
import Typography from '@mui/material/Typography';

import { TITLE, Preset, UserSettings } from "./App";
import { SavePresetButton } from "./Preset";
import { BackgroundSettings, FontSettings } from "./Settings"
import "./App.css";

function Main(settings: UserSettings, preset: Preset, setSettings: (_: UserSettings) => void, setPreset: (_: Preset) => void) {
  const [expanded, setExpanded] = useState<string | false>(false);

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
          disabled={!settings.styleChanged}
        >
          <AccordionSummary><Typography>{label}</Typography></AccordionSummary>
          <AccordionDetails>{getExpandedContent(preset, setPreset)}</AccordionDetails>
        </Accordion>
        <div className="accordion-overlay">
          <Switch
            onChange={onChange}
            checked={changed}
            disabled={!settings.styleChanged}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: settings.presets.length == 0 ? "100%" : "77%" }} className="Main">
      <header>
        <div className="header-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        <div className="header-button">
          <Switch
            onChange={event => {
              setSettings({ ...settings, styleChanged: event.target.checked });
              setExpanded(false);
            }}
            checked={settings.styleChanged}
          />
        </div>
      </header>
      {SavePresetButton(settings, preset, setSettings)}
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
        (preset, setPreset) => { return (<div></div>) }
      )}
    </div>
  );
}

export default Main;