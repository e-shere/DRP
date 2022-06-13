/*global chrome*/

export async function changeColor() {
    chrome.storage.sync.set({color: "#3aa757"}, ()=>{});
  
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