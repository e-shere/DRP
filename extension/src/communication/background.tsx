export {};


let tabPorts: { [tabId: string]: chrome.runtime.Port } = {}; 


chrome.runtime.onMessageExternal.addListener(
  function(message, sender, sendResponse) {
    console.log(message + "SUCCESS!");
    sendResponse();
  }
)

chrome.runtime.onMessage.addListener((message, sender) => { 
  const port = sender.tab && sender.tab.id !== undefined && tabPorts[sender.tab.id]; 
  if (port) { 
    port.postMessage(message); 
  } 
  return true; 
});


chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => { 
  let tabId: any; 

  // chrome.runtime.onMessage.addListener 
  port.onMessage.addListener(message => { 
    if (message.name === "init") 
    { 
      // set in devtools.ts 
      if (!tabId) { 
        // this is a first message from devtools so let's set the tabId-port mapping 
        tabId = message.tabId; 
        tabPorts[tabId] = port;
      }
    } 
  }); 

  port.onDisconnect.addListener(() => { 
    delete tabPorts[tabId]; 
    }); 
});


// chrome.runtime.onInstalled.addListener((detail: chrome.runtime.InstalledDetails) => {
//   console.log("Testing installation", detail);
// });


chrome.runtime.onInstalled.addListener(() => {
	console.log('onInstalled...');
	console.log("HEYYYY");
	// create alarm after extension is installed / upgraded
	// chrome.alarms.create('refresh', { periodInMinutes: 1 });
  });