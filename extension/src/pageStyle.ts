/* Todo: improve method of updating background color (maybe adjust font color too) */

import { UserSettings } from "./App";

async function updatePage(settings: UserSettings) {
  setPageStyle(settings, s => {

    const CLARIFY_SEPARATOR = "ClarifySeparator:here;";
    /* The html tags for which we should change the background color */
    const tagForBgColorChange = ["p", "header", "li"];
    function canSetBgColor(node: Element): boolean {
      return tagForBgColorChange.includes(node.tagName);
    }

    /* Return the original value of the style attribute (i.e. remove all style properties added by the extension, 
      therefore everything after the ClarifySeparator)*/
    function getOriginalStyleProperties(element: HTMLElement): string {
      /* Get the value of the style attribute, or an empty string if it is null */
      var currentAttrs = element.getAttribute("style") ?? "";
      /* Return everything before the CLARIFY_SEPARATOR */
      return currentAttrs.split(CLARIFY_SEPARATOR)[0]
    }

    /* Add data-initial-font-size (custom attribute) to each element */
    document.querySelectorAll("*").forEach(
      element => {
        if (!element.hasAttribute('data-initial-font-size')) {
          /* Add it only if not present already */
          element.setAttribute('data-initial-font-size', window.getComputedStyle(element).getPropertyValue('font-size'));
        }
      }
    );

    const fontAtrr = (s.fontChanged && s.styleChanged)
      ? `font-family:${s.font} !important; 
         font-size:calc(1em + ${s.fontSizeIncrease / 10}px) !important;
         letter-spacing: ${s.fontSpacingIncrease}px !important;`
      : "";
    const bgAtrr = (s.bgChanged && s.styleChanged) ? `background-color:${s.bgColor} !important;` : "";

  
    function setNodeBgColor(node: HTMLElement) {
      var originalAttrs: string = getOriginalStyleProperties(node).trim();
      // set style to be original attributes + our attributes
      node.setAttribute("style", originalAttrs.concat(CLARIFY_SEPARATOR, fontAtrr, bgAtrr));
    }

    /* Update page bg */
    document.querySelectorAll("*").forEach(
      node => {
        const fontAtrr = (s.fontChanged && s.styleChanged)
          ? `font-family:${s.font} !important; 
             font-size:calc(${(node as HTMLElement).dataset.initialFontSize} + ${s.fontSizeIncrease / 10}px) !important;
             letter-spacing: ${s.fontSpacingIncrease}px !important;`
          : "";
        const bgAtrr = (s.bgChanged && s.styleChanged) ? `background-color:${s.bgColor} !important;` : "";


        // get the value of the style attribute, or an empty string if it is null
        var originalAttrs: string = node.getAttribute("style") ?? "";
        function flushClarifyAttrs(attrs: string) {
          return attrs.split(CLARIFY_SEPARATOR)[0];
        }
        originalAttrs = flushClarifyAttrs(originalAttrs).trim();
        // set style to be original attributes + our attributes (bgAttr added only if the node 
        // is of a particular type (HTML tag))
        node.setAttribute("style", 
          originalAttrs.concat(CLARIFY_SEPARATOR, fontAtrr, canSetBgColor(node) ? bgAtrr : "")
        );
        // }
      }
    );
    setNodeBgColor(document.body);
    // document.querySelectorAll("p").forEach(setNodeBgColor);
    // document.querySelectorAll("header").forEach(setNodeBgColor);
    // document.querySelectorAll("li").forEach(setNodeBgColor);
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