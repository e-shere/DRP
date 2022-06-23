import { FormEvent, useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { addPreset, getAllPresets} from "./styleDB";
import Style from "./style";
import "./App.css";
import Button from '@mui/material/Button';
import DataTable from "./preset-selection";
import { triggerMessageToExtension } from "./scripts";
import { Card, Dialog, CardContent, CardActionArea, CardMedia, Typography, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import React from "react";
import { Preset, updatePage, UserSettings } from "./demo";
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

function App() {
  const [styles, setStyles] = useState<Style[]>([]);

  // Binding to update styles in real time
  useEffect(() => {
    if (PRODUCTION || STAGING) {
      // subscribe to pusher only in production (to be isolated when runnig locally)
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER })
      pusher.subscribe(PUSHER_CHANNEL).bind(SUBMIT_EVENT, () => getAllPresets().then(setStyles))
      return (() => pusher.unsubscribe(PUSHER_CHANNEL))
    }
  }, []);

  // useEffect(() => {getAllPresets().then(setStyles)}, []);

  // <Grid item> <Grid/> creates a grid cell
  // arguments of grid item: 
  // - xs = how many sections the cell will occupy (there are 12 sections by default)
  // - sm = the number of sections occupied by the cell, when there are enough cells to fill the row

  // <Grid container> <Grid /> creates a grid that can contain grid items
  // arguments of grid:
  // - spacing: e.g. spacing={x} means that there will be roughly 4*x pixels of distance between the cards 

  return (
    <div className="App">
      <header className="App-header">
        <Grid container>
          <Grid item xs={12} container>
            <div>
              <h1> About </h1>
              <p> This extension helps to make the web more accessible to everyone, allowing customisation of graphics aspects. </p>
            </div>
          </Grid>
          <Grid container justifyItems={'center'}>
            <GridOfCards />
          </Grid>
          <Grid>
            <div id={DEMO_DIV_ID}>
              <div style={{backgroundColor:'red'}}>
                <p> demo here. This is a demo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
              </div>
            </div>
            <button onClick={e => { updatePage(DEFAULT_SETTINGS, DEFAULT_PRESET) }}>Apply current settings</button>
          </Grid>
        </Grid>
          {/*DataTable(styles)*/}
      </header>
    </div>
  );
}

function GridOfCards() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={4} sm={6}>
        <MyCard />
      </Grid>
      <Grid item xs={4} sm={6}>
        <MyCard />
      </Grid>
      <Grid item xs={4} sm={6}>
        <MyCard />
      </Grid>
      <Grid item xs={4} sm={6}>
        <MyCard />
      </Grid>
    </Grid>
  );
}

function MyCard() {
  return (
    <Card>
    <CardActionArea>
      <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
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


// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   minWidth: 200,
// }));

// function FormRow() {
//   return (
//     <React.Fragment>
//       <Grid item xs={4}>
//         <Item>Item</Item>
//       </Grid>
//       <Grid item xs={4}>
//         <Item>Item</Item>
//       </Grid>
//       <Grid item xs={4}>
//         <Item>Item</Item>
//       </Grid>
//     </React.Fragment>
//   );
// }

// function NestedGrid() {
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <Grid container spacing={1}>
//         <Grid container item spacing={3}>
//           <FormRow />
//         </Grid>
//         <Grid container item spacing={3}>
//           <FormRow />
//         </Grid>
//         <Grid container item spacing={3}>
//           <FormRow />
//         </Grid>
//       </Grid>
//     </Box>
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
