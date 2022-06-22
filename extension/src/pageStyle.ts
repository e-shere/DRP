import { UserSettings, Preset } from "./App";

async function updatePage(settings: UserSettings, preset: Preset) {
  setPageStyle(settings, preset, (s, p) => {
    /* hacky - all tags exclusing those that we want to change the bg for */
    const bgChangeTags = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .map(e => e.tagName).filter(t => !["H1", "H2", "A", "P", "HEADER", "LI", "BODY", "FRAMESET"].includes(t));

    document.querySelectorAll<HTMLElement>("*").forEach(element => {
      if (s.styleChanged) {
        setPunctuationSpacing(element, "inner-text", p.punctuationSpacingChanged, ["P", "LI"]);

        /* Tags for elements to exclude should be uppercase */
        setElementProperty(element, "background-color", p.bgColor, p.bgChanged, bgChangeTags);
        setElementProperty(element, "font-family", p.font, p.fontChanged, ["IMG", "SPAN"]);
        setElementProperty(element, "color", p.fontColor, p.fontChanged, ["IMG"]);
        increaseElementProperty(element, "font-size", p.fontSize, p.fontChanged, ["IMG"], "16px");
        increaseElementProperty(element, "letter-spacing", p.letterSpacing, p.fontChanged, ["IMG"], "2px");
        increaseElementProperty(element, "line-height", p.lineSpacing, p.fontChanged, ["IMG"], "1em");
      } else {
        ["background-color", "font-size", "color", "letter-spacing", "font-family"]
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
      if (!excluded.includes(element.tagName)) {
        const initialValue = window.getComputedStyle(element).getPropertyValue(property);
        storeElementProperty(element, property, initialValue)

        if (changed) {
          element.style.setProperty(property, value);
        } else {
          resetElementProperty(element, property);
        }
      }
    }

    function setPunctuationSpacing(element: HTMLElement, property: string, changed: boolean, included: string[]) {
      if (included.includes(element.tagName)) {
        storeElementProperty(element, property, element.innerText);

        element.innerText = element.dataset.initialInnerText ?? element.innerText;
        if (changed) {
          element.innerText = element.innerText.split(/(?<=[.?!,;])/).join("\n");
        }
      }
    }

    function storeElementProperty(element: HTMLElement, property: string, value: string) {
      const dataProperty = `data-initial-${property}`;
      if (!element.hasAttribute(dataProperty)) {
        element.setAttribute(dataProperty, value);
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

async function setPageStyle(settings: UserSettings, preset: Preset, updateStyle: (s: UserSettings, p: Preset) => void) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id ? tab.id : -1 },
    func: updateStyle,
    args: [settings, preset],
  });
}

export { updatePage };