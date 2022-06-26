export interface UserSettings {
  styleChanged: boolean,
  presets: Preset[];
}

export enum Spacing {
  Spaces = "&nbsp&nbsp&nbsp&nbsp&nbsp",
  NewLine = "<br><br/>"
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
  punctuationSpace: Spacing;
}
