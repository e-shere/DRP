import { useState } from "react";
import Switch from "react-switch";

import "./App.css";
import { changeBgColor, changeFont } from "./main";

function Toggle(label: string, onChange: (_: boolean) => void, checked: boolean) {
  const toggleStyle = { checkedIcon: false, uncheckedIcon: false, onColor: "#006ee6", className: "toggle" };
  return (
    <div className="labelled-toggle">
      <label>{label}</label>
      <Switch onChange={onChange} checked={checked} {...toggleStyle} />
    </div>
  );
}

/* Todo: Reset colour and font to previous values */
function App() {
  const [isBgColorChanged, setBgColorToggle] = useState(false);
  const [isFontChanged, setFontToggle] = useState(false);

  return (
    <div className="App">
      <h1>Clarify.</h1>
      {Toggle(
        "Background",
        change => { changeBgColor(change ? "#c1e6dd" : "#ffffff"); setBgColorToggle(change) },
        isBgColorChanged)
      }
      {Toggle(
        "Font",
        change => { changeFont(change ? "Arial" : "Comic Sans"); setFontToggle(change) },
        isFontChanged)
      }
    </div>
  );
}

export default App;
