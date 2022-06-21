import Style from "./style";
import { GridRowId } from "@mui/x-data-grid";

async function getDbStyle(): Promise<Style> {
  const res = await fetch("/getall");
  const data = await res.json();
  console.log(JSON.stringify(data));
  return JSON.parse(data);
}

function setDbStyle(style: Style) {
  fetch("/set", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ data: style }),
  })
    .then(res => res.json())
    .catch(() => console.log("Error when posting style"));
}

async function getAllStyles(): Promise<Style[]> {
  console.log("Fetching styles...");
  const res = await fetch("/serve-styles");
  const data = await res.json();
  console.log(JSON.stringify(data));
  return data.map(JSON.parse);
}

async function getAllPresets(): Promise<Style[]> {
  console.log("Fetching presets...");
  const res = await fetch("/serve-presets");
  // console.log(res.data);
  const data = await res.json()
  return data.map(unpackStyle)
}

function unpackStyle(keyval: {freq: number, preset: string}) {
  const settings: string[] = keyval.preset.split(":");
  const bgColour: string = rgbToHex(Number(settings[0]),Number(settings[1]),Number(settings[2]));

  var style = new Style(settings[3], 0, bgColour);
  return style; 
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function addPreset(style: Style){
  var font = style.font;
  var gId = String(assignGroupID(hexToRgb(style.bgColor)));
  style.gId = gId + ":" + font;

  fetch("/add-preset", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ data: style }), // can add font colour as well here
  }).then(res => res.json()).catch(() => console.log("Error when submitting preset"));
  
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  var parsedHexVal: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
 
  return {
    r: parseInt(parsedHexVal[1], 16),
    g: parseInt(parsedHexVal[2], 16),
    b: parseInt(parsedHexVal[3], 16)
  };
 
}

function assignGroupID(rgb: RGB) {
  return String(rgb.b) + ":" + String(rgb.g) + ":" + String(rgb.r);
}

export { getDbStyle, setDbStyle, getAllStyles, addPreset, getAllPresets };