import { Product } from '../../utils/types.ts';

export const UC_SOLUTIONS: Product[] = [
    {
        sku: 'APO-100-UC',
        name: 'Apollo 100 UC Video Bar',
        category: 'Unified Communications',
        description: 'All-in-one 4K video bar with integrated camera, microphone, and speakers. Perfect for huddle spaces and small meeting rooms. USB 3.0 connection.',
        msrp: 800, dealerPrice: 600, tags: ['UC', 'Video Bar', '4K', 'USB'],
    },
    {
        sku: 'APO-210-UC',
        name: 'Apollo 210 UC Speakerphone & Switcher',
        category: 'Unified Communications',
        description: 'A complete BYOM solution with USB-C and HDMI inputs, speakerphone with AEC, and dual-view output for medium conference rooms.',
        msrp: 1500, dealerPrice: 1100, tags: ['UC', 'BYOM', 'USB-C', 'Speakerphone', 'Dual-View'],
    },
    {
        sku: 'CAM-200-PTZ',
        name: '4K Pro PTZ Camera',
        category: 'Camera',
        description: 'Professional 4K pan-tilt-zoom camera with 12x optical zoom, USB 3.0, and IP streaming. Ideal for larger rooms and lecture halls.',
        msrp: 1300, dealerPrice: 950, tags: ['Camera', 'PTZ', '4K', 'USB'],
    },
    {
        sku: 'APO-DG2',
        name: 'Apollo USB-C/HDMI Wireless Casting Dongle',
        category: 'Unified Communications',
        description: 'Plug-and-play wireless casting dongle. Supports both USB-C and HDMI connections for easy screen sharing.',
        msrp: 250, dealerPrice: 180, tags: ['UC', 'Casting', 'Wireless', 'USB-C'],
    },
];
