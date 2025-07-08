# winzones

> A TypeScript library for mapping between IANA and Windows time zones

[![npm version](https://img.shields.io/npm/v/winzones.svg)](https://www.npmjs.com/package/winzones)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Data Source

This library uses timezone mapping data from the [Unicode Common Locale Data Repository (CLDR)](https://cldr.unicode.org/), specifically the Windows timezone mappings. The data is regularly updated to reflect the latest timezone changes and Windows zone mappings.

We update this data regularly with new CLDR releases to ensure accuracy and completeness.

## Installation

```bash
npm install winzones
```

## Usage

```typescript
import { findWindowsFromIana, findIanaFromWindows } from 'winzones';

// Convert IANA timezone to Windows
const windowsZone = findWindowsFromIana('America/New_York');
console.log(windowsZone); // 'Eastern Standard Time'

// Convert Windows timezone to IANA (returns array as one Windows zone can map to multiple IANA zones)
const ianaZones = findIanaFromWindows('Eastern Standard Time');
console.log(ianaZones); // ['America/New_York', 'America/Detroit', 'America/Toronto', ...]

// Handle cases where timezone is not found
const unknownZone = findWindowsFromIana('Invalid/Timezone');
console.log(unknownZone); // undefined
```

## API

### `findWindowsFromIana(ianaTimezone: string): string | undefined`

Finds the Windows timezone equivalent for an IANA timezone identifier.

- **Parameters**: `ianaTimezone` - IANA timezone identifier (e.g., 'America/New_York')
- **Returns**: Windows timezone name (e.g., 'Eastern Standard Time') or `undefined` if not found

### `findIanaFromWindows(windowsTimezone: string): string[] | undefined`

Finds the IANA timezone equivalents for a Windows timezone.

- **Parameters**: `windowsTimezone` - Windows timezone name (e.g., 'Eastern Standard Time')
- **Returns**: Array of IANA timezone identifiers or `undefined` if not found

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the library
npm run build

# Type check
npm run typecheck

# Regenerate timezone data from CLDR
npm run generate
```

## License

MIT © [Execify](https://github.com/Execify)

## Author

James Birtles <james.birtles@execify.ai>
