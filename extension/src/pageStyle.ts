/*global chrome*/

import { applyPageStyle } from "./common/applyPageStyle";
import { UserSettings, Preset } from "./common/domain";

async function updatePage(settings: UserSettings, preset: Preset) {
  setPageStyle(settings, preset, applyPageStyle);
}

async function setPageStyle(settings: UserSettings, preset: Preset, applyPageStyle: (s: UserSettings, p: Preset, getRootElement?: (_: Document) => HTMLElement) => void) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: applyPageStyle,
    args: [settings, preset],
  });
}

export { updatePage };