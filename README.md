# winzones

> A TypeScript library for mapping between IANA and Windows time zones

[![npm version](https://img.shields.io/npm/v/winzones.svg)](https://www.npmjs.com/package/winzones)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Installation

```bash
npm install winzones
```

## Usage

```typescript
import { mapIanaToWindows, mapWindowsToIana } from 'winzones';

// Convert IANA timezone to Windows
const windowsZone = mapIanaToWindows('America/New_York');
console.log(windowsZone); // 'Eastern Standard Time'

// Convert Windows timezone to IANA (returns array as one Windows zone can map to multiple IANA zones)
const ianaZones = mapWindowsToIana('Eastern Standard Time');
console.log(ianaZones); // ['America/New_York', 'America/Detroit', 'America/Toronto', ...]
```

## API

### `mapIanaToWindows(ianaTimezone: string): string`

Converts an IANA timezone identifier to its Windows timezone equivalent.

- **Parameters**: `ianaTimezone` - IANA timezone identifier (e.g., 'America/New_York')
- **Returns**: Windows timezone name (e.g., 'Eastern Standard Time')

### `mapWindowsToIana(windowsTimezone: string): string[]`

Converts a Windows timezone to its IANA timezone equivalents.

- **Parameters**: `windowsTimezone` - Windows timezone name (e.g., 'Eastern Standard Time')
- **Returns**: Array of IANA timezone identifiers

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
```

## License

MIT © [Execify](https://github.com/Execify)

## Author

James Birtles <james.birtles@execify.ai>
