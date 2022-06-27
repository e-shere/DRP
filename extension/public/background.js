/* global chrome */

// let tabPorts = { [tabId: string]: chrome.runtime.Port } */
let tabPorts = {};

chrome.runtime.onMessageExternal.addListener(
  function (message, sender, sendResponse) {

    chrome.storage.sync.set({preset: {...message.data}}, function() {
      console.log('Value is set to ' + JSON.stringify(message.data) + ' in the background script.');
    });
    
  }
)

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  console.log("HEYYYY");
});