import { UserSettings, Preset } from "./domain";

/* Tags for elements to exclude should be uppercase */
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

  if (s.styleChanged) {
    if (p.punctuationSpacingChanged) {
      rootElement.querySelectorAll<HTMLElement>("P, LI, SPAN").forEach(element => {
        setPunctuationSpacing(element);
      });
    }

    rootElement.querySelectorAll<HTMLElement>("*").forEach(element => {
      if (p.bgChanged) {
        document.body.style.backgroundColor = p.bgColor;
        setElementProperty(element, "background-color", p.bgColor,
          includeTags([...HEADINGS, "A", "P", "HEADER", "LI"])
        );
        setElementProperty(element, "color", p.fontColor, excludeTags(["IMG", "A"]));
        setElementProperty(element, "color", p.auxFontColor, includeTags(["A"]));
      }

      if (p.fontChanged) {
        const heading_size = p.fontSize * HEADING_SCALING;
        setElementProperty(element, "font-family", p.font,
          excludeTags(["IMG", "SPAN"])
        );
        setElementProperty(element, "font-size", `${p.fontSize}px`,
          excludeTags([...HEADINGS, "IMG"])
        );
        setElementProperty(element, "font-size", `${heading_size}px`,
          includeTags(HEADINGS)
        );
        setElementProperty(element, "line-height", `${p.lineSpacing * p.fontSize}px`,
          excludeTags([...HEADINGS, "IMG"])
        );
        setElementProperty(element, "line-height", `${p.lineSpacing * heading_size}px`,
          includeTags(HEADINGS)
        );
        setElementProperty(element, "letter-spacing", `${p.letterSpacing * p.fontSize}px`,
          excludeTags([...HEADINGS, "IMG"])
        );
        setElementProperty(element, "letter-spacing", `${p.letterSpacing * heading_size}px`,
          includeTags(HEADINGS)
        );
      }
    });
  }

  function setPunctuationSpacing(element: HTMLElement) {
    const doc = new DOMParser().parseFromString(element.innerHTML, 'text/html');
    const arr = Array.from(doc.body.childNodes)
      .map(child => (child as HTMLElement).outerHTML || (child.textContent ?? "")
        .split(/(?<=[.?!,;])/).join(p.punctuationSpace));
    element.innerHTML = arr.join('');
  }

  function setElementProperty(
    element: HTMLElement,
    property: string,
    value: string,
    applyOnTag: (_: HTMLElement) => boolean
  ) {
    if (applyOnTag(element)) {
      element.style.setProperty(property, value);
    }
  }

  function excludeTags(tags: string[]) {
    return (element: HTMLElement) => !includeTags(tags)(element);
  }

  function includeTags(tags: string[]) {
    return (element: HTMLElement) => tags.includes(element.tagName);
  }
};

export { applyPageStyle }