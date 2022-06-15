/* Todo: improve method of updating background color (maybe adjust font color too) */
async function setPageBgColor(bgColor: string) {
  setPageStyle(bgColor, c => {
    function setNodeBgColor(node: HTMLElement) {
      node.style.setProperty("background-color", c, "important");
    }
    setNodeBgColor(document.body);
    document.querySelectorAll("p").forEach(setNodeBgColor);
    document.querySelectorAll("header").forEach(setNodeBgColor);
    document.querySelectorAll("li").forEach(setNodeBgColor);
  });
}

async function setPageFont(font: string) {
  setPageStyle(font, f => {
    function setNodeFont(node: Element) {
      node.setAttribute("style", `font-family:${f} !important`);
    }
    setNodeFont(document.body);
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(setNodeFont);
    document.querySelectorAll("p").forEach(setNodeFont);
    document.querySelectorAll("li").forEach(setNodeFont);
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