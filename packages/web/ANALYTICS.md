# Analytics Implementation

This document describes the Google Analytics events tracked in the Ableton
Inspector web application.

## Overview

The application uses Google Tag Manager (GTM) to track user interactions
without collecting any sensitive data from .als files. All events are sent
via the `window.dataLayer` API.

## Events Tracked

### 1. File Upload (`file_upload`)

Triggered when a user selects or drops an .als file into the upload area.

**Parameters:**
- `file_size_mb`: File size in megabytes (rounded to 2 decimals).
- `file_type`: Always `'als'`.

**Example:**
```javascript
{
  event: 'file_upload',
  file_size_mb: '12.45',
  file_type: 'als'
}
```

### 2. File Analysis (`file_analysis`)

Triggered when a file is successfully analyzed.

**Parameters:**
- `file_size_mb`: File size in megabytes (rounded to 2 decimals).
- `processing_time_ms`: Time taken to process the file in milliseconds.
- `extract_tempo`: Whether tempo extraction was enabled (boolean).
- `extract_scale`: Whether scale extraction was enabled (boolean).
- `extract_samples`: Whether sample extraction was enabled (boolean).
- `extract_locators`: Whether locator extraction was enabled (boolean).
- `extract_time_signature`: Whether time signature extraction was enabled
  (boolean).
- `extract_track_types`: Whether track type extraction was enabled (boolean).
- `splice_only`: Whether "Splice only" filter was enabled (boolean).
- `show_all_samples`: Whether "Show all samples" option was enabled (boolean).
- `has_custom_paths`: Whether custom Splice paths were configured (boolean).

**Example:**
```javascript
{
  event: 'file_analysis',
  file_size_mb: '12.45',
  processing_time_ms: 1234,
  extract_tempo: true,
  extract_scale: true,
  extract_samples: true,
  extract_locators: true,
  extract_time_signature: true,
  extract_track_types: true,
  splice_only: false,
  show_all_samples: false,
  has_custom_paths: false
}
```

### 3. Analysis Error (`analysis_error`)

Triggered when file analysis fails.

**Parameters:**
- `error_message`: The error message describing what went wrong.
- `file_size_mb`: File size in megabytes (if available).

**Example:**
```javascript
{
  event: 'analysis_error',
  error_message: 'Invalid file format',
  file_size_mb: '12.45'
}
```

## Privacy Considerations

**What we DO NOT collect:**
- File names or paths.
- Content of .als files.
- Musical data (tempo values, scales, sample names, etc.).
- Personally identifiable information.

**What we DO collect:**
- File sizes (for performance analysis).
- Processing times (for performance optimization).
- Feature usage (which extraction options users prefer).
- Error messages (to identify and fix issues).

All data collection is anonymous and aggregated. The application processes
files entirely in the browser, and no .als file data is ever sent to any
server.

## Viewing Events in Google Analytics

### In Google Analytics 4 (GA4):

1. Go to your GA4 property.
2. Navigate to **Reports** → **Engagement** → **Events**.
3. Look for custom events:
   - `file_upload`
   - `file_analysis`
   - `analysis_error`

### In Google Tag Manager (GTM):

1. Go to your GTM container.
2. Click **Preview** mode.
3. Navigate to your site and perform actions.
4. View the events in the **Summary** panel.

## Setting Up Custom Reporting

### Example: Popular Feature Combinations

Create a custom report to see which extraction options users enable together:

1. In GA4, go to **Explore** → **Free form**.
2. Add dimensions:
   - `extract_tempo`
   - `extract_scale`
   - `extract_samples`
3. Add metrics: `Event count`.

### Example: Performance Metrics

Track processing times by file size:

1. In GA4, go to **Explore** → **Free form**.
2. Add dimensions: `file_size_mb`.
3. Add metrics: `processing_time_ms` (average).

## Implementation Details

See `/src/lib/analytics.ts` for the tracking implementation.

The tracking functions are called in:
- **File upload**: `FileUploader.tsx` → `onDrop()` callback.
- **File analysis**: `FileUploader.tsx` → `processFile()` callback.
- **Analysis errors**: `FileUploader.tsx` → `processFile()` catch block.

## Testing

In development mode, all analytics events are logged to the browser console
with the `[Analytics]` prefix. This allows you to verify events are being
sent correctly without affecting production analytics.

To test:
1. Open the browser console.
2. Upload and analyze a file.
3. Look for `[Analytics]` log messages.

