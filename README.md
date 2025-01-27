# FocusBar

FocusBar is a lightweight Chrome extension designed to enhance your browsing experience by allowing you to add a customizable highlight bar overlay to any webpage. This extension helps users stay focused on specific sections of content while scrolling through a page.

---

## Features

- **Customizable Highlight Bar**: Adds a movable and resizable bar to the webpage to visually focus on specific sections.
- **On-Demand Activation**: The extension operates only when triggered by the user.
- **Drag-and-Drop Functionality**: Move the bar vertically across the page as needed.
- **Height Adjustment**: Resize the bar to suit your preferences.
- **Close Button**: Quickly toggle off the highlight bar with a user-friendly close button.
- **Lightweight Design**: FocusBar runs entirely locally within your browser, ensuring minimal resource usage.
- **Privacy-First**: No data collection, tracking, or external API calls.

---

## How It Works

1. Install the extension from the Chrome Web Store (or load it locally for development).
2. Click the extension icon in the browser toolbar to open the popup.
3. Click the **Toggle Highlight Bar** button to activate the bar.
4. Use drag-and-drop or resizing to adjust the bar to your desired position and size.
5. Hover over the bar to reveal the close button and disable it as needed.

---

## Installation

### From the Chrome Web Store
Coming soon!

### For Development
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/focusbar.git
   ```
2. Open your browser and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `focusbar` folder.
5. The extension will be loaded locally.

---

## Project Structure

```
FocusBar/
├── manifest.json       # Extension configuration and permissions
├── popup.html          # Popup UI
├── popup.js            # Logic for popup interactions
├── content.js          # Script injected into webpages for bar functionality
├── background.js       # Background script (currently minimal use)
├── icons/              # Icons for the extension
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
```

---

## Privacy Policy

FocusBar does not collect, store, or transmit any personal or browsing data. All functionality is performed locally within your browser. For more details, view the full [Privacy Policy](https://docs.google.com/document/d/YOUR_DOCUMENT_ID/preview).

---

## Contributing

We welcome contributions to improve FocusBar! To get started:
1. Fork this repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

If you have questions, suggestions, or issues, feel free to open an issue in this repository or contact us at **[Your Contact Email]**.

---

Thank you for using FocusBar! 🚀
