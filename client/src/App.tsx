import React, { FormEvent, useState } from 'react';
import './App.css';

class Style {
  font: string
  fontSize: number
  bgColor: string

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
      .then((data) => { console.log(JSON.stringify(data)); setStyles(JSON.parse(data)); });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Form()}
        </div>
        <div className="style-table">
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

  const handleSubmit: (event: FormEvent) => void = event => {
    event.preventDefault(); // Stop page refresh
    const style = new Style(font, fontSize, bgColor);

    fetch("/set", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: style,
      }),
    })
      .then((res) => res.json())
      .then(() => { alert("The db has been updated with 'Style(" + font + ", " + fontSize + ", " + bgColor + ")'") })
      .catch(() => console.log('error'))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Font</label>
      <select value={font} name="font" onChange={event => setFont(event.target.value)}>
        <option value="Open Sans">Open Sans</option>
        <option value="Comic Sans">Comic Sans</option>
        <option value="Roboto">Roboto</option>
      </select>
      <label>Font Size</label>
      <input type="number" value={fontSize} name="fontSize" onChange={event => setFontSize(Number(event.target.value))} placeholder="font size" />
      <label>Background Colour</label>
      <input type="color" value={bgColor} name="bgColor" onChange={event => setBgColor(event.target.value)} />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
