import { Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { TITLE, UserSettings } from "./App";

function Settings(settings: UserSettings, setSettings: (_: UserSettings) => void, setPage: (_: string) => void) {
  return (
    <div className="Settings">
      <header>
        <Button
          className="nav-button"
          onClick={() => setPage("main")}
          startIcon={<ArrowBackIosNewIcon />}
        />
        <h1>{TITLE}</h1>
      </header>
      <FormControl fullWidth>
        <InputLabel>Font</InputLabel>
        <Select
          className="form-field"
          label="Font"
          value={settings.font}
          onChange={event => { setSettings({ ...settings, font: event.target.value }) }}
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Brush Script MT">Brush Script MT</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
        </Select>
        <div className="labelled-item">
          <label>Background</label>
          <input
            className="bg-color-input"
            type="color"
            value={settings.bgColor}
            onChange={event => { setSettings({ ...settings, bgColor: event.target.value }) }}
          />
        </div>
      </FormControl>
    </div>
  );
}

export default Settings;
