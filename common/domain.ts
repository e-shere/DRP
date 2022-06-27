export interface UserSettings {
  styleChanged: boolean,
  presets: Preset[];
}

export enum Spacing {
  Spaces = "&nbsp&nbsp&nbsp&nbsp&nbsp",
  NewLine = "<br>"
};
  
export interface Preset {
  label: string;
  bgChanged: boolean;
  fontChanged: boolean;
  punctuationSpacingChanged: boolean;
  bgColor: string;
  font: string;
  fontSize: number;
  letterSpacing: number;
  lineSpacing: number;
  fontColor: string;
  auxFontColor: string;
  punctuationSpace: Spacing;
}

export const DEFAULT_PRESET: Preset = {
  label: "default",
  bgChanged: false,
  fontChanged: false,
  punctuationSpacingChanged: false,
  bgColor: "#faf2d9",
  font: "Arial",
  fontSize: 0,
  letterSpacing: 0,
  lineSpacing: 0,
  fontColor: "black",
  auxFontColor: "blue",
  punctuationSpace: Spacing.Spaces,
};
