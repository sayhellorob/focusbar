let highlightBar;
let isDragging = false;
let isResizing = false;
let offsetY = 0;

// Icons
const ICONS = {
  close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  reset: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"></path><path d="M3 5v7h7"></path></svg>`
};

// Styles
const STYLES = `
  .focusbar-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.95);
    padding: 6px 12px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    transform: translateY(5px);
    margin-right: 20px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(0,0,0,0.05);
  }

  .focusbar-base:hover .focusbar-toolbar {
    opacity: 1;
    transform: translateY(0);
  }

  .focusbar-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    transition: all 0.2s;
  }

  .focusbar-btn:hover {
    background: rgba(0,0,0,0.1);
    color: #000;
  }

  .focusbar-btn.close:hover {
    background: #ff4757;
    color: white;
  }

  .focusbar-slider {
    -webkit-appearance: none;
    width: 80px;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    outline: none;
  }

  .focusbar-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .focusbar-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .focusbar-color {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
  }

  .focusbar-color::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .focusbar-color::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
  }
`;

// Function to create or remove the highlight bar
function toggleHighlightBar() {
  if (highlightBar) {
    removeHighlightBar();
  } else {
    createHighlightBar();
  }
}

function removeHighlightBar() {
  if (highlightBar) {
    highlightBar.remove();
    highlightBar = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopDragOrResize);
    window.removeEventListener('resize', onWindowResize);

    // Remove styles
    const styleTag = document.getElementById('focusbar-styles');
    if (styleTag) styleTag.remove();

    chrome.storage.sync.set({ highlightBarVisible: false });
  }
}

function createHighlightBar() {
  console.log("Creating highlight bar...");

  // Inject styles
  if (!document.getElementById('focusbar-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'focusbar-styles';
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);
  }

  chrome.storage.sync.get({
    highlightBarTop: '0px',
    highlightBarHeight: '100px',
    highlightBarHexColor: '#ffff00',
    highlightBarOpacity: '0.4'
  }, (items) => {
    // Create the highlight bar container
    highlightBar = document.createElement('div');
    highlightBar.classList.add('focusbar-base');
    highlightBar.style.position = 'fixed';
    highlightBar.style.top = items.highlightBarTop;
    highlightBar.style.left = '0';
    highlightBar.style.width = '100%';
    highlightBar.style.height = items.highlightBarHeight;
    highlightBar.style.backgroundColor = `rgba(${hexToRGB(items.highlightBarHexColor)}, ${items.highlightBarOpacity})`;
    highlightBar.style.pointerEvents = 'auto';
    highlightBar.style.cursor = 'grab';
    highlightBar.style.zIndex = '2147483647'; // Max z-index
    highlightBar.style.display = 'flex';
    highlightBar.style.justifyContent = 'flex-end';
    highlightBar.style.alignItems = 'center';
    highlightBar.style.boxSizing = 'border-box';

    // Save visibility state
    chrome.storage.sync.set({ highlightBarVisible: true });

    // Create Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'focusbar-toolbar';

    // Prevent drag propagation on toolbar
    toolbar.addEventListener('mousedown', (e) => e.stopPropagation());

    // 1. Color Picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'focusbar-color';
    colorPicker.value = items.highlightBarHexColor;
    colorPicker.title = "Change Color";

    colorPicker.addEventListener('input', () => {
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${opacitySlider.value})`;
      chrome.storage.sync.set({ highlightBarHexColor: colorPicker.value });
    });

    // 2. Opacity Slider
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.className = 'focusbar-slider';
    opacitySlider.min = '0.1';
    opacitySlider.max = '1';
    opacitySlider.step = '0.05';
    opacitySlider.value = items.highlightBarOpacity;
    opacitySlider.title = "Adjust Opacity";

    opacitySlider.addEventListener('input', () => {
      highlightBar.style.backgroundColor = `rgba(${hexToRGB(colorPicker.value)}, ${opacitySlider.value})`;
      chrome.storage.sync.set({ highlightBarOpacity: opacitySlider.value });
    });

    // 3. Reset Button
    const resetButton = document.createElement('button');
    resetButton.className = 'focusbar-btn';
    resetButton.innerHTML = ICONS.reset;
    resetButton.title = "Reset Settings";

    resetButton.addEventListener('click', () => {
      chrome.storage.sync.remove(['highlightBarTop', 'highlightBarHeight', 'highlightBarHexColor', 'highlightBarOpacity'], () => {
        highlightBar.style.top = '0px';
        highlightBar.style.height = '100px';
        highlightBar.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
        colorPicker.value = '#ffff00';
        opacitySlider.value = '0.4';
      });
    });

    // 4. Close Button
    const closeButton = document.createElement('button');
    closeButton.className = 'focusbar-btn close';
    closeButton.innerHTML = ICONS.close;
    closeButton.title = "Close Bar";

    closeButton.addEventListener('click', () => {
      removeHighlightBar();
    });

    // Assemble Toolbar
    toolbar.appendChild(colorPicker);
    toolbar.appendChild(opacitySlider);
    toolbar.appendChild(resetButton);
    toolbar.appendChild(closeButton);

    highlightBar.appendChild(toolbar);

    // Add resizing handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.left = '0';
    resizeHandle.style.width = '100%';
    resizeHandle.style.height = '10px';
    resizeHandle.style.cursor = 'ns-resize';
    resizeHandle.style.backgroundColor = 'transparent'; // Invisible but clickable
    highlightBar.appendChild(resizeHandle);

    document.body.appendChild(highlightBar);

    // Attach event listeners for drag and resize
    highlightBar.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', startResize);

    window.addEventListener('resize', onWindowResize);
    ensureBarIsVisible(highlightBar);
  });
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

  // Save position
  chrome.storage.sync.set({ highlightBarTop: `${newTop}px` });
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

    // Save new height
    chrome.storage.sync.set({ highlightBarHeight: `${newHeight}px` });
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
  if (message.action === 'toggleHighlightBar') {
    toggleHighlightBar();
    sendResponse({ status: 'Highlight bar toggled' });
  } else if (message.action === 'ping') {
    sendResponse({ status: 'pong' });
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
// Note: This runs when the script is first injected (page load)
chrome.storage.sync.get(['highlightBarVisible'], (result) => {
  if (result.highlightBarVisible) {
    createHighlightBar();
  }
});