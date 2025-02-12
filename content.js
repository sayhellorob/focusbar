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
    window.removeEventListener('resize', onWindowResize);
    localStorage.removeItem('highlightBarVisible'); // Mark as removed
  } else {
    console.log("Creating highlight bar...");

    // Retrieve stored values
    const savedTop = localStorage.getItem('highlightBarTop') || '0px';
    const savedHeight = localStorage.getItem('highlightBarHeight') || '100px';
    const savedColor = localStorage.getItem('highlightBarHexColor') || '#ffff00';
    const savedOpacity = localStorage.getItem('highlightBarOpacity') || '0.4';

    // Create the highlight bar
    highlightBar = document.createElement('div');
    highlightBar.style.position = 'fixed';
    highlightBar.style.top = savedTop;
    highlightBar.style.left = '0';
    highlightBar.style.width = '100%';
    highlightBar.style.height = savedHeight;
    highlightBar.style.backgroundColor = `rgba(${hexToRGB(savedColor)}, ${savedOpacity})`;
    highlightBar.style.pointerEvents = 'auto';
    highlightBar.style.cursor = 'grab';
    highlightBar.style.zIndex = '9999';
    highlightBar.style.display = 'flex';
    highlightBar.style.justifyContent = 'flex-end';
    highlightBar.style.alignItems = 'center';
    highlightBar.style.paddingRight = '10px';
    highlightBar.style.boxSizing = 'border-box';

    // Save visibility state
    localStorage.setItem('highlightBarVisible', 'true');

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginRight = '10px';
    highlightBar.appendChild(closeButton);

    // Close functionality
    closeButton.addEventListener('click', () => {
      highlightBar.remove();
      highlightBar = null;
      localStorage.removeItem('highlightBarVisible');
    });

    // Add transparency slider
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0.1';
    opacitySlider.max = '1';
    opacitySlider.step = '0.05';
    opacitySlider.value = savedOpacity;
    opacitySlider.style.cursor = 'pointer';
    opacitySlider.style.transition = 'opacity 0.3s';
    opacitySlider.style.marginRight = '10px';

    opacitySlider.addEventListener('input', () => {
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${opacitySlider.value})`;
      localStorage.setItem('highlightBarOpacity', opacitySlider.value);
    });

    highlightBar.appendChild(opacitySlider);

    // Add color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = savedColor;
    colorPicker.style.cursor = 'pointer';
    colorPicker.style.transition = 'opacity 0.3s';
    colorPicker.style.marginLeft = '1px';
    colorPicker.style.width = '20px';
    colorPicker.style.height = '20px';
    colorPicker.style.border = 'none';
    colorPicker.style.borderRadius = '0%';

    colorPicker.addEventListener('input', () => {
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${opacitySlider.value})`;
      localStorage.setItem('highlightBarHexColor', colorPicker.value);
    });

    highlightBar.appendChild(colorPicker);

    // Add resizing handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.left = '0';
    resizeHandle.style.width = '100%';
    resizeHandle.style.height = '10px';
    resizeHandle.style.cursor = 'ns-resize';
    resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    highlightBar.appendChild(resizeHandle);

    // Add reset icon
    const resetIcon = document.createElement('div');
    resetIcon.style.width = '30px';
    resetIcon.style.height = '30px';
    resetIcon.style.cursor = 'pointer';
    resetIcon.style.marginLeft = '10px';
    resetIcon.style.border = '0px solid #333'; // Add border for visibility
    resetIcon.style.display = 'flex';
    resetIcon.style.alignItems = 'center';
    resetIcon.style.justifyContent = 'center';
    resetIcon.style.color = '#333';
    resetIcon.style.fontSize = '20px';
    resetIcon.textContent = '↺'; // Unicode character for reset
    highlightBar.appendChild(resetIcon);

    // Reset functionality
    resetIcon.addEventListener('click', () => {
      localStorage.removeItem('highlightBarTop');
      localStorage.removeItem('highlightBarHeight');
      localStorage.removeItem('highlightBarHexColor');
      localStorage.removeItem('highlightBarOpacity');
      highlightBar.style.top = '0px';
      highlightBar.style.height = '100px';
      highlightBar.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
      colorPicker.value = '#ffff00'; // Reset color picker value
      opacitySlider.value = '0.4'; // Reset opacity slider value
    });

    document.body.appendChild(highlightBar);

    // Attach event listeners for drag and resize
    highlightBar.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', startResize);

    // Show controls when the bar is hovered
    highlightBar.addEventListener('mouseover', () => {
      closeButton.style.opacity = '1';
      opacitySlider.style.opacity = '1';
      colorPicker.style.opacity = '1';
      resetIcon.style.opacity = '1';
    });

    // Hide controls when the mouse leaves the bar
    highlightBar.addEventListener('mouseout', () => {
      closeButton.style.opacity = '0';
      opacitySlider.style.opacity = '0';
      colorPicker.style.opacity = '0';
      resetIcon.style.opacity = '0';
    });

    // Add resize event listener to adjust bar position on screen change
    window.addEventListener('resize', onWindowResize);

    ensureBarIsVisible(highlightBar);
  }
}

function ensureBarIsVisible(bar) {
  const barRect = bar.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  if (barRect.bottom > viewportHeight) {
    bar.style.top = `${viewportHeight - barRect.height}px`;
  }
}

function onWindowResize() {
  if (highlightBar) {
    ensureBarIsVisible(highlightBar);
  }
}

// Start drag handler
function startDrag(event) {
  if (event.target !== highlightBar) return;
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
  highlightBar.style.top = `${newTop}px`;

  // Save position in localStorage
  localStorage.setItem('highlightBarTop', `${newTop}px`);
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
  if (newHeight > 20) {
    highlightBar.style.height = `${newHeight}px`;
    offsetY = event.clientY;

    // Save new height in localStorage
    localStorage.setItem('highlightBarHeight', `${newHeight}px`);
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

  if (message.action === 'toggleHighlightBar') {
    toggleHighlightBar();
    sendResponse({ status: 'Highlight bar toggled' });
  }
});

// Utility function to convert HEX to RGB
function hexToRGB(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// Restore bar visibility if it was active before
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('highlightBarVisible') === 'true') {
    toggleHighlightBar();
  }
});