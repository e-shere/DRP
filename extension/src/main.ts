/*global chrome*/

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

export { changeBgColor, changeFont }