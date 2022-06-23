import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  TextField,
} from "@mui/material";

import { Preset, UserSettings } from "./App";

function SavePresetButton(settings: UserSettings, preset: Preset, setSettings: (_: UserSettings) => void) {
  const [labelOpen, setLabelOpen] = useState(false);
  const [label, setLabel] = useState("preset");
  const [limitAlertOpen, setLimitAlertOpen] = useState(false);

  return (
    <div>
      <Button
        variant="text"
        className="save-preset-button"
        onClick={() => {
          if (settings.presets.length < 3) {
            setLabel("preset");
            setLabelOpen(true);
          } else {
            setLimitAlertOpen(true);
          }
        }}
      >
        Save Preset
      </Button>
      <Dialog open={labelOpen}>
        <DialogContent>
          <TextField
            autoFocus
            inputProps={{ maxLength: 7 }}
            label="Preset Name"
            fullWidth
            onChange={event => {
              const l = event.target.value;
              setLabel(l == "" ? `preset${settings.presets.length + 1}` : l);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setLabelOpen(false);
            setSettings({ ...settings, presets: settings.presets.concat({ ...preset, label }) })
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={limitAlertOpen}>
        <DialogContent>
          <DialogContentText>
            Maximum of 3 presets reached.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLimitAlertOpen(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

function Presets(
  settings: UserSettings,
  deleteLabel: string,
  setSettings: (_: UserSettings) => void,
  setPreset: (_: Preset) => void,
  setDeleteLabel: (_: string) => void
) {
  function PresetButton(preset: Preset) {
    return (
      <Button style={{ fontSize: "0.9em" }} onClick={() => setPreset(preset)}>
        {preset.label}
        <IconButton size="small" onClick={() => setDeleteLabel(preset.label)}>
          <DeleteIcon />
        </IconButton>
      </Button >
    );
  }

  if (settings.presets.length != 0) {
    return (
      <div className="Presets">
        <h2>Your Presets</h2>
        <ButtonGroup fullWidth>
          {settings.presets.map(PresetButton)}
        </ButtonGroup>
        <Dialog open={deleteLabel != ""}>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete preset: <b>"{deleteLabel}"</b> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteLabel("")}>No</Button>
            <Button onClick={() => {
              setDeleteLabel("");
              setSettings({ ...settings, presets: settings.presets.filter(p => p.label != deleteLabel) });
            }}>
              Yes!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  } else {
    return (<></>);
  }
}

export { Presets, SavePresetButton };