import { getNestedValue } from '../utils/xml-parser.js';

export interface Device {
  id: number;
  name: string;
  type: 'native' | 'vst' | 'au' | 'max' | 'unknown';
  category: string;
  manufacturer?: string;
  isExpanded: boolean;
}

export interface DevicesData {
  devices: Device[];
  summary: {
    native: number;
    vst: number;
    au: number;
    max: number;
    total: number;
  };
}

export function extractDevices(xmlRoot: any): DevicesData {
  const devices: Device[] = [];

  // Search for devices in all tracks
  const searchForDevices = (obj: any, path: string = '') => {
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => searchForDevices(item, `${path}[${index}]`));
    } else {
      // Check for various device types
      const deviceTypes = [
        'PluginDevice',
        'MidiDevice',
        'AudioEffectGroupDevice',
        'AudioEffectRackDevice',
        'MidiEffectGroupDevice',
        'MidiEffectRackDevice',
        'InstrumentGroupDevice',
        'InstrumentRackDevice',
        'MaxAudioEffectDevice',
        'MaxMidiEffectDevice',
        'MaxInstrumentDevice',
      ];

      for (const deviceType of deviceTypes) {
        if (obj[deviceType]) {
          const deviceArray = Array.isArray(obj[deviceType]) ? obj[deviceType] : [obj[deviceType]];

          for (const device of deviceArray) {
            if (device && device['@_Id']) {
              const deviceInfo = extractDeviceInfo(device, deviceType);
              if (deviceInfo) {
                devices.push(deviceInfo);
              }
            }
          }
        }
      }

      // Recursively search nested objects
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !deviceTypes.includes(key)) {
          searchForDevices(obj[key], `${path}.${key}`);
        }
      });
    }
  };

  searchForDevices(xmlRoot);

  // Remove duplicates based on ID and name
  const uniqueDevices = devices.filter(
    (device, index, self) =>
      index === self.findIndex(d => d.id === device.id && d.name === device.name)
  );

  // Calculate summary
  const summary = {
    native: uniqueDevices.filter(d => d.type === 'native').length,
    vst: uniqueDevices.filter(d => d.type === 'vst').length,
    au: uniqueDevices.filter(d => d.type === 'au').length,
    max: uniqueDevices.filter(d => d.type === 'max').length,
    total: uniqueDevices.length,
  };

  return {
    devices: uniqueDevices,
    summary,
  };
}

function extractDeviceInfo(device: any, deviceType: string): Device | null {
  const id = Number(device['@_Id']);
  const isExpanded = Boolean(getNestedValue(device, 'IsExpanded.@_Value'));

  // Try to get device name from various possible locations
  let name = '';
  let type: Device['type'] = 'unknown';
  let category = '';
  let manufacturer = '';

  // Check for VST plugin info
  const vstInfo = getNestedValue(device, 'PluginDesc.VstPluginInfo');
  if (vstInfo) {
    name = getNestedValue(vstInfo, 'PlugName.@_Value') || '';
    manufacturer = getNestedValue(vstInfo, 'PlugCategory.@_Value') || '';
    type = 'vst';
    category = 'VST Plugin';
  }

  // Check for AU plugin info
  const auInfo = getNestedValue(device, 'PluginDesc.AuPluginInfo');
  if (auInfo) {
    name = getNestedValue(auInfo, 'PlugName.@_Value') || '';
    manufacturer = getNestedValue(auInfo, 'PlugCategory.@_Value') || '';
    type = 'au';
    category = 'AU Plugin';
  }

  // Check for Max device info
  const maxInfo = getNestedValue(device, 'PluginDesc.MaxDeviceInfo');
  if (maxInfo) {
    name = getNestedValue(maxInfo, 'PlugName.@_Value') || '';
    type = 'max';
    category = 'Max Device';
  }

  // Check for native Ableton device info
  if (!name) {
    const deviceName = getNestedValue(device, 'DeviceName.@_Value');
    if (deviceName) {
      name = deviceName;
      type = 'native';
      category = getDeviceCategory(deviceType);
    }
  }

  // Check for device name in various other locations
  if (!name) {
    // Look for Name elements with Value attributes in nested structures
    const namePaths = [
      'Name.@_Value',
      'DeviceName.@_Value',
      'PlugName.@_Value',
      'PluginDesc.VstPluginInfo.PlugName.@_Value',
      'PluginDesc.AuPluginInfo.PlugName.@_Value',
      'PluginDesc.MaxDeviceInfo.PlugName.@_Value',
    ];

    for (const namePath of namePaths) {
      const nameValue = getNestedValue(device, namePath);
      if (nameValue && nameValue !== deviceType && nameValue.length > 0) {
        name = nameValue;
        type = 'native';
        category = getDeviceCategory(deviceType);
        break;
      }
    }
  }

  // If still no name, try to find it in the device's nested structure
  if (!name || name === deviceType) {
    // Look for any Name element with a meaningful value in the entire device tree
    const findNameInDevice = (obj: any, depth = 0): string | null => {
      if (depth > 10) return null; // Prevent infinite recursion

      if (obj && typeof obj === 'object') {
        // Check if this object has a Name with Value
        if (obj.Name && obj.Name['@_Value'] && obj.Name['@_Value'] !== deviceType) {
          return obj.Name['@_Value'];
        }

        // Recursively search in nested objects
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            const found = findNameInDevice(obj[key], depth + 1);
            if (found) return found;
          }
        }
      }
      return null;
    };

    const foundName = findNameInDevice(device);
    if (foundName) {
      name = foundName;
      type = 'native';
      category = getDeviceCategory(deviceType);
    }
  }

  // Fallback to device type if no name found
  if (!name) {
    name = deviceType;
    type = 'native';
    category = getDeviceCategory(deviceType);
  }

  return {
    id,
    name,
    type,
    category,
    manufacturer: manufacturer || undefined,
    isExpanded,
  };
}

function getDeviceCategory(deviceType: string): string {
  const categories: Record<string, string> = {
    PluginDevice: 'Plugin',
    MidiDevice: 'MIDI Device',
    AudioEffectGroupDevice: 'Audio Effect Group',
    AudioEffectRackDevice: 'Audio Effect Rack',
    MidiEffectGroupDevice: 'MIDI Effect Group',
    MidiEffectRackDevice: 'MIDI Effect Rack',
    InstrumentGroupDevice: 'Instrument Group',
    InstrumentRackDevice: 'Instrument Rack',
    MaxAudioEffectDevice: 'Max Audio Effect',
    MaxMidiEffectDevice: 'Max MIDI Effect',
    MaxInstrumentDevice: 'Max Instrument',
  };

  return categories[deviceType] || 'Unknown Device';
}
