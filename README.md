# blurry Chrome Extension

A Chrome extension to blur out spoliers on Youtube!

Write up a list of spoiler-related words like movie titles, characters, or channel names, and start browsing YouTube spoiler free!

## How it works
Manage a list of spoilers in the extension's popup, and any video containing a spoiler in the title or channel name will be blurred out. YouTube's UI remains exactly the same (video grids and lists look the same as before).

## Features
- ✍ Editing, deleting, adding, sorting, and searching your spoilers are all supported in the popup for easy management 
- 🙅 Videos containing spoilers are blurred out
- 👀 Hover over a blurred video for a few seconds to peek at the content

This extension isn't limited to blocking spoilers though, use it to block any unwanted content!

## Setup

Install dependencies
```
$ npm install
```

### Bundling
Bundle code for development
```
$ npm run dev
```

Bundle code for publishing
```
$ npm run build
```

The bundled code will be in the `dist` folder under the root directory.

### Testing

#### Setup the Extension
This is a one-time setup. In the Chrome browser...
1. Go to [chrome://extensions](chrome://extensions)
2. Turn on "Developer mode"
3. Click "Load Unpacked"
4. Select the bundled directory (`dist`)
5. Pin the extension to the toolbar

#### Testing Changes
When testing changes, [bundle](#Bundling) the code, and refresh the extension at [chrome://extensions](chrome://extensions) while in "Developer mode".
