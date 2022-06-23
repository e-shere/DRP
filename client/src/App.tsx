import { useState, useEffect, SyntheticEvent, ChangeEvent } from "react";
import Pusher from "pusher-js";
import { getAllPresets } from "./styleDB";
import Style from "./style";
import "./App.css";
import { Card, CardContent, CardActionArea, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Switch } from "@mui/material";
import { DbPreset, Preset, updatePage, UserSettings } from "./demo-scripts";
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

export const DEMO_DIV_ID = "demo-div-wrapper";
const DEFAULT_SETTINGS: UserSettings = {
  styleChanged: true,
  presets: [],
};
const DEFAULT_PRESET: Preset = {
  label: "default",
  bgChanged: true,
  fontChanged: true,
  punctuationSpacingChanged: true,
  bgColor: "#faf2d9",
  font: "Arial",
  fontSize: 2,
  letterSpacing: 2,
  lineSpacing: 3,
  fontColor: "black",
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

function App() {
  const [dbPreset, setDbPreset] = useState<DbPreset>({bgColor: 'white', font: 'Arial'});

  // Binding to update styles in real time
  // useEffect(() => {
  //   if (PRODUCTION || STAGING) {
  //     // subscribe to pusher only in production (to be isolated when runnig locally)
  //     const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER })
  //     pusher.subscribe(PUSHER_CHANNEL).bind(SUBMIT_EVENT, () => getAllPresets().then(setStyles))
  //     return (() => pusher.unsubscribe(PUSHER_CHANNEL))
  //   }
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1> About </h1>
          <p> This extension helps to make the web more accessible to everyone, allowing customisation of graphics aspects. </p>
        </div>
      </header>
      <div className="popular-cards">
        <div className="card">{BgCard("orange", "Roboto")}</div>
        <div className="card">{BgCard("yellow", "New Times Roman")}</div>
        <div className="card">{BgCard("green", "Sans Serif")}</div>
        <div className="card">{BgCard("red", "Arial")}</div>
      </div>
      {Demo(dbPreset)}
      <button onClick={e => { updatePage(DEFAULT_SETTINGS, DEFAULT_PRESET) }}>Apply current settings</button>
    </div>
  );
}

function Demo(dbPreset: DbPreset) {

  return (
    <div id={DEMO_DIV_ID}>
      <div className="demo-menu-div">
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
      <div className="demo-display-div" style={{backgroundColor:'red'}}>
        <p> demo here. This is a demo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
      </div>
    </div>
  );
}

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


function BgCard(bgColor: string, font: string) {
  // const classes = useStyles();
  return (
    <Card> {/* style={{padding: '16px'}} */}
      <CardActionArea style={{ backgroundColor: bgColor }}>
        {/* <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        /> */}
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
