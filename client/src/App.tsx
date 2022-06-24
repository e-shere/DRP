import { useState, SyntheticEvent, ChangeEvent, useEffect } from "react";
import Pusher from "pusher-js";

import { addPreset, getAllPresets} from "./styleDB";
import "./App.css";
import { Card, CardContent, CardActionArea, Typography, Grid, Switch, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { DbPreset, Preset, updatePage, DemoSettings } from "./demo-scripts";
import { BackgroundSettings, FontSettings } from "./DemoSettings";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import Style from "./style";
// import { makeStyles } from "@mui/styles";

// this hack is required because env variables are not visible from the frontend
const url = window.location.href;
const STAGING = url.includes("staging");
const PRODUCTION = !url.includes("staging") && !url.includes("localhost");

// TODO: Fetch env vars from the server (they are public so should not be security problem for now)
var PUSHER_KEY = PRODUCTION ? "6dbf0a6609c4bb0901fb" : "f3244147a7aa2248499d";
const PUSHER_CLUSTER = "eu";

const PUSHER_CHANNEL = "clarify";
const SUBMIT_EVENT = "submit";
const ADD_TO_EXTENSION = "addex";

const DEFAULT_PRESET: Preset = {
  label: "default",
  bgChanged: false,
  fontChanged: false,
  punctuationSpacingChanged: false,
  bgColor: "#faf2d9",
  font: "Arial",
  fontSize: 0,
  letterSpacing: 0,
  lineSpacing: 0,
  fontColor: "black",
};

const DEFAULT_SETTINGS: DemoSettings = {
  styleChanged: true,
  preset: DEFAULT_PRESET,
};

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     title: {
//       paddingBottom: 0,
//       fontWeight: 'bolder',
//       fontFamily: 'Roboto, sans-serif',
//     },
//   })
// );

// function styleToDbPreset(style: Style): {
  
// }

// async function getDbPresets(): [DbPreset] {
//   await getAllPresets().then(styles => styles.map(s => { bgColor: s.bgColor, font: s.font}));
//   return [{bgColor: DEFAULT_PRESET.bgColor, font: DEFAULT_PRESET.font}];
// }

function App() {

  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET);
  const [styleChanged, setStyleChanged] = useState<boolean>(true);
  const [dbPresets, setDbPresets] = useState<Style[]>([]);

  // Binding to update styles in real time
  useEffect(() => {
    if (PRODUCTION || STAGING) {
      // subscribe to pusher only in production (to be isolated when runnig locally)
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER })
      pusher.subscribe(PUSHER_CHANNEL).bind(SUBMIT_EVENT, () => getAllPresets().then(setDbPresets))
      return (() => pusher.unsubscribe(PUSHER_CHANNEL))
    } else {
      getAllPresets().then(setDbPresets)
    }
  }, [{bgColor: DEFAULT_PRESET.bgColor, font: DEFAULT_PRESET.font}]);

  function logAndReturn(value: any): any {
    console.log(`logging: ${value}`);
    return value;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1> About </h1>
          <h2> Making the web more accessible by allowing customisation of graphics aspects. </h2>
        </div>
      </header>
      {Demo(preset, setPreset, styleChanged, setStyleChanged)}
      <div className="popular-cards-header">
        <h2>Popular Designs</h2>
        <div className="popular-cards">
          {/* onClick on the card, update the dbPreset variable, this will re-render this component */}
          {/* <div className="card">{BgCard("orange", "Roboto", preset, setPreset)}</div>
          <div className="card">{BgCard("yellow", "New Times Roman", preset, setPreset)}</div>
          <div className="card">{BgCard("green", "Sans Serif", preset, setPreset)}</div>
          <div className="card">{BgCard("red", "Arial", preset, setPreset)}</div>
          <div className="card">{BgCard("green", "Sans Serif", preset, setPreset)}</div>
          <div className="card">{BgCard("red", "Arial", preset, setPreset)}</div>
          <div className="card">{BgCard("red", "Arial", preset, setPreset)}</div>
          <div className="card">{BgCard("red", "Arial", preset, setPreset)}</div> */}
          {logAndReturn(dbPresets.map(style => {
            return (<div className="card">{BgCard(style.bgColor, style.font, preset, setPreset)}</div>);
          }))}
        </div>
      </div>
    </div>
  );
  
}

