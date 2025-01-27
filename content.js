let highlightBar;
let isDragging = false;
let isResizing = false;
let offsetY = 0;

// Function to create or remove the highlight bar
function toggleHighlightBar() {
  if (highlightBar) {
    highlightBar.remove();
    highlightBar = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopDragOrResize);
  } else {
    // Create the highlight bar
    highlightBar = document.createElement('div');
    highlightBar.style.position = 'fixed';
    highlightBar.style.top = '0';
    highlightBar.style.left = '0';
    highlightBar.style.width = '100%';
    highlightBar.style.height = '100px'; // Default height
    highlightBar.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
    highlightBar.style.pointerEvents = 'auto';
    highlightBar.style.cursor = 'grab';
    highlightBar.style.zIndex = '9999';
    highlightBar.style.display = 'flex';
    highlightBar.style.justifyContent = 'flex-end';
    highlightBar.style.alignItems = 'center';
    highlightBar.style.paddingRight = '10px';
    highlightBar.style.boxSizing = 'border-box';

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.marginRight = '5px';
    closeButton.style.transition = 'opacity 0.3s'; // Smooth transition for hiding/showing
    highlightBar.appendChild(closeButton);

    // Add a handle for resizing
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.left = '0';
    resizeHandle.style.width = '100%';
    resizeHandle.style.height = '10px';
    resizeHandle.style.cursor = 'ns-resize';
    resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Slightly visible handle
    highlightBar.appendChild(resizeHandle);

    document.body.appendChild(highlightBar);

    // Add event listeners for dragging and resizing
    highlightBar.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', startResize);

    // Add functionality to hide the close button after a few seconds
    setTimeout(() => {
      closeButton.style.opacity = '0'; // Hide the button
    }, 3000); // 3 seconds

    // Show the button when the bar is hovered
    highlightBar.addEventListener('mouseover', () => {
      closeButton.style.opacity = '1'; // Show the button
    });

    // Hide the button when the mouse leaves the bar
    highlightBar.addEventListener('mouseout', () => {
      closeButton.style.opacity = '0'; // Hide the button
    });

    // Close functionality
    closeButton.addEventListener('click', () => {
      highlightBar.remove();
      highlightBar = null;
    });
  }
}

// Start drag handler
function startDrag(event) {
  if (event.target !== highlightBar) return; // Prevent dragging when resizing
  isDragging = true;
  offsetY = event.clientY - highlightBar.getBoundingClientRect().top;
  highlightBar.style.cursor = 'grabbing';
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDragOrResize);
}

// Drag handler
function onDrag(event) {
  if (!isDragging) return;
  const newTop = event.clientY - offsetY;
  highlightBar.style.top = `${newTop}px`; // Update the position dynamically
}

// Start resize handler
function startResize(event) {
  isResizing = true;
  offsetY = event.clientY;
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopDragOrResize);
}

// Resize handler
function onResize(event) {
  if (!isResizing) return;
  const newHeight = highlightBar.getBoundingClientRect().height + (event.clientY - offsetY);
  if (newHeight > 20) { // Prevent collapsing too much
    highlightBar.style.height = `${newHeight}px`;
    offsetY = event.clientY;
  }
}

// Stop drag or resize handler
function stopDragOrResize() {
  isDragging = false;
  isResizing = false;
  highlightBar.style.cursor = 'grab';
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopDragOrResize);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script:', message);
    console.log('Message sender:', sender);
  
    if (message.action === 'toggleHighlightBar') {
      try {
        toggleHighlightBar();
        sendResponse({ status: 'Highlight bar toggled' });
      } catch (error) {
        console.error('Error toggling highlight bar:', error.message);
        sendResponse({ status: 'Error', message: error.message });
      }
    }
  });
  