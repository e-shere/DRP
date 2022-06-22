import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Switch } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "./Accordion"
import Typography from '@mui/material/Typography';

import { TITLE, UserSettings } from "./App";
import { BackgroundSettings, FontSettings } from "./Settings"
import "./App.css";

function Main(settings: UserSettings, setSettings: (_: UserSettings) => void) {
  const [expanded, setExpanded] = useState<string | false>(false);

  function ExpanedSetting(
    label: string,
    changed: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    getExpandedContent: (s: UserSettings, _: (_: UserSettings) => void) => JSX.Element
  ) {
    return (
      <div className="accordion-element">
        <Accordion
          expanded={expanded === label}
          onChange={(_: SyntheticEvent, newExpanded: boolean) => { setExpanded(newExpanded ? label : false) }}
          disabled={!settings.styleChanged}
        >
          <AccordionSummary aria-controls={`${label}d-content`} id={`${label}d-header`}>
            <Typography>{label}</Typography>
          </AccordionSummary>
          <AccordionDetails>{getExpandedContent(settings, setSettings)}</AccordionDetails>
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
    <div className="Main">
      <header>
        <div className="header-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        <div className="header-button">
          <Switch
            onChange={event => {
              setSettings({ ...settings, styleChanged: event.target.checked });
              setExpanded(false)
            }}
            checked={settings.styleChanged}
          />
        </div>
      </header>
      {ExpanedSetting(
        "Background",
        settings.bgChanged,
        event => { setSettings({ ...settings, bgChanged: event.target.checked }) },
        BackgroundSettings
      )}
      {ExpanedSetting(
        "Font",
        settings.fontChanged,
        event => { setSettings({ ...settings, fontChanged: event.target.checked }) },
        FontSettings
      )}
      {ExpanedSetting(
        "Punctuation Splitting",
        settings.punctuationSpacingChanged,
        event => { setSettings({ ...settings, punctuationSpacingChanged: event.target.checked }) },
        (settings, setSetting) => { return (<div></div>) }
      )}
    </div>
  );
}

export default Main;