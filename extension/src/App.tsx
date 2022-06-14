import { useState } from "react";
import Main from "./Main"
import Settings from "./Settings"

import "./App.css";

export const TITLE = "Claraify.";

function App() {
  /* Todo: move this state into the settings component? */
  const [page, setPage] = useState("main");
  const [bgColor, setBgColor] = useState("");
  const [font, setFont] = useState("");
  const [bgChanged, setBgChanged] = useState(false);
  const [fontChanged, setFontChanged] = useState(false);

  function selectPage(page: string) {
    switch (page) {
      case "settings":
        return Settings({setPage, bgChanged, fontChanged, bgColor, setBgColor, font, setFont});
      default:
        return Main({setPage, bgChanged, fontChanged, setBgChanged, setFontChanged });
    }
  }

  return (
    <div className="App">
      {selectPage(page)}
    </div>
  )
}

export default App;
