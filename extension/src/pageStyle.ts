/* Todo: improve method of updating background color (maybe adjust font color too) */

import { UserSettings } from "./App";

async function updatePage(settings: UserSettings) {
  setPageStyle(settings, s => {

    /* The html tags for which we should change the background color. document.body can have tags
    'body' and 'frameset' */
    const tagForBgColorChange = ["p", "header", "li", "body", "frameset"].map(s => s.toUpperCase());
    function canSetBgColor(node: Element): boolean {
      return tagForBgColorChange.includes(node.tagName);
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
        if (!element.hasAttribute('data-initial-inner-html')) {
          /* Keep a copy of the initial value of the style attribute if not already present */
          element.setAttribute('data-initial-inner-html', element.innerHTML);
        } 
      }
    );

    function RemoveHTMLTags(innerHTML: string) {
      var regX = /(<([^>]+)>)/ig;                
      alert(innerHTML.replace(regX, ""));
    }

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
          // if tagName is span, then do not add the font family (e.g. in Google Calendar it makes the icons be just squares)  
          var fontAtrr = s.fontChanged && element.tagName != "SPAN" ? `font-family:${s.font} !important; ` : "";
          fontAtrr = fontAtrr.concat(s.fontChanged
            ? `font-size:calc(${element.dataset.initialFontSize} + ${s.fontSizeIncrease / 10}px) !important;
              letter-spacing: ${s.fontSpacingIncrease}px !important;`
            : "");
          const bgAtrr = s.bgChanged ? `background-color:${s.bgColor} !important;` : "";
          element.setAttribute("style", originalStyleProperties.concat(";", element.tagName == "IMG" ? "" : fontAtrr, canSetBgColor(node) ? bgAtrr : ""));
          const tagsAddSpaces = ["P", "LI"]
          if (tagsAddSpaces.includes(node.tagName) && s.punctuationSpacingChanged) {
            // element.textContent = element.textContent?.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "$1      ") ?? null;
            // element.innerHTML = element.innerHTML.split(/(?<=[.?!,;])/).join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");


            // see https://www.microfocus.com/documentation/silk-test/200/en/silktestworkbench-help-en/SILKTEST-21EEFF3F-DIFFERENCEBETWEENTEXTCONTENTSINNERTEXTINNERHTML-REF.html
            // Ideally we would use textContents, but setting it removes all the node's children so we would lose part of
            // the content -> MUST NOT DO IT
            // Therefore we need to use innerHTML being careful not to add spaces after punctuation within HTML tags. In 
            // this way we will keep the children nodes untouched -> DESIRED BEHAVIOUR
            // element.innerHTML = element.innerHTML.split(/(?<=[.?!,;])/).join("<br>"); 
            element.innerHTML = element.innerHTML.split(/(?<=[.?!,;])/).join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"); 
            // this splits also on punctuation within the html tags
            
            
            
            // .replaceAll(";", ";&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            //   .replaceAll(/,/g, "$1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            //   .replaceAll(".", ".&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
          }
          if (!s.punctuationSpacingChanged) {
            element.innerHTML = element.dataset.initialInnerHtml ?? element.innerHTML;
          }
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