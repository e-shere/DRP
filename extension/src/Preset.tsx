import { useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

import { Preset, UserSettings } from "./App";
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";

function SavePresetButton(settings: UserSettings, preset: Preset, setSettings: (_: UserSettings) => void) {
  const [labelOpen, setLabelOpen] = useState(false);
  const [label, setLabel] = useState("preset");

  return (
    <div>
      <Button
        variant="text"
        className="save-preset-button"
        onClick={() => { setLabel("preset"); setLabelOpen(true) }}
      >
        Save Preset
      </Button>
      <Dialog open={labelOpen} onClose={() => setLabelOpen(false)}>
        <DialogContent>
          <TextField
            autoFocus
            placeholder={label}
            inputProps={{ maxLength: 7 }}
            label="Preset Name"
            fullWidth
            onChange={event => { setLabel(event.target.value) }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setLabelOpen(false);
            if (settings.presets.length < 3) {
              const newPreset = { ...preset, label };
              setSettings({ ...settings, presets: settings.presets.concat(newPreset) })
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Presets(presets: Preset[], setPreset: (_: Preset) => void) {
  function PresetButton(preset: Preset) {
    return (
      <Button onClick={() => setPreset(preset)} className="preset-button">
        {preset.label}
      </Button>
    );
  }

  return (
    <div className="Presets">
      <ButtonGroup variant="outlined">{presets.map(PresetButton)}</ButtonGroup>
    </div>
  );
}

export { Presets, SavePresetButton };