function DemoPage(preset: Preset, styleChanged: boolean) {
  
  return (<p> {JSON.stringify({preset: preset, styleChanged: styleChanged}).replaceAll(",", ", ")} </p>)
  // return (
    
  //   <div className="demo-page">
  //     <h1> This is a demo. Try out the features! </h1>
  //     <div className="demo-labelled-img">
  //       <p className="demo-lorem"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
  //       <img src="clarify-logo.png" />
  //     </div>
  //     <div className="demo-list-link">
  //       <div className="demo-list">
  //         <p>Here is a list: </p>
  //         <ul>
  //           <li>I have</li>
  //           <li>Got to be</li>
  //           <li>Honest</li>
  //         </ul>
  //       </div>
  //       <div className="demo-link">
  //         <p>Here is a link: </p>
  //         <a href="https://www.imperial.ac.uk/">www.imperial.ac.uk</a>
  //       </div>
  //     </div>
  //   </div>
  // );
}

function Demo(preset: Preset, setPreset: (_: Preset) => void, styleChanged: boolean, setStyleChanged: (_: boolean) => void) {
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
    <div className="demo-header">
      <h2>Demo</h2>
      <div className="demo">
        <div className="demo-menu">
          <div className="demo-toggle">
            <ToggleButtonGroup
              value={styleChanged ? "clarify" : "original"}
              exclusive
              onChange={(_, x) => setStyleChanged(x === "clarify")}
            >
              <ToggleButton value="original">Original</ToggleButton>
              <ToggleButton value="clarify">Clarify</ToggleButton>
            </ToggleButtonGroup>
          </div>
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
        {DemoPage(preset, styleChanged)}
      </div>
    </div>
  );
}

function BgCard(bgColor: string, font: string, preset: Preset, setPreset: (_: Preset) => void) {
  return (
    <Card>
      <CardActionArea style={{ backgroundColor: bgColor }} onClick={(e) => setPreset({...preset, bgColor: bgColor, font: font})}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" >
            Recommended by x users
            {/* recommend this background color and font */}
          </Typography>
          <Typography variant="body1" style={{ fontFamily: font }}> {/*color="text.secondary"*/}
            Font: {font}<br></br>
            Do you fancy this font and background color? Click me!
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// function Form() {
//   const [font, setFont] = useState("Open Sans");
//   const [fontSize, setFontSize] = useState(12);
//   const [bgColor, setBgColor] = useState("#FFFFFF");

//   function handleSubmit(event: FormEvent) {
//     event.preventDefault(); // Stop page refresh
//     const style = new Style(font, fontSize, bgColor);

//     // Pusher submit event 
//     axios.post(`/${SUBMIT_EVENT}`, style);

//     // Update db
//     addPreset(style);
//   }

//   return (
//     <div> 
//       <p>Nothing to display... </p>
//     </div>      
//   );
// }

/*
<form className="preset-form" onSubmit={handleSubmit}>
      <label  >Font</label>
      <select value={font} onChange={event => setFont(event.target.value)}>
        <option value="Open Sans">Open Sans</option>
        <option value="Comic Sans">Comic Sans</option>
        <option value="Roboto">Roboto</option>
      </select>
      <label>Font Size</label>
      <input
        type="number"
        width={"50%"}
        value={fontSize}
        onChange={event => setFontSize(Number(event.target.value))} placeholder="font size"
      />
      <label>Background Colour</label>
      <input
        type="color"
        value={bgColor}
        onChange={event => setBgColor(event.target.value)}
      />
      <input type="submit" value="SAVE STYLE TO YOUR PRESETS" style={{width:500, height: 50, fontSize: 20, font: "Courier New (monospace)"}}/>  
      {/* <div> {[
      <Button className="style-submission" variant="contained" onClick={handleSubmit}
       style={{width:500, height: 50, fontSize: 20, font: "Courier New (monospace)"}}>
        Save style to your presets</Button>]}
        </div> * /}
        </form>  
*/

export default App;
