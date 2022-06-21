import { ChangeEvent, useState } from "react";
import { Switch } from "@mui/material";
import {Accordion, AccordionSummary, AccordionDetails} from "./Accordion"
import Typography from '@mui/material/Typography';

import { TITLE, UserSettings } from "./App";
import { BackgroundSettings, FontSettings } from "./Settings"
import "./App.css";

const TITLE_URL = "claraify";
const HEROKU_URL = `https://${TITLE_URL}.herokuapp.com/`;
const LOCAL_HOST = `http://localhost:3000/`
const HEROKU_STAGING = `https://${TITLE_URL}-staging.herokuapp.com/`

function SettingSwitch(isOn: boolean, enabled: boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
        <Switch onChange={onChange} checked={isOn} disabled={!enabled} />
  );
}

function Main(settings: UserSettings, setSettings: (_: UserSettings) => void) {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const toggleAccordion =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div className="Main">
      <header>
        <div className="header-button">{/* hacky empty div for scaling */}</div>
        <h1>{TITLE}</h1>
        <div className="header-button">
          <Switch
            onChange={event => setSettings({ ...settings, styleChanged: event.target.checked })}
            checked={settings.styleChanged}
          />
        </div>
      </header>
      <div className="accordion-element">  
      <Accordion 
        expanded={expanded === 'panel1'} 
        onChange={toggleAccordion('panel1')}
        disabled={!settings.styleChanged}
        >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Background</Typography>
        </AccordionSummary>
        <AccordionDetails>
            { BackgroundSettings(settings, setSettings) }
        </AccordionDetails>
      </Accordion>
      <div className="accordion-overlay">
      {SettingSwitch(
          settings.bgChanged,
          settings.styleChanged,
          event => { setSettings({ ...settings, bgChanged: event.target.checked }) }
          )}
      </div>
      </div>
      <div className="accordion-element">    
      <Accordion 
        expanded={expanded === 'panel2'} 
        onChange={toggleAccordion('panel2')}
        disabled={!settings.styleChanged}
        >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Font</Typography>
        </AccordionSummary>
        <AccordionDetails>
            { FontSettings(settings, setSettings) }
        </AccordionDetails>
      </Accordion>
      <div className="accordion-overlay">
      {SettingSwitch(
          settings.fontChanged,
          settings.styleChanged,
          event => { setSettings({ ...settings, fontChanged: event.target.checked }) }
          )}
      </div>   
      </div> 
    </div>
  );
}

export default Main;