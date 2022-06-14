import { Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { TITLE } from "./App";
import { changeBgColor, changeFont } from "./storage";

function Settings(state: any) {
  chrome.storage.sync.get("bgColor", ({ bgColor }) => { state.setBgColor(bgColor) })
  chrome.storage.sync.get("font", ({ font }) => { state.setFont(font) })

  return (
    <div className="Settings">
      <header>
        <Button
          className="nav-button"
          onClick={() => state.setPage("main")}
          startIcon={<ArrowBackIosNewIcon />}
        />
        <h1>{TITLE}</h1>
      </header>
      <FormControl fullWidth>
        <InputLabel>Font</InputLabel>
        <Select
          className="form-field"
          label="Font"
          value={state.font}
          onChange={event => {
            const font = event.target.value;
            state.setFont(event.target.value);
            chrome.storage.sync.set({ font });
            if (state.fontChanged) {
              changeFont(event.target.value);
            }
          }}
        >
          <MenuItem value="Comic Sans">Comic Sans</MenuItem>
          <MenuItem value="Arial">Arial</MenuItem>
        </Select>
        <div className="labelled-item">
          <label>Background</label>
          <input
            className="bg-color-input"
            type="color"
            value={state.bgColor}
            onChange={event => {
              const bgColor = event.target.value;
              state.setBgColor(bgColor);
              chrome.storage.sync.set({ bgColor });
              if (state.bgChanged) {
                changeBgColor(bgColor);
              }
            }}
          />
        </div>
      </FormControl>
    </div>
  );
}

export default Settings;
