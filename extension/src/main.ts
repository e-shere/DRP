/*global chrome*/
import axios from "axios";

async function changeBgColor(color: string) {
  chrome.storage.sync.set({ color });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: () => {
      chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.setProperty('background-color', color,'important');
      const nodeListP = document.querySelectorAll("p");
      for (let i = 0; i < nodeListP.length; i++) {
        nodeListP[i].style.setProperty('background-color', color,'important');
      }
      const nodeListLi = document.querySelectorAll("li");
      for (let i = 0; i < nodeListLi.length; i++) {
        nodeListLi[i].style.setProperty('background-color', color,'important');
      }
      })
    }
  });
}

async function changeFont(font: string) {
  chrome.storage.sync.set({ font });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: () => {
      chrome.storage.sync.get("font", ({ font }) => {
        document.body.style.fontFamily = font;
      });
    }
  });
}

const herokuURL = "https://claraify.herokuapp.com"

export async function lookupStyle() {
  const res = axios.get(`${herokuURL + "/serve-style"}`);
  res.then(res => res.data).then(res => {console.log(res)});
}
export { changeBgColor, changeFont }