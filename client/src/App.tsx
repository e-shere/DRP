import { FormEvent, useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { getDbStyle, setDbStyle, getAllStyles } from "./styleDB";
import Style from "./style";
import "./App.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// this hack is required because env variables are not visible from the frontend
const url = window.location.href;
const STAGING = url.includes("staging");
const PRODUCTION = !url.includes("staging") && !url.includes("localhost");

// TODO: Fetch env vars from the server (they are public so should not be security problem for now)
var PUSHER_KEY = PRODUCTION ? "92e02b3a0a7919063500" : "d99fd8c0f4faeacc4709";
const PUSHER_CLUSTER = "eu";

const PUSHER_CHANNEL = "claraify";
const SUBMIT_EVENT = "submit";

function App() {
  const [styles, setStyles] = useState<Style[]>([]);

  // Binding to update styles in real time
  useEffect(() => {
    if (PRODUCTION || STAGING) {
      // subscribe to pusher only in production (to be isolated when runnig locally)
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER })
      pusher.subscribe(PUSHER_CHANNEL).bind(SUBMIT_EVENT, () => getAllStyles().then(setStyles))
      return (() => pusher.unsubscribe(PUSHER_CHANNEL))
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Form()}
        </div>
        <div className="Style-table">
          {BasicTable(styles.map(style => ({entry: 1, style})))}
        </div>
      </header>
    </div>
  );
}

interface TableRow {
  entry: number,
  style: Style
}

function BasicTable(rows: TableRow[]) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
          <TableRow>
            <TableCell>Entry</TableCell>
            <TableCell align="right">Font</TableCell>
            <TableCell align="right">Background Colour</TableCell>
            <TableCell align="right">Font Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.entry}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.entry}
              </TableCell>
              <TableCell align="right">{row.style.font}</TableCell>
              <TableCell align="right">{row.style.bgColor}</TableCell>
              <TableCell align="right">{row.style.fontSize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Styles(styles: Promise<Style[]>) {
  // var rows: Style[] = []
  // getAllStyles().then(styles => {rows = styles});
  // rows.forEach()

  // return (
  //   <table>
  //     {(style == null)
  //       ? []
  //       : [<tr><td>{style.font}</td><td>{style.fontSize}</td><td>{style.bgColor}</td></tr>]}
  //   </table>
  // );
}

function Form() {
  const [font, setFont] = useState("Open Sans");
  const [fontSize, setFontSize] = useState(12);
  const [bgColor, setBgColor] = useState("#FFFFFF");

  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Stop page refresh
    const style = new Style(font, fontSize, bgColor);

    // Pusher submit event 
    axios.post(`/${SUBMIT_EVENT}`, style);

    // Update db
    setDbStyle(style);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Font</label>
      <select value={font} onChange={event => setFont(event.target.value)}>
        <option value="Open Sans">Open Sans</option>
        <option value="Comic Sans">Comic Sans</option>
        <option value="Roboto">Roboto</option>
      </select>
      <label>Font Size</label>
      <input
        type="number"
        value={fontSize}
        onChange={event => setFontSize(Number(event.target.value))} placeholder="font size"
      />
      <label>Background Colour</label>
      <input
        type="color"
        value={bgColor}
        onChange={event => setBgColor(event.target.value)}
      />
      <input type="submit" value="Submit" />
   
    </form>

    
  );
}

export default App;
