import { getNestedValue } from '../utils/xml-parser.js';

export interface DeviceParameter {
  name: string;
  value: number | string;
}

export interface Device {
  id: number;
  name: string;
  type: 'native' | 'vst' | 'au' | 'max' | 'unknown';
  category: string;
  manufacturer?: string;
  isExpanded: boolean;
  parameters: DeviceParameter[];
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

  const searchForDevices = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
      obj.forEach(item => searchForDevices(item));
    } else {
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

      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !deviceTypes.includes(key)) {
          searchForDevices(obj[key]);
        }
      });
    }
  };

  searchForDevices(xmlRoot);

  const uniqueDevices = devices.filter(
    (device, index, self) =>
      index === self.findIndex(d => d.id === device.id && d.name === device.name)
  );

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

function extractDeviceParameters(device: any): DeviceParameter[] {
  const params: DeviceParameter[] = [];

  const walk = (obj: any, parentKey: string) => {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.Manual && obj.Manual['@_Value'] !== undefined) {
      const value = obj.Manual['@_Value'];
      params.push({ name: parentKey, value });
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${parentKey}[${i}]`));
    } else {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('@_')) continue;
        walk(obj[key], parentKey ? `${parentKey}.${key}` : key);
      }
    }
  };

  walk(device, '');
  return params;
}

function extractDeviceInfo(device: any, deviceType: string): Device | null {
  const id = Number(device['@_Id']);
  const isExpanded = Boolean(getNestedValue(device, 'IsExpanded.@_Value'));

  let name = '';
  let type: Device['type'] = 'unknown';
  let category = '';
  let manufacturer = '';

  const vstInfo = getNestedValue(device, 'PluginDesc.VstPluginInfo');
  if (vstInfo) {
    name = getNestedValue(vstInfo, 'PlugName.@_Value') || '';
    manufacturer = getNestedValue(vstInfo, 'PlugCategory.@_Value') || '';
    type = 'vst';
    category = 'VST Plugin';
  }

  const auInfo = getNestedValue(device, 'PluginDesc.AuPluginInfo');
  if (auInfo) {
    name = getNestedValue(auInfo, 'PlugName.@_Value') || '';
    manufacturer = getNestedValue(auInfo, 'PlugCategory.@_Value') || '';
    type = 'au';
    category = 'AU Plugin';
  }

  const maxInfo = getNestedValue(device, 'PluginDesc.MaxDeviceInfo');
  if (maxInfo) {
    name = getNestedValue(maxInfo, 'PlugName.@_Value') || '';
    type = 'max';
    category = 'Max Device';
  }

  if (!name) {
    const deviceName = getNestedValue(device, 'DeviceName.@_Value');
    if (deviceName) {
      name = deviceName;
      type = 'native';
      category = getDeviceCategory(deviceType);
    }
  }

  if (!name) {
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

  if (!name || name === deviceType) {
    const findNameInDevice = (obj: any, depth = 0): string | null => {
      if (depth > 10) return null;
      if (obj && typeof obj === 'object') {
        if (obj.Name && obj.Name['@_Value'] && obj.Name['@_Value'] !== deviceType) {
          return obj.Name['@_Value'];
        }
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

  if (!name) {
    name = deviceType;
    type = 'native';
    category = getDeviceCategory(deviceType);
  }

  const parameters = extractDeviceParameters(device);

  return {
    id,
    name,
    type,
    category,
    manufacturer: manufacturer || undefined,
    isExpanded,
    parameters,
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
