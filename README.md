# FocusBar

FocusBar is a Chrome extension designed to help you focus on reading by highlighting the current line or paragraph while dimming the rest of the page. It overlays a customizable, draggable, and resizable bar on any webpage.

## Features

*   **Focus Highlight**: Isolate text to reduce distractions.
*   **Draggable & Resizable**: Move the bar anywhere and adjust its height to fit your reading style.
*   **Customizable**:
    *   **Color**: Choose any color for the highlight.
    *   **Opacity**: Adjust transparency to your liking.
*   **Global Settings**: Your preferences are saved via `chrome.storage.sync`, so they persist across all websites and devices.
*   **Modern UI**: Sleek, floating toolbar with intuitive controls.

## Installation

1.  Clone this repository:
    ```bash
    git clone https://github.com/sayhellorob/focusbar.git
    ```
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the directory where you cloned the repository.

## Usage

1.  **Activate**: Click the FocusBar extension icon in your browser toolbar to toggle the bar ON/OFF.
2.  **Move**: Click and drag anywhere on the bar to move it.
3.  **Resize**: Click and drag the bottom edge of the bar to resize it.
4.  **Customize**: Hover over the bar to reveal the toolbar on the right:
    *   **Color Circle**: Click to change the bar color.
    *   **Slider**: Drag to adjust opacity.
    *   **Refresh Icon**: Reset settings to default (Yellow, medium opacity).
    *   **X Icon**: Close the bar.

## Privacy

FocusBar runs entirely on your device. It does not collect or transmit any personal data. Settings are synced using your Chrome account's built-in storage.

## License

MIT
