import { UserSettings, Preset } from "./domain";

/* Tags for elements to exclude should be uppercase */
function applyPageStyle(s: UserSettings, p: Preset, getRootElement?: (_: Document) => HTMLElement) {
  const HEADINGS = ["H1", "H2", "H3", "H4", "H5", "H6"];
  const HEADING_SCALING = 1.5;
  const rootElement: HTMLElement = getRootElement !== undefined ? getRootElement(document) : document.body;

  /* Store initial page */
  if (!rootElement.hasAttribute("data-initial-html")) {
    rootElement.setAttribute("data-initial-html", rootElement.innerHTML);
    rootElement.setAttribute("data-initial-bg-color", rootElement.style.backgroundColor);
  }

  /* Reset page */
  rootElement.innerHTML = rootElement.dataset.initialHtml ?? "Error: Clarify could not load page";
  rootElement.style.setProperty("background-color", rootElement.dataset.backgroundColor ?? "")

  if (s.styleChanged) {
    rootElement.querySelectorAll<HTMLElement>("*").forEach(element => {
      if (p.bgChanged) {
        rootElement.style.backgroundColor = p.bgColor;
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

    if (p.punctuationSpacingChanged) {
      rootElement.querySelectorAll<HTMLElement>("P, SPAN").forEach(element => {
        setPunctuationSpacing(element);
      });
    }
  }

  function setPunctuationSpacing(element: HTMLElement) {
    element.innerHTML = Array.from(element.childNodes)
      .map(child => (child as HTMLElement).outerHTML || (child.textContent ?? "")
        .split(/(?<=[.?!,;])/).join(p.punctuationSpace))
      .join("");
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