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

function addPreset(style: Style){
  var font = style.font;
  var gId = String(assignGroupID(hexToRgb(style.bgColor)));
  var key =  gId + ":" + font;

  fetch("/add-preset", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ data: key}), // can add font colour as well here
  }).then(res => res.json()).catch(() => console.log("Error when submitting preset"));
  
  // return gId;
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
  return String(rgb.b) + String(rgb.g) + String(rgb.r);
}

export { getDbStyle, setDbStyle, getAllStyles, addPreset };