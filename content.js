let highlightBar;
let isDragging = false;
let isResizing = false;
let offsetY = 0;

// Icons
const ICONS = {
  close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  reset: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"></path><path d="M3 5v7h7"></path></svg>`,
  focus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  focusOff: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`,
  play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  speed: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>`
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

  .focusbar-btn.close {
    position: absolute;
    top: -8px;
    right: -8px;
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    width: 20px;
    height: 20px;
    padding: 2px;
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

let autoScrollFrameId;

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
    stopAutoScroll(); // Stop scrolling if active
    highlightBar.remove();
    highlightBar = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopDragOrResize);
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('keydown', onKeyDown);

    // Remove styles
    const styleTag = document.getElementById('focusbar-styles');
    if (styleTag) styleTag.remove();

    chrome.storage.sync.set({ highlightBarVisible: false, autoScrollActive: false });
  }

  // Safety: Remove any zombie bars found in DOM
  const existingBars = document.querySelectorAll('.focusbar-base');
  existingBars.forEach(bar => bar.remove());
}

function showToast(message) {
  let toast = document.getElementById('focusbar-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'focusbar-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(50, 50, 50, 0.9);
      color: white;
      padding: 10px 20px;
      border-radius: 50px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}

function findScrollTarget() {
  // 1. Check if the main document is scrollable
  if (document.documentElement.scrollHeight > window.innerHeight) {
    return window;
  }

  // 2. Search for the largest visible scrollable element
  // Common containers for apps like Google Docs, Gmail, etc.
  const candidates = document.querySelectorAll('div, main, section, article, .kix-appview-editor');
  let bestTarget = window; // Default to window if nothing better found
  let maxArea = 0;

  candidates.forEach(el => {
    // Must have content larger than visible area
    if (el.scrollHeight > el.clientHeight) {
      const style = window.getComputedStyle(el);
      // Must allow scrolling
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        const rect = el.getBoundingClientRect();
        // Must be visible
        if (rect.width > 0 && rect.height > 0) {
          const area = rect.width * rect.height;
          // Prefer larger areas (likely the main content)
          if (area > maxArea) {
            maxArea = area;
            bestTarget = el;
          }
        }
      }
    }
  });

  return bestTarget;
}

function startAutoScroll(speed) {
  if (autoScrollFrameId) cancelAnimationFrame(autoScrollFrameId);

  let accumulator = 0;
  let scrollTarget = findScrollTarget();
  let lastScrollTop = -1;
  let stuckFrames = 0;

  console.log("Auto-scroll target:", scrollTarget === window ? "window" : scrollTarget);

  if (scrollTarget !== window && scrollTarget.scrollHeight <= scrollTarget.clientHeight) {
    showToast("No scrollable content found.");
    return;
  }

  function scroll() {
    // Safety check: stop if bar is closed
    if (!highlightBar) {
      stopAutoScroll();
      return;
    }

    accumulator += speed;
    if (accumulator >= 1) {
      const pixelsToScroll = Math.floor(accumulator);
      const currentScrollTop = scrollTarget === window ? window.scrollY : scrollTarget.scrollTop;

      // Check if we moved since the last successful scroll attempt
      if (lastScrollTop !== -1 && Math.abs(currentScrollTop - lastScrollTop) < 0.5) {
        // We didn't move!
        stuckFrames++;
        // console.warn(`[FocusBar] Stuck detected! Pos: ${currentScrollTop}, StuckFrames: ${stuckFrames}`);

        // Check if we are at the bottom
        const maxScroll = scrollTarget === window
          ? document.documentElement.scrollHeight - window.innerHeight
          : scrollTarget.scrollHeight - scrollTarget.clientHeight;

        if (currentScrollTop < maxScroll - 1) {
          if (stuckFrames > 150) { // ~2.5 seconds
            console.error("[FocusBar] Stuck threshold reached.");

            const newTarget = findScrollTarget();
            if (newTarget !== scrollTarget) {
              console.log("[FocusBar] Switching target to:", newTarget);
              scrollTarget = newTarget;
              lastScrollTop = -1; // Reset tracker
              stuckFrames = 0;
              return;
            }

            showToast("Cannot scroll this page automatically.");
            stopAutoScroll();
            return;
          }
        } else {
          stuckFrames = 0;
        }
      } else {
        stuckFrames = 0;
      }

      lastScrollTop = currentScrollTop;

      if (scrollTarget === window) {
        window.scrollBy(0, pixelsToScroll);
      } else {
        scrollTarget.scrollBy(0, pixelsToScroll);
      }

      accumulator -= pixelsToScroll;
    }
    autoScrollFrameId = requestAnimationFrame(scroll);
  }

  autoScrollFrameId = requestAnimationFrame(scroll);
}

