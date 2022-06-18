/* Todo: improve method of updating background color (maybe adjust font color too) */

import { UserSettings } from "./App";

async function updatePage(settings: UserSettings) {
  setPageStyle(settings, s => {

    const CLARIFY_SEPARATOR = "ClarifySeparator:here;";
    /* The html tags for which we should change the background color. document.body can have tags
    'body' and 'frameset' */
    const tagForBgColorChange = ["p", "header", "li", "body", "frameset"].map(s => s.toUpperCase());
    function canSetBgColor(node: Element): boolean {
      return tagForBgColorChange.includes(node.tagName);
    }

    /* Return the original value of the style attribute (i.e. remove all style properties added by the extension, 
      therefore everything after the ClarifySeparator)*/
    function getOriginalStyleProperties(element: HTMLElement): string {
      /* Get the value of the style attribute, or an empty string if it is null */
      var currentAttrs = element.getAttribute("style") ?? "";
      /* Return everything before the CLARIFY_SEPARATOR */
      return currentAttrs.split(CLARIFY_SEPARATOR)[0].trim();
    }

    /* Add custom attributes to each element. 
    data-initial-font-size: computed font size of the original page
    data-initial-style: copy of the original value of the style attribute */
    document.querySelectorAll("*").forEach(
      element => {
        if (!element.hasAttribute('data-initial-font-size')) {
          /* Add it only if not already present */
          element.setAttribute('data-initial-font-size', window.getComputedStyle(element).getPropertyValue('font-size'));
        }
        if (!element.hasAttribute('data-initial-style')) {
          /* Keep a copy of the initial value of the style attribute if not already present */
          element.setAttribute('data-initial-style', element.getAttribute("style") ?? "");
        } 
      }
    );

    /* Update page bg */
    document.querySelectorAll("*").forEach(
      node => {
        const element = node as HTMLElement;
        const originalStyleProperties: string = element.dataset.initialStyle ?? "";
        
        if (!s.styleChanged) {
          /* Come back to original style */
          element.setAttribute("style", originalStyleProperties);
        } else {
          /* Set style to be original properties + our properties (bgAttr added only if the node 
          is of a particular type (HTML tag)) */
          const fontAtrr = s.fontChanged
          ? `font-family:${s.font} !important; 
            font-size:calc(${(node as HTMLElement).dataset.initialFontSize} + ${s.fontSizeIncrease / 10}px) !important;
            letter-spacing: ${s.fontSpacingIncrease}px !important;`
          : "";
          const bgAtrr = s.bgChanged ? `background-color:${s.bgColor} !important;` : "";
          element.setAttribute("style", originalStyleProperties.concat(";", element.tagName == "IMG" ? "" : fontAtrr, canSetBgColor(node) ? bgAtrr : ""));
        }
      }
    );
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