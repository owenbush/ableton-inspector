/**
 * Utility for parsing XML content from Ableton Live Set files.
 */
/**
 * Parse XML content into a JavaScript object.
 *
 * @param xmlContent - The XML content as a string
 * @returns Parsed XML as a JavaScript object
 */
export declare function parseXml(xmlContent: string): any;
/**
 * Helper function to find all elements with a given name in the XML tree.
 * Recursively searches through the object tree.
 *
 * @param obj - The object to search through
 * @param elementName - The element name to find
 * @returns Array of found elements
 */
export declare function findAllElements(obj: any, elementName: string): any[];
/**
 * Helper to safely get a nested property value.
 *
 * @param obj - The object to traverse
 * @param path - Dot-separated path (e.g., "Ableton.LiveSet.MainTrack")
 * @returns The value at the path, or undefined if not found
 */
export declare function getNestedValue(obj: any, path: string): any;
//# sourceMappingURL=xml-parser.d.ts.map