function stopAutoScroll() {
  if (autoScrollFrameId) {
    cancelAnimationFrame(autoScrollFrameId);
    autoScrollFrameId = null;
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
    highlightBarOpacity: '0.4',
    focusModeActive: false,
    focusModeOpacity: '0.5',
    autoScrollActive: false,
    scrollSpeed: 1
  }, (items) => {
    // Cleanup: Remove any existing bars (zombies from previous script instances)
    const existingBars = document.querySelectorAll('.focusbar-base');
    existingBars.forEach(bar => bar.remove());

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

    // Apply Focus Mode if active
    if (items.focusModeActive) {
      highlightBar.style.boxShadow = `0 0 0 9999px rgba(0, 0, 0, ${items.focusModeOpacity})`;
    }

    // Apply Auto-Scroll if active
    if (items.autoScrollActive) {
      startAutoScroll(items.scrollSpeed);
    }

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

    // 3. Auto-Scroll Button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'focusbar-btn';
    scrollButton.innerHTML = items.autoScrollActive ? ICONS.pause : ICONS.play;
    scrollButton.title = "Toggle Auto-Scroll";

    scrollButton.addEventListener('click', () => {
      chrome.storage.sync.get(['autoScrollActive', 'scrollSpeed'], (result) => {
        const newState = !result.autoScrollActive;
        chrome.storage.sync.set({ autoScrollActive: newState });

        if (newState) {
          startAutoScroll(result.scrollSpeed || 1);
          scrollButton.innerHTML = ICONS.pause;
        } else {
          stopAutoScroll();
          scrollButton.innerHTML = ICONS.play;
        }
      });
    });

    // 4. Speed Button
    const speedButton = document.createElement('button');
    speedButton.className = 'focusbar-btn';
    speedButton.innerHTML = `<span style="font-size:10px; font-weight:bold;">${items.scrollSpeed}x</span>`;
    speedButton.title = "Change Scroll Speed";

    speedButton.addEventListener('click', () => {
      chrome.storage.sync.get(['scrollSpeed', 'autoScrollActive'], (result) => {
        let currentSpeed = result.scrollSpeed || 1;
        let newSpeed;

        // Cycle: 0.25 -> 0.5 -> 1 -> 2 -> 3 -> 0.25
        if (currentSpeed === 0.25) newSpeed = 0.5;
        else if (currentSpeed === 0.5) newSpeed = 1;
        else if (currentSpeed === 1) newSpeed = 2;
        else if (currentSpeed === 2) newSpeed = 3;
        else newSpeed = 0.25;

        chrome.storage.sync.set({ scrollSpeed: newSpeed });
        speedButton.innerHTML = `<span style="font-size:10px; font-weight:bold;">${newSpeed}x</span>`;

        if (result.autoScrollActive) {
          startAutoScroll(newSpeed);
        }
      });
    });

    // 5. Focus Mode Button
    const focusButton = document.createElement('button');
    focusButton.className = 'focusbar-btn';
    focusButton.innerHTML = items.focusModeActive ? ICONS.focus : ICONS.focusOff;
    focusButton.title = "Toggle Focus Mode";

    // 5b. Focus Dim Slider
    const focusDimSlider = document.createElement('input');
    focusDimSlider.type = 'range';
    focusDimSlider.className = 'focusbar-slider';
    focusDimSlider.min = '0.1';
    focusDimSlider.max = '1';
    focusDimSlider.step = '0.1';
    focusDimSlider.value = items.focusModeOpacity;
    focusDimSlider.title = "Adjust Background Dimness";
    focusDimSlider.style.width = '60px'; // Slightly smaller
    focusDimSlider.style.display = items.focusModeActive ? 'block' : 'none'; // Only show when active

    focusButton.addEventListener('click', () => {
      chrome.storage.sync.get(['focusModeActive', 'focusModeOpacity'], (result) => {
        const newState = !result.focusModeActive;
        const currentOpacity = result.focusModeOpacity || '0.5';
        chrome.storage.sync.set({ focusModeActive: newState });

        if (newState) {
          highlightBar.style.boxShadow = `0 0 0 9999px rgba(0, 0, 0, ${currentOpacity})`;
          focusButton.innerHTML = ICONS.focus;
          focusDimSlider.style.display = 'block';
        } else {
          highlightBar.style.boxShadow = 'none';
          focusButton.innerHTML = ICONS.focusOff;
          focusDimSlider.style.display = 'none';
        }
      });
    });

    focusDimSlider.addEventListener('input', () => {
      chrome.storage.sync.get(['focusModeActive'], (result) => {
        if (result.focusModeActive) {
          highlightBar.style.boxShadow = `0 0 0 9999px rgba(0, 0, 0, ${focusDimSlider.value})`;
        }
        chrome.storage.sync.set({ focusModeOpacity: focusDimSlider.value });
      });
    });

    // 6. Reset Button
    const resetButton = document.createElement('button');
    resetButton.className = 'focusbar-btn';
    resetButton.innerHTML = ICONS.reset;
    resetButton.title = "Reset Settings";

    resetButton.addEventListener('click', () => {
      chrome.storage.sync.remove(['highlightBarTop', 'highlightBarHeight', 'highlightBarHexColor', 'highlightBarOpacity', 'focusModeActive', 'focusModeOpacity', 'autoScrollActive', 'scrollSpeed'], () => {
        highlightBar.style.top = '0px';
        highlightBar.style.height = '100px';
        highlightBar.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
        highlightBar.style.boxShadow = 'none';
        colorPicker.value = '#ffff00';
        opacitySlider.value = '0.4';
        focusButton.innerHTML = ICONS.focusOff;
        focusDimSlider.value = '0.5';
        focusDimSlider.style.display = 'none';
        stopAutoScroll();
        scrollButton.innerHTML = ICONS.play;
        speedButton.innerHTML = `<span style="font-size:10px; font-weight:bold;">1x</span>`;
      });
    });

    // 7. Close Button
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
    toolbar.appendChild(scrollButton);
    toolbar.appendChild(speedButton);
    toolbar.appendChild(focusButton);
    toolbar.appendChild(focusDimSlider);
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
    document.addEventListener('keydown', onKeyDown);
    ensureBarIsVisible(highlightBar);
  });
}

