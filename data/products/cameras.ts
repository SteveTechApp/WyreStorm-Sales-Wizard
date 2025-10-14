import { Product } from '../../utils/types.ts';

export const CAMERAS: Product[] = [
    {
        sku: 'CAM-200-PTZ',
        name: '4K Pro PTZ Camera',
        category: 'Camera',
        description: 'Professional 4K pan-tilt-zoom camera with 12x optical zoom, USB 3.0, and IP streaming. Ideal for larger rooms and lecture halls.',
        msrp: 1300, dealerPrice: 950, tags: ['Camera', 'PTZ', '4K', 'USB', '12x Zoom', 'USB3.0', 'IP Stream'],
        status: 'legacy',
        legacyReason: 'This model is being phased out. For new designs, please consider alternative camera solutions.',
        videoIO: {
            inputs: [],
            outputs: [{ type: 'HDMI', count: 1 }, { type: 'USB', count: 1 }, { type: 'IP Stream', count: 1 }]
        },
        hdmiVersion: '2.0',
        rs232: true,
        ethernet: true,
        poe: true,
        usb: {
            ports: [{ type: 'USB-B', count: 1 }],
            bandwidth: '3.0'
        }
    },
    {
        sku: 'CAM-300-PTZ',
        name: 'Apollo 4K AI Tracking PTZ Camera',
        category: 'Camera',
        description: 'An advanced 4K PTZ camera with AI auto-tracking, 20x optical zoom, and multiple outputs including USB, HDMI, and IP streaming. Perfect for large conference rooms and lecture halls.',
        msrp: 1800, dealerPrice: 1350, tags: ['Camera', 'PTZ', '4K', 'USB', '20x Zoom', 'AI Tracking', 'IP Stream', 'HDMI'],
        status: 'active',
        // FIX: Added missing 'inputs' property to satisfy the 'videoIO' type.
        videoIO: {
            inputs: [],
            outputs: [{ type: 'HDMI', count: 1 }, { type: 'USB', count: 1 }, { type: 'IP Stream', count: 1 }]
        },
        hdmiVersion: '2.0',
        rs232: true,
        ethernet: true,
        poe: true,
        usb: {
            ports: [{ type: 'USB-B', count: 1 }],
            bandwidth: '3.0'
        }
    }
];