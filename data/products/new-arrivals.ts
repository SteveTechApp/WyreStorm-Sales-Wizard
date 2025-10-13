import { Product } from '../../utils/types.ts';

export const NEW_ARRIVALS: Product[] = [
    {
        sku: 'EX-40-VWM-5K',
        name: '5K30Hz HDBT3.0 Extender Kit',
        category: 'Extender',
        description: 'Uncompressed video | HDMI Loop out | Audio de-embedding | Analog Audio pass-through | USB 2.0 | PoH | DIP Switch, RS232 control',
        msrp: 900, dealerPrice: 650, tags: ['Extender', 'HDBT3.0', '5K', 'USB', 'RS232', 'Audio De-embed'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 1 }], // on TX
            outputs: [{ type: 'HDBaseT', count: 1 }, { type: 'HDMI Loop', count: 1 }], // on TX
        },
        hdmiVersion: '2.1',
        hdcpVersion: '2.3',
        rs232: true,
        hdbaset: { version: '3.0', poh: true },
        usb: {
            ports: [{ type: 'USB-B Host', count: 1 }, { type: 'USB-A Device', count: 4 }],
            bandwidth: '2.0 (480Mbps)',
        },
        audio: { outputs: [{ type: 'Analog Stereo', count: 1}]}
    },
    {
        sku: 'EX-40-USE2',
        name: 'USB2.0 Extender Set',
        category: 'Extender',
        description: '60m | 480Mbps | PoC (Tx- Rx) | 1x USB Host & 4x USB-A ports',
        msrp: 250, dealerPrice: 180, tags: ['Extender', 'USB', 'KVM', 'USB2.0'],
        usb: {
            ports: [{ type: 'USB-B Host', count: 1 }, { type: 'USB-A Device', count: 4 }],
            bandwidth: '2.0 (480Mbps)',
        },
    },
    {
        sku: 'HALO 80',
        name: 'USB/Bluetooth Speakerphone',
        category: 'Unified Communications',
        description: 'Daisy-chain up to 9 units | Omni-Direction 4Mics | AEC | Noise Reduction | 3W speaker | USB2.0',
        msrp: 450, dealerPrice: 320, tags: ['UC', 'Speakerphone', 'Bluetooth', 'USB', 'AEC', 'Daisy-chain'],
        usb: { ports: [{ type: 'USB-C', count: 1 }], bandwidth: '2.0'},
        audio: { speakerphone: true, dsp: true }
    },
    {
        sku: 'EX-100-G2',
        name: '4K60Hz 4.2.0 HDBaseT Extender',
        category: 'Extender',
        description: 'PoH | CEC | IR | RS232 | 100m/327ft',
        msrp: 700, dealerPrice: 520, tags: ['Extender', 'HDBaseT', '4K', 'Class A', '4K30', '4:2:0', 'CEC', 'IR', 'RS232'],
        videoIO: { inputs: [{ type: 'HDMI', count: 1 }], outputs: [{ type: 'HDBaseT', count: 1 }]}, // on TX
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        hdbaset: { version: '2.0 Class A', poh: true }
    },
    {
        sku: 'EXA-100-EARC',
        name: 'HDMI 2.0 Audio Only Extender',
        category: 'Extender',
        description: 'eARC | ARC | RS232 Passthrough | IR Passthrough | CEC Passthrough | 100m/327ft',
        msrp: 350, dealerPrice: 260, tags: ['Extender', 'Audio', 'eARC', 'ARC', 'RS232', 'IR', 'CEC'],
        videoIO: { inputs: [{ type: 'HDMI', count: 1 }], outputs: [{ type: 'HDMI', count: 1 }]},
        hdmiVersion: '2.0',
        rs232: true
    },
    {
        sku: 'APO-DG-DOCK',
        name: 'Docking station for APO-DG1, APO-DG2 & APO-DG-HDMI',
        category: 'Accessory',
        description: 'Docking station for Apollo wireless casting dongles.',
        msrp: 150, dealerPrice: 110, tags: ['UC', 'Accessory', 'Casting', 'Dongle', 'Apollo'],
    },
    {
        sku: 'MX-0403-H3-MST',
        name: 'Synergy 4K60Hz HDR 4x3 HDMI & USB-C Matrix Switcher',
        category: 'Matrix Switcher',
        description: 'MST & HDBaseT 3.0 Output| Dual 60-Watt Charging | USB 3.2 | USB Passthrough 1Gbe | GPIO | Down-Scaling',
        msrp: 3500, dealerPrice: 2600, tags: ['Matrix', 'USB-C', 'HDBT3.0', 'MST', '4x3', '4K60', 'HDR', 'HDMI', 'USB Passthrough', 'Scaling'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 2 }, { type: 'USB-C', count: 2}],
            outputs: [{ type: 'HDMI', count: 2}, { type: 'HDBaseT', count: 1}]
        },
        hdmiVersion: '2.1',
        hdcpVersion: '2.3',
        rs232: true,
        ethernet: true,
        hdbaset: { version: '3.0' },
        usb: {
            ports: [{ type: 'USB-C', count: 2 }, { type: 'USB-B Host', count: 2 }, { type: 'USB-A Device', count: 2 }],
            bandwidth: '3.2 Gen 1'
        }
    },
    {
        sku: 'MXV-0808-H2A-KIT',
        name: '4K60Hz 4.4.4 8x8 HDBaseT™ Matrix Kit',
        category: 'Matrix Switcher',
        description: 'w/ 8 standard receivers & 2 Scaling receivers | Dolby Vision & HDR | PoH |Audio De-embed | Routable CEC & RS232 (4K: 35m/115ft, 1080p: 70m/230ft)',
        msrp: 9000, dealerPrice: 6750, tags: ['Matrix', 'HDBaseT', 'Kit', '8x8', 'Class B', '4K60', '4:4:4', 'HDR', 'Audio De-embed', 'CEC', 'RS232'],
        videoIO: { inputs: [{ type: 'HDMI', count: 8 }], outputs: [{ type: 'HDBaseT', count: 8 }]},
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
        hdbaset: { version: '2.0 Class B', poh: true },
        audio: { outputs: [{ type: 'Analog Stereo', count: 8}, { type: 'SPDIF', count: 8}] }
    },
    {
        sku: 'EX-100-KVM',
        name: '4K60Hz 4.2.0 HDBT 2.0 Extender Set',
        category: 'Extender',
        description: 'PoH | USB 2.0 (Analog Audio & RS-232 Passthrough (4K: 100m/328ft))',
        msrp: 850, dealerPrice: 630, tags: ['Extender', 'HDBaseT', 'KVM', 'Class A', '4K30', '4:2:0', 'USB2.0', 'RS232'],
        videoIO: { inputs: [{ type: 'HDMI', count: 1 }], outputs: [{ type: 'HDBaseT', count: 1 }]},
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        hdbaset: { version: '2.0 Class A', poh: true },
        usb: { ports: [{ type: 'USB-B Host', count: 1 }, { type: 'USB-A Device', count: 4 }], bandwidth: '2.0 (480Mbps)'}
    },
    {
        sku: 'EX-40-H2-ARC',
        name: '4K60Hz 4.4.4 HDBaseT™ Extender Set',
        category: 'Extender',
        description: 'Dolby Vision & HDR | ARC | RS232 & 2-Way IR Passthrough (4K: 40m/115ft, 1080p: 70m/230ft)',
        msrp: 600, dealerPrice: 450, tags: ['Extender', 'HDBaseT', 'ARC', 'Class B', '4K60', '4:4:4', 'HDR', 'RS232', 'IR'],
        videoIO: { inputs: [{ type: 'HDMI', count: 1 }], outputs: [{ type: 'HDBaseT', count: 1 }]},
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        hdbaset: { version: '2.0 Class B', poh: false }
    },
];
