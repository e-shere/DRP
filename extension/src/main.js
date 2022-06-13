/*global chrome*/

export async function changeColor() {
    chrome.storage.sync.set({color: "#c1e6dd"}, ()=>{});
  
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
    
}

function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
}

export async function changeFont() {
  chrome.storage.sync.set({font: "Arial"}, ()=>{});
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageFont,
    });
}

function setPageFont() {
  chrome.storage.sync.get("font", ({ font }) => {
    document.body.style.fontFamily = font;
  });
}