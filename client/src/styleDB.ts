import Style from "./style";

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
  var font = style.font;
  var gId = assignGroupID(hexToRgb(style.bgColor));
  style.gId = gId + ":" + font;

  fetch("/add-preset", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({data : JSON.stringify(style)}) // can add font colour as well here
  }).catch(() => console.log("Error when submitting preset"));
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
  return affixColourRange(rgb.b) + ":" + affixColourRange(rgb.g) + ":" + affixColourRange(rgb.r);
}

function affixColourRange(colour: number): String {
  const groupSize = 15
  return String(Math.floor(colour / groupSize) * groupSize);
}

export { addPreset, getAllPresets };