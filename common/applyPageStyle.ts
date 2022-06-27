import { UserSettings, Preset } from "./domain";

function applyPageStyle(s: UserSettings, p: Preset, getRootElement?: (_: Document) => HTMLElement) {
  const rootElement: HTMLElement = getRootElement !== undefined ? getRootElement(document) : document.body;

  /* hacky - all tags exclusing those that we want to change the bg for */
  const bgChangeTags = Array.from(rootElement.querySelectorAll<HTMLElement>("*"))
    .map(e => e.tagName).filter(t => !["H1", "H2", "A", "P", "HEADER", "LI", "BODY", "FRAMESET"].includes(t));

  rootElement.querySelectorAll<HTMLElement>("*").forEach(element => {
    if (s.styleChanged) {
      /* Tags for elements to exclude should be uppercase */
      setElementProperty(element, "background-color", p.bgColor, p.bgChanged, bgChangeTags);
      setElementProperty(element, "font-family", p.font, p.fontChanged, ["IMG", "SPAN"]);
      setElementProperty(element, "color", p.fontColor, p.bgChanged, ["IMG", "A"]);
      increaseElementProperty(element, "font-size", p.fontSize, p.fontChanged, ["IMG"], "16px");
      increaseElementProperty(element, "letter-spacing", p.letterSpacing, p.fontChanged, ["IMG"], "2px");
      increaseElementProperty(element, "line-height", p.lineSpacing, p.fontChanged, ["IMG"], "1em");
    } else {
      ["background-color", "font-size", "color", "letter-spacing", "font-family", "inner-html", "line-height"]
        .forEach(t => resetElementProperty(element, t));
    }
    
  });

  rootElement.querySelectorAll<HTMLElement>("a").forEach(element => {
    if (s.styleChanged) {
      setElementProperty(element, "color", p.auxFontColor, p.bgChanged, []);
    }
  });

  /* Apply punctuation spacing */
  rootElement.querySelectorAll<HTMLElement>("li,p,span").forEach(element => {
    resetPunctuationSpacing(element, "inner-html", p.punctuationSpacingChanged, ["P", "LI", "SPAN"]);
    if (s.styleChanged && p.punctuationSpacingChanged) {
      element.innerHTML = applyPunctuationSpacing(element.innerHTML, p.punctuationSpace);
    }
  });

  function applyPunctuationSpacing(str: string, spacingType: string) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    const arr = Array.from(doc.body.childNodes)
      .map(child => (child as HTMLElement).outerHTML || (child.textContent ?? "").split(/(?<=[.?!,;])/).join(spacingType));
    return arr.join('');
  }

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

  function resetPunctuationSpacing(element: HTMLElement, property: string, changed: boolean, included: string[]) {
    if (included.includes(element.tagName)) {
      storeElementProperty(element, property, element.innerHTML);

      /* Reset to original spacing */
      element.innerHTML = element.dataset.initialInnerHtml ?? element.innerHTML;
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
    return element.dataset[camelCase(`initial-${property}`)] ?? window.getComputedStyle(element).getPropertyValue(property);
  }

  function camelCase(str: string) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }
};

export { applyPageStyle }