/*
import React from "react";
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/all")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
*/

import React from 'react';
import { useState } from 'react';
import './App.css';

class Style {
  constructor(font, fontSize, bgColor) {
    this.font = font;
    this.fontSize = fontSize;
    this.bgColor = bgColor;
  }
}

function App() {
  const testRows = [new Style("Open Sans", 20, "orange"), new Style("Arial", 2, "green")]

  const [styles, setStyles] = React.useState(null);

  React.useEffect(() => {
    fetch("/getall")
      .then((res) => res.json())
      .then((data) => { console.log(JSON.stringify(data)); setStyles(JSON.parse(data)); });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>{Form()}</div>
        <div>{Styles(styles)}</div>
      </header>
    </div>
  );
}

function Styles(style) {
  const rows = [];
  if (style == null) return []
  else return [(<tr>
  <td>{"Font: " + style.font + ", font size: " + style.fontSize + ", background color: " + style.bgColor}</td>
</tr>)];
}

function Form() {
  const [font, setFont] = useState("Open Sans");
  const [bgColor, setBgColor] = useState("white");
  const [fontSize, setFontSize] = useState(12);

  const handleSubmit = event => {
    event.preventDefault(); // Stop page refresh
    // alert("Style: " + font + ", " + fontSize + ", " + bgColor);

    alert(JSON.stringify(new Style(font, fontSize, bgColor)));
    
    /*
    fetch('http://localhost:3000/game', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setFormData('')
      })
      .catch((err) => console.log('error'))
    */


    setFont("");
    setFontSize("");
    setBgColor("");

    
    // ["{\"font\":\"io\",\"fontSize\":1,\"bgColor\":\"green\"}", "{\"font\":\"demoStyle\",\"fontSize\":12,\"bgColor\":\"red\"}"]
    // React.useEffect(() => {
    //   fetch("/getall")
    //     .then((res) => res.json())
    //     .then((data) => setData([]));
    // }, []);
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={font} name="font" onChange={event => setFont(event.target.value)}>
        <option value="Open Sans">Open Sans</option>
        <option value="Comic Sans">Comic Sans</option>
        <option value="Roboto">Roboto</option>
      </select>
      <input type="number" value={fontSize} name="font_size" onChange={event => setFontSize(event.target.value)} placeholder="font size" />
      <input type="text" value={bgColor} name="bgColor" onChange={event => setBgColor(event.target.value)} />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