function removeHighlightBar() {
  if (highlightBar) {
    highlightBar.remove();
    highlightBar = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopDragOrResize);
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('keydown', onKeyDown);

    // Remove styles
    const styleTag = document.getElementById('focusbar-styles');
    if (styleTag) styleTag.remove();

    chrome.storage.sync.set({ highlightBarVisible: false });
  }
}

// ... (rest of the file)

function onKeyDown(event) {
  if (!highlightBar) return;

  const STEP = 10;
  const currentTop = parseInt(highlightBar.style.top || '0', 10);
  const currentHeight = parseInt(highlightBar.style.height || '100px', 10);

  // Escape to close
  if (event.key === 'Escape') {
    removeHighlightBar();
    return;
  }

  // Shift + Arrow Up/Down to Resize
  if (event.shiftKey) {
    if (event.key === 'ArrowUp') {
      const newHeight = Math.max(20, currentHeight - STEP);
      highlightBar.style.height = `${newHeight}px`;
      chrome.storage.sync.set({ highlightBarHeight: `${newHeight}px` });
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      const newHeight = currentHeight + STEP;
      highlightBar.style.height = `${newHeight}px`;
      chrome.storage.sync.set({ highlightBarHeight: `${newHeight}px` });
      event.preventDefault();
    }
    return;
  }

  // Arrow Up/Down to Move
  if (event.key === 'ArrowUp') {
    const newTop = currentTop - STEP;
    highlightBar.style.top = `${newTop}px`;
    chrome.storage.sync.set({ highlightBarTop: `${newTop}px` });
    event.preventDefault();
  } else if (event.key === 'ArrowDown') {
    const newTop = currentTop + STEP;
    highlightBar.style.top = `${newTop}px`;
    chrome.storage.sync.set({ highlightBarTop: `${newTop}px` });
    event.preventDefault();
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