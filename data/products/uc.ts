import { Product } from '../../utils/types.ts';

export const UC_SOLUTIONS: Product[] = [
    {
        sku: 'APO-100-UC',
        name: 'Apollo 100 UC Video Bar',
        category: 'Unified Communications',
        description: 'All-in-one 4K video bar with integrated camera, microphone, and speakers. Perfect for huddle spaces and small meeting rooms. USB 3.0 connection.',
        tags: ['UC', 'Video Bar', '4K', 'USB', 'All-in-one', 'USB3.0'],
        status: 'legacy',
        legacyReason: 'Superseded by more modern Apollo series solutions. Consider using a dedicated speakerphone like HALO 80 and a separate USB camera.',
        usb: {
            ports: [{ type: 'USB-C', count: 1 }],
            bandwidth: '3.0'
        },
        audio: { speakerphone: true, dsp: true }
    },
    {
        sku: 'APO-210-UC',
        name: 'Apollo 210 UC Speakerphone & Switcher',
        category: 'Unified Communications',
        description: 'A complete BYOM solution with USB-C and HDMI inputs, speakerphone with AEC, and dual-view output for medium conference rooms.',
        tags: ['UC', 'BYOM', 'USB-C', 'Speakerphone', 'Dual-View', 'HDMI', 'AEC'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 1 }, { type: 'USB-C', count: 1 }],
            outputs: [{ type: 'HDMI', count: 2 }]
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
        usb: {
            ports: [{ type: 'USB-C', count: 1 }, { type: 'USB-B Host', count: 1 }, { type: 'USB-A Device', count: 2 }],
            bandwidth: '3.0'
        },
        audio: { speakerphone: true, dsp: true }
    },
    {
        sku: 'APO-DG1',
        name: 'Apollo USB-C Wireless Casting Dongle',
        category: 'Unified Communications',
        description: 'Plug-and-play wireless casting dongle for video and audio only. Does not support USB data passthrough. Compatible with devices like the APO-210-UC.',
        tags: ['UC', 'Casting', 'Wireless', 'USB-C', 'Dongle'],
    },
    {
        sku: 'APO-DG2',
        name: 'Apollo USB-C/HDMI Wireless Casting Dongle (for -W SKUs)',
        category: 'Unified Communications',
        description: 'Plug-and-play wireless casting dongle with USB data support for BYOM. Supports both USB-C and HDMI connections for easy screen sharing. ONLY compatible with WyreStorm SKUs ending in -W.',
        tags: ['UC', 'Casting', 'Wireless', 'USB-C', 'HDMI', 'Dongle', 'BYOM', 'USB'],
    },
];