# NodePdfGen

Generate interactive PDF notebooks for digital note-taking tablets (Boox Note Air, iPad Pro, etc.).
PDFs include internal hyperlinks for navigation between pages.

## Requirements

- Node.js 18+
- `npm install`

## Quick Start

```bash
node generate.js --template <name> --device <device> --lang <lang>
```

Or via npm:

```bash
npm run gen -- --template todo --device boox-note-air --lang en
```

## Options

| Flag | Short | Default | Description |
|---|---|---|---|
| `--template` | `-t` | *(required)* | Template to generate |
| `--device` | `-d` | `boox-note-air` | Target device / page size |
| `--lang` | `-l` | `en` | Language code |
| `--year` | `-y` | current year | Year (gratitude templates) |
| `--start-sprint` | | `1` | First sprint number (retrospectives) |
| `--no-open` | | | Don't open the PDF after generating |

You can also pass arguments positionally:

```bash
node generate.js todo boox-note-air nl
```

## Templates

| Name | Description |
|---|---|
| `todo` | To-do list with tasks, per-task notes, and subtask pages |
| `meetingnotes` | Meeting notes with summary and action items |
| `gratitude` | Monthly gratitude journal with daily pages |
| `gratitudekato` | Variant of the gratitude journal |
| `retrospectives` | Sprint retrospective log |

## Devices

| Name | Dimensions | Notes |
|---|---|---|
| `boox-note-air` | 460 × 595 pt | Default |
| `ipad-pro` | 595 × 842 pt | A4 |

To add a new device, create `devices/<name>.js`:

```js
export default {
    name: 'My Device',
    pageWidth: 500,
    pageHeight: 650,
};
```

## Languages

Each template ships with English (`en`) and Dutch (`nl`).
To add a language, create `templates/<name>/language/<code>/strings.json`
and copy the keys from an existing language file.

## Output

Generated PDFs are saved to the `outputs/` directory, named:

```
outputs/<template>-<device>-<lang>.pdf
```

## Examples

```bash
# Dutch todo list for Boox Note Air
node generate.js --template todo --device boox-note-air --lang nl

# English gratitude journal for iPad Pro, year 2026
node generate.js --template gratitude --device ipad-pro --lang en --year 2026

# Retrospectives starting from sprint 42
node generate.js --template retrospectives --lang en --start-sprint 42

# Generate without auto-opening the file
node generate.js --template meetingnotes --no-open
```

## Individual template scripts (legacy)

The original per-template scripts still work and default to English / Boox Note Air:

```bash
npm run todo
npm run meetingnotes
npm run gratitude
npm run gratitudekato
npm run retrospectives
```

## Project Structure

```
generate.js                  ← unified CLI entry point
devices/                     ← device definitions (page sizes)
shared/
  ComponentBuilder.js        ← PDF drawing primitives
  Helper.js                  ← utilities
  TableConfig.js             ← table configuration class
templates/
  <name>/
    Config.js                ← singleton config, reads device/lang from env
    index.js                 ← generation logic
    language/
      en/strings.json        ← English UI strings
      nl/strings.json        ← Dutch UI strings
    pages/
      *.js                   ← page builders
outputs/                     ← generated PDFs (gitignored)
```
