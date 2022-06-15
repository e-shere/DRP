/* Todo: improve method of updating background color (maybe adjust font color too) */
async function setPageBgColor(bgColor: string) {
  setPageStyle(bgColor, c => {
    function setNodeBgColor(node: HTMLElement) {
      node.style.setProperty("background-color", c, "important");
    }
    setNodeBgColor(document.body);
    document.querySelectorAll("p").forEach(setNodeBgColor);
    document.querySelectorAll("li").forEach(setNodeBgColor);
  });
}

async function setPageFont(font: string) {
  setPageStyle(font, f => {
    document.body.style.fontFamily = f;
  });
}

async function setPageStyle(bgColor: string, updateStyle: (_: string) => void) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id ? tab.id : -1 },
      func: updateStyle,
      args: [bgColor],
    }
  );
}


export { setPageBgColor, setPageFont };