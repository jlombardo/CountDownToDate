# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CountDownToDate is a vanilla JavaScript countdown timer library with no build system, no package manager. Files are opened directly in a browser. Tests use QUnit loaded from CDN.

## Running Tests

```bash
open public_html/tests.html           # QUnit suite — 26 tests, V1 + V2
```

## Running Demos

```bash
open public_html/index.html           # NONE format with custom CSS styling
open public_html/demo2.html           # Pre-formatted output (MEDIUM format)
open public_html/demo_v2.html         # V2 features demo
open public_html/demo_comparison.html # Side-by-side V1 vs V2
```

## Architecture

Two implementations live side-by-side:

**V1** (`public_html/js/countDownTimer.js`) — ES5, revealing module pattern under the `ByteShopJs.util.datetime` namespace. Uses `window.setInterval`. The `NONE` format hard-codes DOM element IDs (`days`, `hours`, `mins`, `secs`) and requires the specific HTML structure shown in `public_html/index.html` plus `public_html/css/main.css`.

**V2** (`public_html/js/countDownTimer2.js`) — ES6+ class `CountDownTimer`. Takes a single config object: `{ endDate, secondsToEnd, element, format, onTick, onComplete }`. Supports `pause()`, `resume()`, and `stop()`. Does not implement `NONE` format.

## Display Formats

| Format | Example output |
|--------|----------------|
| `SHORT` | `02:03:40:23` |
| `MEDIUM` | `2d 3h 40m 23s` (default) |
| `LONG` | `2 days 3 hours 40 minutes 23 seconds` |
| `NONE` | Raw values — V1 only, requires specific DOM IDs |

## Testing Notes

- Test file: `public_html/tests.html` — open directly in browser, no server needed
- Framework: QUnit 2.21.0 loaded from CDN (`code.jquery.com`)
- V1 format tests intercept `window.setInterval` in a `beforeEach` hook to fire ticks synchronously
- `#qunit-fixture` provides the NONE-format DOM elements (`days`, `hours`, `mins`, `secs`); QUnit resets it before each test

## NONE Format DOM Requirements (V1)

When using `format: "NONE"` with V1, the page must contain elements with these exact IDs:
```html
<li id="days"></li>
<li id="hours"></li>
<li id="mins"></li>
<li id="secs"></li>
```
