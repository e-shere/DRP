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
import axios from "axios";
// import { Style } from "@mui/icons-material";
import { GridRowId } from "@mui/x-data-grid";


class Style {
  gId: GridRowId;
  font: string;
  fontSize: number;
  bgColor: string;

  constructor(font: string, fontSize: number, bgColor: string) {
    this.font = font;
    this.fontSize = fontSize;
    this.bgColor = bgColor;
    this.gId = "0";
  }
}


function SavePresetButton(settings: UserSettings, preset: Preset, setSettings: (_: UserSettings) => void) {
  const [labelOpen, setLabelOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [limitAlertOpen, setLimitAlertOpen] = useState(false);

  return (
    <div>
      <Button
        variant="text"
        className="save-preset-button"
        onClick={() => {
          if (settings.presets.length < 3) {
            setLabel("");
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
            onChange={event => setLabel(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setLabelOpen(false);

            var style = new Style(preset.font,12,preset.bgColor)
            console.log(JSON.stringify(style));
            axios.post("http://clarify-this-staging.herokuapp.com/submit", style);
            fetch("http://clarify-this-staging.herokuapp.com/add-preset", {
              method: "POST",
              headers: { "Content-Type": "application/json", },
              body: JSON.stringify({data : JSON.stringify(style)}) // can add font colour as well here
            }).catch(() => console.log("Error when submitting preset"));

            setSettings({
              ...settings,
              presets: settings.presets.concat({
                ...preset,
                label: label == "" ? `preset${settings.presets.length + 1}` : label
              })
            })
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
        <IconButton
          size="small"
          onClick={event => { event.stopPropagation(); setDeleteLabel(preset.label); }}
        >
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