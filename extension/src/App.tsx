import { ChangeEvent } from 'react';
import Switch from '@mui/material/Switch';

import "./App.css";
import { changeBgColor, changeFont } from "./main";

function Toggle(label: string, onChange: (checked: ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div className="labelled-toggle">
      <label>{label}</label>
      <Switch onChange={onChange} />
    </div>
  );
}

/* Todo: Reset colour and font to previous values */
function App() {
  return (
    <div className="App">
      <h1>Clarify.</h1>
      {Toggle("Background", event => { changeBgColor(event.target.checked ? "#c1e6dd" : "#ffffff") })}
      {Toggle("Font", event => { changeFont(event.target.checked ? "Arial" : "Comic Sans") })}
    </div>
  );
}

export default App;
