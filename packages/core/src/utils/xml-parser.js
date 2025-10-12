/**
 * Utility for parsing XML content from Ableton Live Set files.
 */
import { XMLParser } from 'fast-xml-parser';
/**
 * Parse XML content into a JavaScript object.
 *
 * @param xmlContent - The XML content as a string
 * @returns Parsed XML as a JavaScript object
 */
export function parseXml(xmlContent) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true,
        allowBooleanAttributes: true,
    });
    try {
        return parser.parse(xmlContent);
    }
    catch (error) {
        throw new Error(`Failed to parse XML content: ${error}`);
    }
}
/**
 * Helper function to find all elements with a given name in the XML tree.
 * Recursively searches through the object tree.
 *
 * @param obj - The object to search through
 * @param elementName - The element name to find
 * @returns Array of found elements
 */
export function findAllElements(obj, elementName) {
    const results = [];
    function search(current) {
        if (!current || typeof current !== 'object') {
            return;
        }
        // Check if this object has the element we're looking for
        if (current[elementName]) {
            const element = current[elementName];
            if (Array.isArray(element)) {
                results.push(...element);
            }
            else {
                results.push(element);
            }
        }
        // Recursively search all properties
        for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key) && typeof current[key] === 'object') {
                search(current[key]);
            }
        }
    }
    search(obj);
    return results;
}
/**
 * Helper to safely get a nested property value.
 *
 * @param obj - The object to traverse
 * @param path - Dot-separated path (e.g., "Ableton.LiveSet.MainTrack")
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current?.[key];
    }, obj);
}
//# sourceMappingURL=xml-parser.js.map