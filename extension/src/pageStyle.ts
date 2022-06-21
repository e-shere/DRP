import { UserSettings } from "./App";

async function updatePage(settings: UserSettings) {
  setPageStyle(settings, s => {
    /* hacky - all tags exclusing those that we want to change the bg for */
    const bgChangeTags = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .map(e => e.tagName).filter(t => !["P", "HEADER", "LI", "BODY", "FRAMESET"].includes(t));

    document.querySelectorAll<HTMLElement>("*").forEach(element => {
      if (s.styleChanged) {
        /* Tags for elements to exclude should be uppercase */
        setElementProperty(element, "background-color", s.bgColor, s.bgChanged, bgChangeTags);
        setElementProperty(element, "font-family", s.font, s.fontChanged, ["IMG", "SPAN"]);
        increaseElementProperty(element, "font-size", s.fontSize, s.fontChanged, ["IMG"], 0.1);
        increaseElementProperty(element, "letter-spacing", s.letterSpacing, s.fontChanged, ["IMG"], 0.5);
      } else {
        ["background-color", "font-size", "letter-spacing", "font-family"]
          .forEach(t => resetElementProperty(element, t));
      }
    });

    function increaseElementProperty(element: HTMLElement, property: string, value: number, changed: boolean, tags: string[], scale: number) {
      const increasedValue = `calc(${toPixels(getDataProperty(element, property))} + ${value * scale}px)`;
      setElementProperty(element, property, increasedValue, changed, tags);
    }

    function setElementProperty(element: HTMLElement, property: string, value: string, changed: boolean, excluded: string[]) {
      const dataProperty = `data-initial-${property}`;
      if (!element.hasAttribute(dataProperty)) {
        element.setAttribute(dataProperty, window.getComputedStyle(element).getPropertyValue(property));
      }

      /* Apply change only if switch is toggled */
      if (!excluded.includes(element.tagName) && changed) {
        element.style.setProperty(property, value);
      } else {
        resetElementProperty(element, property);
      }
    }

    function resetElementProperty(element: HTMLElement, property: string) {
      element.style.setProperty(property, getDataProperty(element, property));
    }

    function toPixels(str: string) {
      switch(str) {
        case "medium":
          return "16px";
        case "normal":
          return "0px";
        default:
          return str;
      }
    }

    function getDataProperty(element: HTMLElement, property: string) {
      return element.dataset[camelCase(`initial-${property}`)] ?? "";
    }

    function camelCase(str: string) {
      return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }
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