
import { WYRESTORM_PRODUCT_DATABASE } from './components/productDatabase';

export const ROOM_TYPES = [
  'Huddle Space',
  'Small Conference Room',
  'Medium Conference Room',
  'Large Conference Room / Boardroom',
  'Training Room / Classroom',
  'Auditorium / All-Hands Space',
  'Digital Signage',
  'Custom',
];


// --- Dynamically Generated Constants from Product Database ---
const allConnectivity = WYRESTORM_PRODUCT_DATABASE.flatMap(p => p.connectivity);

// Get all unique port names for a given type ('input' or 'output')
const getUniquePorts = (type: 'input' | 'output'): string[] => {
  const ports = new Set<string>();
  allConnectivity.forEach(conn => {
    if (conn.type === type && conn.port) {
      ports.add(conn.port);
    }
  });
  return Array.from(ports);
};

const allInputPorts = getUniquePorts('input');
const allOutputPorts = getUniquePorts('output');

// Create a base set of generic types, then add database-specific types
const videoInputs = new Set(['Wireless Casting', 'Camera Feed', 'DisplayPort', 'VGA']);
const videoOutputs = new Set(['Display', 'Projector', 'Video Wall', 'Confidence Monitor', 'Stream/Record']);
const audioInputs = new Set(['Table Microphone (Wired)', 'Ceiling Microphone', 'Wireless Handheld Mic', 'Wireless Lapel Mic', 'PC Audio']);
const audioOutputs = new Set(['Ceiling Speakers', 'Wall-Mounted Speakers', 'Soundbar', 'Assistive Listening', 'Stream/Record']);

allInputPorts.forEach(port => {
    if (['HDMI', 'USB-C', 'RJ45 LAN'].includes(port)) videoInputs.add(port);
    if (port.toLowerCase().includes('audio')) audioInputs.add(port);
});
// HDMI also carries audio input
if (allInputPorts.includes('HDMI')) audioInputs.add('HDMI Audio');


allOutputPorts.forEach(port => {
    if (['HDMI', 'HDBaseT', 'RJ45 LAN'].includes(port)) videoOutputs.add(port);
    if (port.toLowerCase().includes('audio') || port.toLowerCase().includes('speaker')) audioOutputs.add(port);
});

export const VIDEO_INPUT_TYPES = Array.from(videoInputs).sort();
export const VIDEO_OUTPUT_TYPES = Array.from(videoOutputs).sort();
export const AUDIO_INPUT_TYPES = Array.from(audioInputs).sort();
export const AUDIO_OUTPUT_TYPES = Array.from(audioOutputs).sort();

// Export hardware features separately to be merged in the component
export const HARDWARE_FEATURES = Array.from(new Set(
  allConnectivity
    .filter(conn => conn.type === 'feature' && conn.description)
    .map(conn => conn.description!)
)).sort();


// --- Static Constants ---
export const BUDGET_OPTIONS = ['Economy', 'Standard', 'Premium'];

export const ROOM_COMPLEXITY_OPTIONS = ['Basic', 'Standard', 'High', 'Complex / Multi-Zone'];

export const COMMON_FEATURES = [
  'Video Conferencing',
  'Wireless Presentation',
  'Room Scheduling Panel',
  'Whiteboarding/Annotation',
  'In-Room PC',
];

export const ROOM_SPECIFIC_FEATURES: Record<string, string[]> = {
  'Huddle Space': ['All-in-one Video Bar'],
  'Small Conference Room': ['Content Camera'],
  'Medium Conference Room': ['Multiple Displays', 'PTZ Camera'],
  'Large Conference Room / Boardroom': ['Multiple Displays', 'PTZ Camera', 'Presenter Tracking Camera', 'Speech Reinforcement'],
  'Training Room / Classroom': ['Lecture Capture', 'Presenter Tracking Camera', 'Multiple Displays'],
  'Auditorium / All-Hands Space': ['Speech Reinforcement', 'Event Production Switcher', 'Lecture Capture', 'IMAG (Image Magnification)'],
};

export const SCALE_SPECIFIC_FEATURES: Record<string, string[]> = {
  'High': ['DSP for Audio Processing', 'Acoustic Treatment'],
  'Complex / Multi-Zone': ['DSP for Audio Processing', 'Acoustic Treatment', 'Room Combining', 'Video Wall Processing'],
};

export const CONTROL_SYSTEM_OPTIONS = ['None', 'Touch Panel', 'Push-Button Panel', 'PC/Web Interface', 'Crestron', 'AMX', 'Extron', 'Q-SYS'];

export const CABLE_TYPES = ['CAT6a', 'HDMI', 'USB-C', 'DisplayPort', 'Analog Audio', 'Speaker Wire'];
export const TERMINATION_POINTS = ['Wall Plate', 'Floor Box', 'Table Grommet', 'Equipment Rack', 'Display'];

export const NETWORK_CONNECTION_OPTIONS = ['Dedicated AV LAN', 'Shared Corporate LAN', 'None'];
export const CONTROL_WIRING_OPTIONS = ['Dedicated CAT6', 'Shared Network', 'RS-232', 'IR'];
export const POWER_CONSIDERATIONS = ['Standard Outlets', 'Dedicated Circuits Required', 'UPS Backup', 'PoE/PoE+'];
export const ENVIRONMENTAL_CONSIDERATIONS = ['Standard Office', 'High Ambient Light', 'Acoustically Challenging', 'Historical/Protected Building'];

export const ROOM_DIMENSION_DEFAULTS: Record<string, Record<string, { length: number; width: number; height: number; }>> = {
    'Huddle Space': {
        'Basic': { length: 10, width: 8, height: 9 },
        'Standard': { length: 12, width: 10, height: 9 },
    },
    'Small Conference Room': {
        'Basic': { length: 15, width: 12, height: 9 },
        'Standard': { length: 18, width: 14, height: 9 },
    },
    'Medium Conference Room': {
        'Standard': { length: 22, width: 16, height: 10 },
        'High': { length: 25, width: 18, height: 10 },
    },
    'Large Conference Room / Boardroom': {
        'High': { length: 30, width: 20, height: 12 },
        'Complex / Multi-Zone': { length: 35, width: 22, height: 12 },
    },
    'Training Room / Classroom': {
        'Standard': { length: 30, width: 25, height: 10 },
        'High': { length: 40, width: 30, height: 12 },
    },
    'Auditorium / All-Hands Space': {
        'High': { length: 60, width: 40, height: 20 },
        'Complex / Multi-Zone': { length: 80, width: 50, height: 25 },
    },
};
