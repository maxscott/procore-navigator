# Procore Navigator

![demo1-small](https://user-images.githubusercontent.com/1237203/208167332-602e3338-0c7f-4508-aaf6-af9cf3f648f6.gif)

Navigate Procore at lightning speed with a couple keystrokes.

This project uses [Vite](https://vitejs.dev/) and [crxjs](https://crxjs.dev/vite-plugin) to build the extension.

## Development

### Clone repository
```sh
git clone git@github.com:maxscott/procore-navigator.git
```

### Install dependencies

```sh
yarn
```

### Build extension

```
yarn build
```

### Load extension

1. Navigate to [chrome://extensions/](chrome://extensions/)
1. Turn on the "Developer mode" toggle switch in the top right of the window
1. Click the "Load unpacked" button in top left of the window
1. Go to the `react-content-script` directory and select the `dist` directory to load the extension
1. Navigate to https://blank.org/ to see the Content Script React app
1. Go to extensions and click "React TypeScript Chrome Extension" to see the Popup React app

## [Popup](https://developer.chrome.com/docs/extensions/mv3/user_interface/#popup)

The popup source code is at the root directory.

## [Content Script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

The content script source code is in the `content-script` directory.

## Background

This repository was based on the work described in the blog post [How to inject a React app into a Chrome Extension as a Content Script](https://medium.com/@yosevu/how-to-inject-a-react-app-into-a-chrome-extension-as-a-content-script-3a038f611067). 
