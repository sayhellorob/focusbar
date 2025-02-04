document.getElementById('toggle-bar').addEventListener('click', async () => {
  console.log('Button clicked in popup...');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log('Active tab:', tab);

    if (!tab || !tab.id || !tab.url || !tab.url.startsWith('http')) {
      console.error('Invalid or unsupported tab:', tab);
      return;
    }

    console.log('Checking if content script is already injected...');

    // Inject the content script if it's not already loaded
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['content.js']
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error injecting content script:', chrome.runtime.lastError.message);
        } else {
          console.log('Content script injected. Sending toggle message...');

          // Ensure a slight delay before sending the message to let the script initialize
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlightBar' }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError.message);
              } else {
                console.log('Response from content script:', response);
              }
            });
          }, 100); // 100ms delay to ensure script is ready
        }
      }
    );
  } catch (error) {
    console.error('Error querying tabs or injecting script:', error.message);
  }
});
