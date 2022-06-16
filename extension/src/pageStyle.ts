/* Todo: improve method of updating background color (maybe adjust font color too) */

import { UserSettings } from "./App";

async function updatePage(settings: UserSettings) {
  setPageStyle(settings, s => {
    const fontAtrr = (s.fontChanged && s.styleChanged)
      ? `font-family:${s.font} !important; 
         font-size:calc(1em + ${s.fontSizeIncrease / 10}px) !important;
         letter-spacing: ${s.fontSpacingIncrease}px !important;`
      : "";
    const bgAtrr = (s.bgChanged && s.styleChanged) ? `background-color:${s.bgColor} !important;` : "";

    /* Update page font */
    function setNodeBgColor(node: HTMLElement) {
      node.setAttribute("style", fontAtrr + bgAtrr);
    }

    /* Update page bg */
    document.querySelectorAll("*").forEach(
      node => node.setAttribute("style", fontAtrr)
    );
    setNodeBgColor(document.body);
    document.querySelectorAll("p").forEach(setNodeBgColor);
    document.querySelectorAll("header").forEach(setNodeBgColor);
    document.querySelectorAll("li").forEach(setNodeBgColor);
  });
}

async function setPageStyle(settings: UserSettings, updateStyle: (_: UserSettings) => void) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: updateStyle,
    args: [settings],
  });
}

export { updatePage };