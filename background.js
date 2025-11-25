chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-focusbar') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].id) {
                // Check if we can inject/message
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHighlightBar' }, (response) => {
                    if (chrome.runtime.lastError) {
                        // If message fails, script might not be injected.
                        // We can try to inject it, but usually content scripts are defined in manifest to auto-inject 
                        // OR injected via popup. 
                        // Since this extension seems to rely on manual injection via popup (based on previous analysis),
                        // we should probably inject it here if missing.
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['content.js']
                        }, () => {
                            if (!chrome.runtime.lastError) {
                                // Wait a bit for script to init
                                setTimeout(() => {
                                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHighlightBar' });
                                }, 100);
                            }
                        });
                    }
                });
            }
        });
    }
});
