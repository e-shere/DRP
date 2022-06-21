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
  }
}

export default Style;