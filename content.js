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
    highlightBar.style.backgroundColor = localStorage.getItem('highlightBarColor') || 'rgba(255, 255, 0, 0.4)'; // Load stored color or default
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
    closeButton.style.marginRight = '10px';
    closeButton.style.transition = 'opacity 0.3s';
    closeButton.style.opacity = '0'; // Initially hidden
    highlightBar.appendChild(closeButton);

    // Add a transparency slider
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0.1';
    opacitySlider.max = '1';
    opacitySlider.step = '0.05';
    opacitySlider.value = '0.4'; // Default opacity
    opacitySlider.style.cursor = 'pointer';
    opacitySlider.style.transition = 'opacity 0.3s';
    opacitySlider.style.opacity = '0'; // Initially hidden

    // Change opacity when slider moves
    opacitySlider.addEventListener('input', () => {
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${opacitySlider.value})`;
      localStorage.setItem('highlightBarOpacity', opacitySlider.value);
    });

    highlightBar.appendChild(opacitySlider);

    // Add a color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = localStorage.getItem('highlightBarHexColor') || '#ffff00'; // Default color (yellow)
    colorPicker.style.cursor = 'pointer';
    colorPicker.style.transition = 'opacity 0.3s';
    colorPicker.style.opacity = '0'; // Initially hidden
    colorPicker.style.marginLeft = '10px';

    // Make it circular
    colorPicker.style.width = '30px';
    colorPicker.style.height = '30px';
    colorPicker.style.border = 'none';
    colorPicker.style.borderRadius = '50%';
    colorPicker.style.overflow = 'hidden';
    colorPicker.style.padding = '0';
    colorPicker.style.background = 'transparent';

    // Change bar color when the user selects a new color
    colorPicker.addEventListener('input', () => {
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${opacitySlider.value})`;
      localStorage.setItem('highlightBarHexColor', colorPicker.value);
    });

    highlightBar.appendChild(colorPicker);

    // Add a handle for resizing
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.left = '0';
    resizeHandle.style.width = '100%';
    resizeHandle.style.height = '10px';
    resizeHandle.style.cursor = 'ns-resize';
    resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    highlightBar.appendChild(resizeHandle);

    document.body.appendChild(highlightBar);

    // Add event listeners for dragging and resizing
    highlightBar.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', startResize);

    // Show controls when the bar is hovered
    highlightBar.addEventListener('mouseover', () => {
      closeButton.style.opacity = '1';
      opacitySlider.style.opacity = '1';
      colorPicker.style.opacity = '1';
    });

    // Hide controls when the mouse leaves the bar
    highlightBar.addEventListener('mouseout', () => {
      closeButton.style.opacity = '0';
      opacitySlider.style.opacity = '0';
      colorPicker.style.opacity = '0';
    });

    // Close functionality
    closeButton.addEventListener('click', () => {
      highlightBar.remove();
      highlightBar = null;
    });

    // Restore saved opacity
    const savedOpacity = localStorage.getItem('highlightBarOpacity');
    if (savedOpacity) {
      opacitySlider.value = savedOpacity;
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${savedOpacity})`;
    }
  }
}


// // Function to create or remove the highlight bar
// function toggleHighlightBar() {
//   if (highlightBar) {
//     highlightBar.remove();
//     highlightBar = null;
//     document.removeEventListener('mousemove', onDrag);
//     document.removeEventListener('mousemove', onResize);
//     document.removeEventListener('mouseup', stopDragOrResize);
//   } else {
//     // Create the highlight bar
//     highlightBar = document.createElement('div');
//     highlightBar.style.position = 'fixed';
//     highlightBar.style.top = '0';
//     highlightBar.style.left = '0';
//     highlightBar.style.width = '100%';
//     highlightBar.style.height = '100px'; // Default height
//     highlightBar.style.backgroundColor = 'rgba(255, 255, 0, 0.4)'; // Default opacity
//     highlightBar.style.pointerEvents = 'auto';
//     highlightBar.style.cursor = 'grab';
//     highlightBar.style.zIndex = '9999';
//     highlightBar.style.display = 'flex';
//     highlightBar.style.justifyContent = 'flex-end';
//     highlightBar.style.alignItems = 'center';
//     highlightBar.style.paddingRight = '10px';
//     highlightBar.style.boxSizing = 'border-box';

//     // Add a close button
//     const closeButton = document.createElement('button');
//     closeButton.textContent = 'X';
//     closeButton.style.backgroundColor = 'red';
//     closeButton.style.color = 'white';
//     closeButton.style.border = 'none';
//     closeButton.style.borderRadius = '50%';
//     closeButton.style.width = '30px';
//     closeButton.style.height = '30px';
//     closeButton.style.cursor = 'pointer';
//     closeButton.style.marginRight = '10px';
//     closeButton.style.transition = 'opacity 0.3s'; // Smooth transition for hiding/showing
//     closeButton.style.opacity = '0'; // Initially hidden
//     highlightBar.appendChild(closeButton);

//     // Add a transparency slider
//     const opacitySlider = document.createElement('input');
//     opacitySlider.type = 'range';
//     opacitySlider.min = '0.1';
//     opacitySlider.max = '1';
//     opacitySlider.step = '0.05';
//     opacitySlider.value = '0.4'; // Default opacity
//     opacitySlider.style.cursor = 'pointer';
//     opacitySlider.style.transition = 'opacity 0.3s'; // Smooth transition for hiding/showing
//     opacitySlider.style.opacity = '0'; // Initially hidden

//     // Change opacity when slider moves
//     opacitySlider.addEventListener('input', () => {
//       highlightBar.style.backgroundColor = `rgba(255, 255, 0, ${opacitySlider.value})`;
//     });

//     highlightBar.appendChild(opacitySlider);

    
//     // Add a handle for resizing
//     const resizeHandle = document.createElement('div');
//     resizeHandle.style.position = 'absolute';
//     resizeHandle.style.bottom = '0';
//     resizeHandle.style.left = '0';
//     resizeHandle.style.width = '100%';
//     resizeHandle.style.height = '10px';
//     resizeHandle.style.cursor = 'ns-resize';
//     resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Slightly visible handle
//     highlightBar.appendChild(resizeHandle);

//     document.body.appendChild(highlightBar);

//     // Add event listeners for dragging and resizing
//     highlightBar.addEventListener('mousedown', startDrag);
//     resizeHandle.addEventListener('mousedown', startResize);

//     // Show controls when the bar is hovered
//     highlightBar.addEventListener('mouseover', () => {
//       closeButton.style.opacity = '1'; // Show the close button
//       opacitySlider.style.opacity = '1'; // Show the opacity slider
//     });

//     // Hide controls when the mouse leaves the bar
//     highlightBar.addEventListener('mouseout', () => {
//       closeButton.style.opacity = '0'; // Hide the close button
//       opacitySlider.style.opacity = '0'; // Hide the opacity slider
//     });

//     // Close functionality
//     closeButton.addEventListener('click', () => {
//       highlightBar.remove();
//       highlightBar = null;
//     });
//   }
// }

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

// Utility function to convert HEX to RGB
function hexToRGB(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}