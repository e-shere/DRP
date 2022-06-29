/* global chrome */

const extensionId = "cmekghnleekldjcclkdccdeoppjlenbp";

export function sendPresetToExtension(style) {
    console.log("Nick dw, it's gonna be alrighty");
    chrome.runtime.sendMessage(extensionId, { data: style },
        function(response) {
            console.log(`preset sent to the extension. Response: { success: ${response.success}, message: ${response.message} }`);
        }
    );
}