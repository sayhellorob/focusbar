document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const messageKey = el.getAttribute('data-i18n');
    el.textContent = chrome.i18n.getMessage(messageKey) || messageKey;
  });
});

document.getElementById('toggle-btn').addEventListener('click', async () => {
  console.log('Button clicked in popup...');

  const showError = (messageKey) => {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = chrome.i18n.getMessage(messageKey) || "Error occurred";
    errorMessage.classList.add('show');
    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 3000);
  };

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id || !tab.url || !tab.url.startsWith('http')) {
      console.error('Invalid or unsupported tab:', tab);
      showError('errorMessage');
      return;
    }

    // Function to toggle the bar
    const toggleBar = () => {
      chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlightBar' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message);
        } else {
          console.log('Response from content script:', response);
          window.close(); // Optional: close popup after action
        }
      });
    };

    // Check if script is already injected
    chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
      if (chrome.runtime.lastError) {
        // Script not injected, inject it now
        console.log('Script not injected, injecting now...');
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ['content.js']
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error('Error injecting content script:', chrome.runtime.lastError.message);
              showError('errorMessage');
            } else {
              console.log('Content script injected.');
              // Check if the bar will auto-show based on storage
              chrome.storage.sync.get(['highlightBarVisible'], (result) => {
                if (!result.highlightBarVisible) {
                  // Only toggle if it WON'T auto-show
                  console.log('Bar not visible in storage. Toggling to show...');
                  setTimeout(toggleBar, 100);
                } else {
                  console.log('Bar visible in storage. Letting auto-init handle it.');
                  window.close();
                }
              });
            }
          }
        );
      } else {
        // Script already injected, just toggle
        console.log('Script already injected. Toggling bar...');
        toggleBar();
      }
    });

  } catch (error) {
    console.error('Error querying tabs or injecting script:', error.message);
    showError('errorMessage');
  }
});
