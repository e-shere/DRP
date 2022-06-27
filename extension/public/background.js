/* global chrome */

// let tabPorts = { [tabId: string]: chrome.runtime.Port } */
let tabPorts = {};

chrome.runtime.onMessageExternal.addListener(
  function (message, sender, sendResponse) {

    /* Send the 'SendPresetToExtension' message to the frontend code, passing
    the preset in the data field. */
    // chrome.runtime.sendMessage({
    //   msg: "SendPresetToExtension", 
    //   data: message.data,
    //   sender: sender.url
    // }, (response) => {
    //   if (response.success) {
    //     console.log("successful");
    //     sendResponse({ success: true, message: "transmitted successfully" });
    //   } else {
    //     console.log("failure");
    //     sendResponse({ success: false, message: "something went wrong" });
    //   }
    // });

    chrome.storage.sync.set({preset: {...message.data}}, function() {
      console.log('Value is set to ' + JSON.stringify(message.data) + ' in the background script.');
    });
    
  }
)

// chrome.runtime.onMessage.addListener((message, sender) => {
//   const port = sender.tab && sender.tab.id !== undefined && tabPorts[sender.tab.id];
//   if (port) {
//     port.postMessage(message);
//   }
//   return true;
// });

// chrome.runtime.onConnect.addListener((port /*: chrome.runtime.Port */) => { 
//   let tabId;

//   // chrome.runtime.onMessage.addListener 
//   port.onMessage.addListener(message => { 
//     if (message.name === "init") 
//     { 
//       // set in devtools.ts 
//       if (!tabId) { 
//         // this is a first message from devtools so let's set the tabId-port mapping 
//         tabId = message.tabId; 
//         tabPorts[tabId] = port;
//       }
//     } 
//   }); 

//   port.onDisconnect.addListener(() => { 
//     delete tabPorts[tabId]; 
//     }); 
// });


// chrome.runtime.onInstalled.addListener((detail: chrome.runtime.InstalledDetails) => {
//   console.log("Testing installation", detail);
// });


chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  console.log("HEYYYY");
  // create alarm after extension is installed / upgraded
  // chrome.alarms.create('refresh', { periodInMinutes: 1 });
});