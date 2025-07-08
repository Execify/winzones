import { writeFileSync } from 'fs';
import { join } from 'path';
import * as cldrData from 'cldr-core/supplemental/windowsZones.json';
import { Schema } from 'effect';

const WindowsZones = Schema.Struct({
    supplemental: Schema.Struct({
        version: Schema.Struct({
            _unicodeVersion: Schema.String,
            _cldrVersion: Schema.String,
        }),
        windowsZones: Schema.Struct({
            mapTimezones: Schema.Array(
                Schema.Struct({
                    mapZone: Schema.Struct({
                        windowsZone: Schema.String.pipe(
                            Schema.propertySignature,
                            Schema.fromKey('_other'),
                        ),
                        ianaZones: Schema.compose(
                            Schema.Trim,
                            Schema.split(' '),
                        ).pipe(
                            Schema.propertySignature,
                            Schema.fromKey('_type'),
                        ),
                    }),
                }),
            ),
        }),
    }),
});
const parseWindowsZones = Schema.decodeUnknownSync(WindowsZones);

function generateTimezoneData() {
    // Use the imported data
    const data = parseWindowsZones(cldrData);

    // Create mappings
    const ianaToWindows: Record<string, string> = {};

    // Process each mapping
    for (const {
        mapZone: { windowsZone, ianaZones },
    } of data.supplemental.windowsZones.mapTimezones) {
        // For each IANA zone, map to Windows zone
        for (const ianaZone of ianaZones) {
            if (
                ianaToWindows[ianaZone] &&
                ianaToWindows[ianaZone] !== windowsZone
            ) {
                throw new Error(
                    `Duplicate mapping for IANA zone ${ianaZone}, maps to both ${ianaToWindows[ianaZone]} and ${windowsZone}`,
                );
            }
            ianaToWindows[ianaZone] = windowsZone;
        }
    }

    // Sort the entries alphabetically by IANA timezone name
    const sortedEntries = Object.fromEntries(
        Array.from(Object.entries(ianaToWindows)).sort(([a], [b]) =>
            a.localeCompare(b),
        ),
    );

    // Generate the TypeScript file content
    const tsContent = `// Generated from CLDR data - do not edit manually
// Unicode version: ${data.supplemental.version._unicodeVersion}
// CLDR version: ${data.supplemental.version._cldrVersion}
//
// This data is derived from the Unicode Common Locale Data Repository (CLDR).
// Copyright © 1991-${new Date().getFullYear()} Unicode, Inc. All rights reserved.
// Distributed under the Terms of Use in https://www.unicode.org/copyright.html

export const ianaToWindowsMap: Record<string, string> = Object.assign(Object.create(null), ${JSON.stringify(sortedEntries)});

export const windowsToIanaMap: Record<string, string[]> = (() => {
    const reverseMap = Object.create(null);
    for (const [iana, windows] of Object.entries(ianaToWindowsMap)) {
        const existing = reverseMap[windows];
        if (existing) {
            existing.push(iana);
        } else {
            reverseMap[windows] = [iana];
        }
    }
    return reverseMap;
})();
`;

    // Write the generated file
    const outputPath = join(__dirname, '..', 'src', 'timezone-data.ts');
    writeFileSync(outputPath, tsContent);

    console.log('Timezone data generated successfully!');
    console.log(`- ${ianaToWindows.size} IANA zones mapped`);
}

// Run the generation
generateTimezoneData();
