import { Product } from '../../utils/types.ts';

export const SWITCHERS_PRESENTATION: Product[] = [
    {
        sku: 'SW-0201-4K',
        name: '2x1 USB-C & HDMI Wireless Switcher',
        category: 'Presentation Switcher',
        description: 'A compact 2x1 presentation switcher with HDMI and USB-C inputs, featuring auto-switching and wireless casting support via the APO-DG1 dongle (sold separately).',
        tags: ['Switcher', 'USB-C', 'Casting', '4K', 'Bronze', 'HDMI', 'Auto-switching', '2x1'],
        status: 'legacy',
        legacyReason: 'This is a basic switcher. For more inputs or advanced features like dual-view, consider models like the SW-510-TX or SW-640L-TX-W.',
        videoIO: {
            inputs: [{ type: 'HDMI', count: 1 }, { type: 'USB-C', count: 1 }],
            outputs: [{ type: 'HDMI', count: 1 }]
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        usb: { ports: [{ type: 'USB-C', count: 1 }] }
    },
    {
        sku: 'SW-0401-H2',
        name: '4x1 4K/60Hz 4:2:0 HDMI Switcher',
        category: 'Presentation Switcher',
        description: 'A simple and reliable 4-input HDMI switcher with auto-switching functionality. Ideal for basic meeting rooms.',
        tags: ['Switcher', 'HDMI', '4K', 'Bronze', '4x1', '4K30', '4:2:0', 'Auto-switching'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 4 }],
            outputs: [{ type: 'HDMI', count: 1 }]
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
    },
    {
        sku: 'SW-340-TX',
        name: '3-Input HDBaseT Presentation Switcher with USB-C',
        category: 'Presentation Switcher',
        description: 'A versatile 3-input presentation switcher with 2x HDMI and 1x USB-C inputs. Features an HDBaseT output for long-distance transmission to a display, USB host, and auto-switching. Ideal for modern classrooms and meeting rooms.',
        tags: ['Switcher', 'HDBaseT', 'USB-C', '4K', 'Silver', '3x1', 'USB Host', 'Auto-switching'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 2 }, { type: 'USB-C', count: 1 }],
            outputs: [{ type: 'HDBaseT', count: 1 }, { type: 'HDMI', count: 1 }] // Mirrored
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
        hdbaset: { version: '2.0 Class A', poh: true },
        usb: {
            ports: [{ type: 'USB-C', count: 1 }, { type: 'USB-B Host', count: 2 }, { type: 'USB-A Device', count: 2 }],
            bandwidth: '3.0'
        }
    },
    {
        sku: 'SW-510-TX',
        name: '5-Input 4K HDBaseT Presentation Switcher',
        category: 'Presentation Switcher',
        description: '5-input HDBaseT/HDMI/VGA/DP switcher with scaling and CEC control. A workhorse for any modern meeting room.',
        tags: ['HDBaseT', '4K', 'Switcher', 'CEC', 'Silver', '5x1', 'HDMI', 'VGA', 'DisplayPort', 'Scaling'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 3 }, { type: 'VGA', count: 1 }, { type: 'DisplayPort', count: 1 }],
            outputs: [{ type: 'HDBaseT', count: 1 }, { type: 'HDMI', count: 1 }] // Mirrored
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
        hdbaset: { version: '2.0 Class A', poh: true }
    },
    {
        sku: 'SW-640L-TX-W',
        name: '6-Input 4K/60Hz Presentation Switcher with USB-C & Wireless Casting',
        category: 'Presentation Switcher',
        description: 'A high-performance dual-output 4K presentation switcher. Features multiple wired inputs (HDMI, DP, USB-C) and native wireless casting capabilities compatible with the APO-DG2 dongle for a full BYOM experience. Includes a USB host for peripherals.',
        tags: ['Switcher', 'USB-C', 'Casting', '4K', 'Gold', '6x2', 'Dual Output', 'USB Host', 'BYOM', 'Wireless'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 3 }, { type: 'USB-C', count: 2 }, { type: 'DisplayPort', count: 1}],
            outputs: [{ type: 'HDMI', count: 2 }] // Independent outputs
        },
        hdmiVersion: '2.0b',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
        usb: { ports: [{ type: 'USB-C', count: 2 }, { type: 'USB-B Host', count: 2 }, { type: 'USB-A Device', count: 2 }], bandwidth: '3.0' }
    },
];

export const SWITCHERS_MATRIX: Product[] = [
     {
        sku: 'MX-0402-H2-MST',
        name: '4x2 4K Matrix with Multi-View Scaling',
        category: 'Matrix Switcher',
        description: '4x2 4K matrix switcher with multi-view and scaling capabilities. Perfect for medium conference rooms with dual displays requiring flexible content arrangement.',
        tags: ['Matrix', 'Multiview', '4K', 'Silver', '4x2', 'Scaling'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 4 }],
            outputs: [{ type: 'HDMI', count: 2 }]
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
    },
    {
        sku: 'MX-0804-EDU',
        name: '8x4 Education Matrix Switcher',
        category: 'Matrix Switcher',
        description: 'An 8-input, 4-output matrix designed for classrooms with mic inputs and powerful audio mixing.',
        tags: ['Matrix', 'Education', 'Audio', 'Silver', '8x4', 'Microphone Input', 'Audio Mixer'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 6 }, { type: 'VGA', count: 2 }],
            outputs: [{ type: 'HDBaseT', count: 2 }, { type: 'HDMI', count: 2 }]
        },
        hdmiVersion: '1.4',
        hdcpVersion: '1.4',
        rs232: true,
        ethernet: true,
        hdbaset: { version: '2.0 Class A', poh: true },
        audio: { inputs: [{ type: 'Mic', count: 2 }], dsp: true }
    },
    {
        sku: 'MX-1007-HYB',
        name: '10x7 Hybrid HDBaseT/HDMI Matrix Switcher',
        category: 'Matrix Switcher',
        description: 'A powerful hybrid matrix with 10 inputs (HDMI, HDBaseT) and 7 outputs, with integrated audio DSP. Ideal for large boardrooms or divisible spaces.',
        tags: ['Matrix', 'HDBaseT', 'DSP', '4K', 'Gold', '10x7', 'HDMI'],
        videoIO: {
            inputs: [{ type: 'HDMI', count: 5 }, { type: 'HDBaseT', count: 5 }],
            outputs: [{ type: 'HDBaseT', count: 5 }, { type: 'HDMI', count: 2 }]
        },
        hdmiVersion: '2.0',
        hdcpVersion: '2.2',
        rs232: true,
        ethernet: true,
        hdbaset: { version: '2.0 Class A', poh: true },
        audio: { dsp: true }
    },
];