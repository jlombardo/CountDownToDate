# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CountDownToDate is a JavaScript utility library that provides countdown timer functionality with multiple format options and display styles. The project includes both a legacy version (v1) using ES5 patterns and a modern version (v2) using ES6+ features.

## Architecture

### Core Components

**Legacy Version (v1)**: `public_html/js/countDownTimer.js`
- Uses namespace pattern `ByteShopJs.util.datetime.CountDownTimer`
- ES5 syntax with module revealing pattern
- Requires specific DOM element IDs for NONE format display

**Modern Version (v2)**: `public_html/js/countDownTimer2.js` 
- ES6+ class-based implementation
- Configuration object pattern for initialization
- Enhanced control methods (pause/resume/stop)
- Callback support (onTick, onComplete)

### Project Structure

```
public_html/           # Main web assets
├── js/               # JavaScript libraries
│   ├── countDownTimer.js   # Version 1 (ES5)
│   └── countDownTimer2.js  # Version 2 (ES6+)
├── css/              # Stylesheets
│   └── main.css      # Sample styling for NONE format display
├── demo*.html        # Various demo implementations
└── index.html        # Main demo with NONE format styling

config/               # Configuration files
└── categories.json   # Documentation categorization

docs/                 # Documentation assets
nbproject/           # NetBeans IDE project files
```

## Display Format Options

- **SHORT**: `02:03:40:23` (padded with leading zeros)
- **MEDIUM**: `2d 3h 40m 23s` (default format)
- **LONG**: `2 days 3 hours 40 minutes 23 seconds` (full words)
- **NONE**: Raw data only, requires custom DOM structure and CSS

## Common Development Tasks

### Running Tests
```bash
open public_html/tests.html          # QUnit suite — 26 tests, V1 + V2
```

### Running Demos
```bash
# Serve the demo files (no build process required)
# Open any demo file directly in browser:
open public_html/index.html          # Main demo with custom styling
open public_html/demo2.html          # Pre-formatted output demo
open public_html/demo_v2.html        # Modern version features
open public_html/demo_comparison.html # Side-by-side V1 vs V2
```

### Working with Version 1 (Legacy)
```javascript
// Basic usage
var counter = new ByteShopJs.util.datetime.CountDownTimer();
counter.startUsingEndDate(endDate, element, "MEDIUM");

// Using seconds instead of date
counter.startUsingSecondsToEndDate(3600, element, "SHORT");
```

### Working with Version 2 (Modern)  
```javascript
// Configuration object approach
const timer = new CountDownTimer({
    endDate: new Date("2025-01-01"),
    element: document.getElementById("display"),
    format: "MEDIUM",
    onTick: (timeParts) => console.log(timeParts),
    onComplete: () => alert("Done!")
});
timer.start();

// Control methods
timer.pause();
timer.resume();
timer.stop();
```

## Key Implementation Details

### Testing
- Framework: QUnit 2.21.0 (CDN, no install required)
- Test file: `public_html/tests.html` — open directly in browser
- 26 tests covering V1 and V2: API shape, all display formats, `calculateTimeParts`, `formatTime`, constructor validation
- V1 tick tests intercept `window.setInterval` to fire synchronously; `#qunit-fixture` provides NONE-format DOM elements

### Version 1 Limitations
- Hard-coded DOM element IDs ("days", "hours", "mins", "secs") when using NONE format
- No pause/resume functionality
- Limited error handling

### Version 2 Improvements
- Flexible element targeting
- Fixed LONG format pluralization bug
- Enhanced control methods
- Better error handling and validation
- Callback system for events
- Modern JavaScript practices

### Format-Specific Requirements

When using **NONE format** (Version 1 only):
- Requires specific HTML structure with IDs: `days`, `hours`, `mins`, `secs`
- Must include `main.css` or equivalent styling
- Updates individual DOM elements rather than single container

## Browser Compatibility

- **Version 1**: Compatible with older browsers (ES5)
- **Version 2**: Requires modern browsers supporting ES6+ features (classes, arrow functions, template literals)

## NetBeans Integration

This is a NetBeans HTML5/JavaScript project with:
- Project files in `nbproject/`
- Public HTML root set to `public_html/`
- Configuration folder mapped to `config/`