/* global chrome */

const extensionId = "ejhehfgbdmmcdjolnagplbkjppnfhkhk";

export function triggerMessageToExtension(event, style) {
    console.log("Nick dw, it's gonna be alrighty");
    chrome.runtime.sendMessage(extensionId, { data: style },
        function(response) {
            console.log("triggerMessageToExtension [callback, 1]");
            console.log(`success: ${response.success}, message: ${response.message}`);
        }
    );
}