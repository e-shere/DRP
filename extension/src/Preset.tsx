import { useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, Grid, TextField } from "@mui/material";

import { Preset, UserSettings } from "./App";

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
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Presets(settings: UserSettings, setSettings: (_: UserSettings) => void, setPreset: (_: Preset) => void) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  function PresetButton(preset: Preset, i: number) {
    return (
      <Button
        style={{ fontSize: "0.9em" }}
        onClick={() => setPreset(preset)}
        className="preset-button"
      >
        {preset.label}
        <IconButton size="small" onClick={() => { setDeleteOpen(true) }}>
          <DeleteIcon />
        </IconButton>
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogContent>
            Are you sure you want to delete preset: <b>"{settings.presets[i].label}"</b> ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>No</Button>
            <Button onClick={() => {
              setSettings({ ...settings, presets: settings.presets.filter((_, j) => j != i) });
              setDeleteOpen(false);
            }}>
              Yes!
            </Button>
          </DialogActions>
        </Dialog>
      </Button>
    );
  }

  if (settings.presets.length != 0) {
    return (
      <div className="Presets">
        <h2>Your Presets</h2>
        <ButtonGroup fullWidth variant="outlined">
          {settings.presets.map((p, i) => PresetButton(p, i))}
        </ButtonGroup>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

export { Presets, SavePresetButton };