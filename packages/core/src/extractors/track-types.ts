import { getNestedValue } from '../utils/xml-parser.js';

export interface Track {
  id: number;
  type: 'audio' | 'midi' | 'return' | 'master';
  name: string;
  userDefinedName: string;
  color: number;
  annotation: string;
}

export interface TrackTypesData {
  tracks: Track[];
  summary: {
    audio: number;
    midi: number;
    return: number;
    master: number;
    total: number;
  };
}

export function extractTrackTypes(xmlRoot: any): TrackTypesData {
  const tracks: Track[] = [];

  // Extract Audio Tracks
  const audioTracks = getNestedValue(xmlRoot, 'Ableton.LiveSet.Tracks.AudioTrack');
  if (audioTracks) {
    const audioArray = Array.isArray(audioTracks) ? audioTracks : [audioTracks];
    for (const track of audioArray) {
      if (track && track['@_Id']) {
        tracks.push({
          id: Number(track['@_Id']),
          type: 'audio',
          name: getNestedValue(track, 'Name.EffectiveName.@_Value') || '',
          userDefinedName: getNestedValue(track, 'Name.UserName.@_Value') || '',
          color: Number(getNestedValue(track, 'Color.@_Value') || 0),
          annotation: getNestedValue(track, 'Name.Annotation.@_Value') || ''
        });
      }
    }
  }

  // Extract MIDI Tracks
  const midiTracks = getNestedValue(xmlRoot, 'Ableton.LiveSet.Tracks.MidiTrack');
  if (midiTracks) {
    const midiArray = Array.isArray(midiTracks) ? midiTracks : [midiTracks];
    for (const track of midiArray) {
      if (track && track['@_Id']) {
        tracks.push({
          id: Number(track['@_Id']),
          type: 'midi',
          name: getNestedValue(track, 'Name.EffectiveName.@_Value') || '',
          userDefinedName: getNestedValue(track, 'Name.UserName.@_Value') || '',
          color: Number(getNestedValue(track, 'Color.@_Value') || 0),
          annotation: getNestedValue(track, 'Name.Annotation.@_Value') || ''
        });
      }
    }
  }

  // Extract Return Tracks (they're under Tracks, not ReturnTracks)
  const returnTracks = getNestedValue(xmlRoot, 'Ableton.LiveSet.Tracks.ReturnTrack');
  if (returnTracks) {
    const returnArray = Array.isArray(returnTracks) ? returnTracks : [returnTracks];
    for (const track of returnArray) {
      if (track && track['@_Id']) {
        tracks.push({
          id: Number(track['@_Id']),
          type: 'return',
          name: getNestedValue(track, 'Name.EffectiveName.@_Value') || '',
          userDefinedName: getNestedValue(track, 'Name.UserName.@_Value') || '',
          color: Number(getNestedValue(track, 'Color.@_Value') || 0),
          annotation: getNestedValue(track, 'Name.Annotation.@_Value') || ''
        });
      }
    }
  }

  // Extract Master Track (it's actually a PreHearTrack with name "Master")
  const preHearTrack = getNestedValue(xmlRoot, 'Ableton.LiveSet.PreHearTrack');
  if (preHearTrack) {
    const masterName = getNestedValue(preHearTrack, 'Name.EffectiveName.@_Value');
    if (masterName === 'Master') {
      tracks.push({
        id: 0, // Master track typically has ID 0
        type: 'master',
        name: masterName,
        userDefinedName: getNestedValue(preHearTrack, 'Name.UserName.@_Value') || '',
        color: Number(getNestedValue(preHearTrack, 'Color.@_Value') || 0),
        annotation: getNestedValue(preHearTrack, 'Name.Annotation.@_Value') || ''
      });
    }
  }

  // Calculate summary
  const summary = {
    audio: tracks.filter(t => t.type === 'audio').length,
    midi: tracks.filter(t => t.type === 'midi').length,
    return: tracks.filter(t => t.type === 'return').length,
    master: tracks.filter(t => t.type === 'master').length,
    total: tracks.length
  };

  return {
    tracks,
    summary
  };
}
