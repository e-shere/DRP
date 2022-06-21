import { ChangeEvent, useState } from "react";
import axios from "axios";
import { Switch } from "@mui/material";
import {Accordion, AccordionSummary, AccordionDetails} from "./Accordion"
import Typography from '@mui/material/Typography';

import { TITLE, UserSettings } from "./App";
import { BackgroundSettings, FontSettings } from "./Settings"

const TITLE_URL = "claraify";
const HEROKU_URL = `https://${TITLE_URL}.herokuapp.com/`;
const LOCAL_HOSE = `http://localhost:3000/`
const HEROKU_STAGING = `https://${TITLE_URL}-staging.herokuapp.com/`

function LabelledSwitch(label: string, isOn: boolean, enabled: boolean, onChange: (_: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-item">
      <label>{label}</label>
      <Switch onChange={onChange} checked={isOn} disabled={!enabled} />
    </div>
  );
}

async function lookupStyle() {
  const res = axios.get(`${HEROKU_STAGING}serve-styles`);
  res.then(res => res.data).then(res => { return res.json().map(JSON.parse) });
}

function Main(settings: UserSettings, setSettings: (_: UserSettings) => void) {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange =
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
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Background</Typography>
        </AccordionSummary>
        <AccordionDetails>
            { BackgroundSettings(settings, setSettings) }
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Font</Typography>
        </AccordionSummary>
        <AccordionDetails>
            { FontSettings(settings, setSettings) }
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Main;