import Style from "./style";
import axios from "axios";

async function getAllPresets(): Promise<Style[]> {
  console.log("Fetching presets...");
  const res = await fetch("/serve-presets");
  const presets = await res.json()
  return presets.map(toStyle);
}

function toStyle(keyval: {id: number, freq: number, preset: string}) {
  const settings: string[] = keyval.preset.split(":");
  const bgColour: string = rgbToHex(Number(settings[0]),Number(settings[1]),Number(settings[2]));

  var style = new Style(settings[3], 0, bgColour);
  style.gId = keyval.freq;
  return style; 
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function addPreset(style: Style){
  axios.post(`/submit`, style);
  fetch("/add-preset", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({data : JSON.stringify(style)}) // can add font colour as well here
  }).catch(() => console.log("Error when submitting preset"));
}

export { addPreset, getAllPresets };