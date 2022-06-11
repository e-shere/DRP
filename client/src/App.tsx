import React, { FormEvent, useState } from 'react';
import './App.css';

class Style {
  font: string;
  fontSize: number;
  bgColor: string;

  constructor(font: string, fontSize: number, bgColor: string) {
    this.font = font;
    this.fontSize = fontSize;
    this.bgColor = bgColor;
  }
}

function App() {
  const [style, setStyles] = React.useState(new Style("Open Sans", 12, "white"));

  React.useEffect(() => {
    fetch("/getall")
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        setStyles(JSON.parse(data));
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Form()}
        </div>
        <div className="Style-table">
          {Styles(style)}
        </div>
        {/* Not sure what to put here */}
      </header>
    </div>
  );
}

function Styles(style: Style) {
  return (
    <table>
      {(style == null)
        ? []
        : [<tr><td>{style.font}</td><td>{style.fontSize}</td><td>{style.bgColor}</td></tr>]}
    </table>
  );
}

function Form() {
  const [font, setFont] = useState("Open Sans");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(12);

  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Stop page refresh

    fetch("/set", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ data: new Style(font, fontSize, bgColor), }),
    })
      .then(res => res.json())
      .catch(() => console.log("Error when posting style"))
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
