import { UserSettings } from "./App";

async function updatePage(settings: UserSettings) {
  setPageStyle(settings, s => {
    /* hacky - all tags exclusing those that we want to change the bg for */
    const bgChangeTags = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .map(e => e.tagName).filter(t => !["H1", "H2", "A", "P", "HEADER", "LI", "BODY", "FRAMESET"].includes(t));

    document.querySelectorAll<HTMLElement>("*").forEach(element => {
      if (s.styleChanged) {
        /* Tags for elements to exclude should be uppercase */
        setElementProperty(element, "background-color", s.bgColor, s.bgChanged, bgChangeTags);
        setElementProperty(element, "font-family", s.font, s.fontChanged, ["IMG", "SPAN"]);
        setElementProperty(element, "color", s.fontColor, s.fontChanged, ["IMG"]);
        increaseElementProperty(element, "font-size", s.fontSize, s.fontChanged, ["IMG"], "16px");
        increaseElementProperty(element, "letter-spacing", s.letterSpacing, s.fontChanged, ["IMG"], "2px");
        increaseElementProperty(element, "line-height", s.lineSpacing, s.fontChanged, ["IMG"], "1em");
      } else {
        ["background-color", "font-size", "letter-spacing", "font-family"]
          .forEach(t => resetElementProperty(element, t));
      }
    });

    function increaseElementProperty(element: HTMLElement, property: string, value: number, changed: boolean, tags: string[], defaultValue: string) {
      const dataProperty = getDataProperty(element, property);
      const initialValue = dataProperty.includes("px") ? dataProperty : defaultValue;
      const increasedValue = `calc(${initialValue} + ${value}px)`;
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