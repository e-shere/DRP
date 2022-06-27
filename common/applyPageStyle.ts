import { UserSettings, Preset } from "./domain";

function applyPageStyle(s: UserSettings, p: Preset, getRootElement?: (_: Document) => HTMLElement) {
  const HEADINGS = ["H1", "H2", "H3", "H4", "H5", "H6"];
  const HEADING_SCALING = 1.5;
  const rootElement: HTMLElement = getRootElement !== undefined ? getRootElement(document) : document.body;

  /* Store initial html */
  if (!rootElement.hasAttribute("data-initial-html")) {
    rootElement.setAttribute("data-initial-html", rootElement.innerHTML);
  }

  /* Reset page */
  rootElement.innerHTML = rootElement.dataset.initialHtml ?? "Error: Clarify could not load page";

  /* Apply punctuation spacing */
  if (s.styleChanged) {
    rootElement.querySelectorAll<HTMLElement>("*").forEach(element => {
      /* Tags for elements to exclude should be uppercase */
      setElementProperty(element, "background-color", p.bgColor, p.bgChanged,
        includeTags([...HEADINGS, "A", "P", "HEADER", "LI", "BODY", "FRAMESET"])
      );
      setElementProperty(element, "font-family", p.font, p.fontChanged,
        excludeTags(["IMG", "SPAN"])
      );
      setElementProperty(element, "color", p.fontColor, p.bgChanged,
        excludeTags(["IMG", "A"])
      );
      setElementProperty(element, "color", p.auxFontColor, p.bgChanged,
        includeTags(["A"])
      );

      setElementProperty(element, "font-size", `${p.fontSize}px`, p.fontChanged,
        excludeTags([...HEADINGS, "IMG"])
      );
      setElementProperty(element, "font-size", `${p.fontSize * HEADING_SCALING}px`, p.fontChanged,
        includeTags(HEADINGS)
      );

      setElementProperty(element, "line-height", `${p.lineSpacing * p.fontSize}px`, p.fontChanged,
        excludeTags([...HEADINGS, "IMG"])
      );
      setElementProperty(element, "line-height", `${p.lineSpacing * p.fontSize * HEADING_SCALING}px`, p.fontChanged,
        includeTags(HEADINGS)
      );

      setElementProperty(element, "letter-spacing", `${p.letterSpacing * p.fontSize}px`, p.fontChanged,
        excludeTags([...HEADINGS, "IMG"])
      );
      setElementProperty(element, "letter-spacing", `${p.letterSpacing * p.fontSize * HEADING_SCALING}px`, p.fontChanged,
        includeTags(HEADINGS)
      );

      setPunctuationSpacing(element, ["P", "LI", "SPAN"]);
    });
  }

  function setPunctuationSpacing(element: HTMLElement, includedTags: string[]) {
    if (p.punctuationSpacingChanged && includedTags.includes(element.tagName)) {
      const doc = new DOMParser().parseFromString(element.innerHTML, 'text/html');
      const arr = Array.from(doc.body.childNodes)
        .map(child => (child as HTMLElement).outerHTML || (child.textContent ?? "")
          .split(/(?<=[.?!,;])/).join(p.punctuationSpace));
      element.innerHTML = arr.join('');
    }
  }

  function setElementProperty(
    element: HTMLElement,
    property: string,
    value: string,
    changed: boolean,
    applyOnTag: (_: HTMLElement) => boolean
  ) {
    if (applyOnTag(element) && changed) {
      element.style.setProperty(property, value);
    }
  }

  function excludeTags(tags: string[]) {
    return ((element: HTMLElement) => !includeTags(tags)(element));
  }

  function includeTags(tags: string[]) {
    return (element: HTMLElement) => tags.includes(element.tagName);
  }
};

export { applyPageStyle }