# FocusBar

FocusBar is a Chrome extension designed to help you focus on reading by highlighting the current line or paragraph while dimming the rest of the page. It overlays a customizable, draggable, and resizable bar on any webpage.

## Features

*   **Focus Mode**: Dim the rest of the page to highlight only the bar area.
*   **Auto-Scroll**: Automatically scroll the page at adjustable speeds (Teleprompter mode).
*   **Draggable & Resizable**: Move the bar anywhere and adjust its height to fit your reading style.
*   **Customizable**:
    *   **Color**: Choose any color for the highlight.
    *   **Opacity**: Adjust bar transparency.
    *   **Dim Level**: Adjust background darkness in Focus Mode (from light dim to pitch black).
*   **Global Settings**: Your preferences are saved via `chrome.storage.sync`, so they persist across all websites and devices.
*   **Keyboard Shortcuts**:
    *   `Alt+Shift+F`: Toggle FocusBar
    *   `Escape`: Close FocusBar
    *   `Arrow Up/Down`: Move Bar
    *   `Shift + Arrow Up/Down`: Resize Bar

## Installation

### From Chrome Web Store (Recommended)
[**Install FocusBar**](https://chromewebstore.google.com/detail/focusbar/gionniolflkjaefibllhfkifmbbjfcan)

### Manual Installation (Developer)
1.  Clone this repository:
    ```bash
    git clone https://github.com/sayhellorob/focusbar.git
    ```
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the directory where you cloned the repository.

## Usage

1.  **Activate**: Click the FocusBar extension icon (or use `Alt+Shift+F`) to toggle the bar.
2.  **Move**: Click and drag anywhere on the bar to move it.
3.  **Resize**: Click and drag the bottom edge of the bar to resize it.
4.  **Customize**: Hover over the bar to reveal the toolbar:
    *   **Color Circle**: Change bar color.
    *   **Left Slider**: Adjust bar opacity.
    *   **Play/Pause**: Start/Stop auto-scroll.
    *   **Speed (1x)**: Cycle scroll speeds (0.25x, 0.5x, 1x, 2x, 3x).
    *   **Eye Icon**: Toggle Focus Mode (dim background).
    *   **Right Slider**: Adjust background dimness (only visible in Focus Mode).
    *   **Reset**: Restore default settings.
    *   **X**: Close the bar.

## Privacy

FocusBar runs entirely on your device. It does not collect or transmit any personal data. Settings are synced using your Chrome account's built-in storage.

## License

MIT
