document.getElementById('toggle-bar').addEventListener('click', async () => {
  console.log('Button clicked in popup...');
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Log the tab details for debugging
    console.log('Active tab:', tab);

    // Validate the tab
    if (!tab || !tab.id || !tab.url || !tab.url.startsWith('http')) {
      console.error('Invalid or unsupported tab:', tab);
      return;
    }

    // Inject the content script dynamically
    console.log('Attempting to inject content script into tab:', tab.id);
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['content.js'] // Ensure this path matches the location of your content.js file
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error injecting content script:', chrome.runtime.lastError.message);
        } else {
          console.log('Content script injected successfully.');
          // Send a message to the content script to toggle the highlight bar
          chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlightBar' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError.message);
            } else {
              console.log('Response from content script:', response);
            }
          });
        }
      }
    );
  } catch (error) {
    console.error('Error querying tabs or injecting script:', error.message);
  }
});
