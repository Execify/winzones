import { writeFileSync } from 'fs';
import { join } from 'path';
import * as cldrData from 'cldr-core/supplemental/windowsZones.json';
import { Schema } from 'effect';

const IanaWindowsMap = Schema.MapFromRecord({
    key: Schema.String,
    value: Schema.String,
});

const ianaWindowsMapToJson = Schema.encodeSync(
    Schema.parseJson(IanaWindowsMap),
);

interface MapZone {
    _other: string; // Windows timezone name
    _type: string; // IANA timezone(s) - space separated
    _territory: string; // Territory code
}

interface WindowsZonesData {
    supplemental: {
        version: {
            _unicodeVersion: string;
            _cldrVersion: string;
        };
        windowsZones: {
            mapTimezones: Array<{
                mapZone: MapZone;
            }>;
        };
    };
}

function generateTimezoneData() {
    // Use the imported data
    const data = cldrData as WindowsZonesData;

    // Create mappings
    const ianaToWindows: typeof IanaWindowsMap.Type = new Map();

    // Process each mapping
    for (const { mapZone } of data.supplemental.windowsZones.mapTimezones) {
        const windowsZone = mapZone._other;
        const ianaZones = mapZone._type.trim().split(' ');

        // For each IANA zone, map to Windows zone
        for (const ianaZone of ianaZones) {
            if (!ianaZone) {
                console.log('WIRD TIMEZONE', mapZone);
            }
            if (
                ianaToWindows.has(ianaZone) &&
                ianaToWindows.get(ianaZone) !== windowsZone
            ) {
                throw new Error(
                    `Duplicate mapping for IANA zone ${ianaZone}, maps to both ${ianaToWindows.get(ianaZone)} and ${windowsZone}`,
                );
            }
            ianaToWindows.set(ianaZone, windowsZone);
        }
    }

    // Generate the TypeScript file content
    const tsContent = `// Generated from CLDR data - do not edit manually
// CLDR version: ${data.supplemental.version._cldrVersion}
//
// This data is derived from the Unicode Common Locale Data Repository (CLDR).
// Copyright © 1991-${new Date().getFullYear()} Unicode, Inc. All rights reserved.
// Distributed under the Terms of Use in https://www.unicode.org/copyright.html

export const ianaToWindowsMap: Record<string, string> = Object.assign(Object.create(null), ${ianaWindowsMapToJson(ianaToWindows)});

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
