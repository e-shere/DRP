/* global chrome */

const extensionId = "ejhehfgbdmmcdjolnagplbkjppnfhkhk"

var message = "test"

// window.addEventListener("message", (event) => { // Only accept messages from the same frame 
// 	if (event.source !== window) { 
// 	  return; 
// 	}
// 	var message = event.data;
// 	// Only accept messages that we know are ours 
  
// 	if (typeof message !== "object" ||
// 		 message === null ||
// 		  !!message.source && message.source !== "clarify-this-webapp") { 
// 	  return; 
// 	} 
// 	chrome.runtime.sendMessage(message); 
//   });


//   chrome.runtime.onMessage.addListener((request) => {
//     request.source = 'clarify-this-webapp';
//     window.postMessage(request, '*');
// });

// // try {
// 	chrome.runtime.onMessageExternal.addListener(
// 		function(request, sender, sendResponse) {
// 			console.log("RECIEVED");
// 			console.log(request);
// 			if (sender.url === "http://clarify-this.com/") {
				
// 				console.log("Response!");
// 				message = "SUCCESS";
// 			}
// 		}
// 	)
// } catch(e) {
// 	console.log(e);
// }

