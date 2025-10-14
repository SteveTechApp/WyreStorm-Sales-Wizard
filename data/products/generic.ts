import { Product } from '../../utils/types.ts';

export const GENERIC_DEVICES: Product[] = [
    {
        sku: 'GEN-PC', name: 'Dedicated Room PC', category: 'Source',
        description: 'A dedicated in-room computer for running presentations and video conferencing software.',
        msrp: 1000, dealerPrice: 800, tags: ['Source', 'PC'],
        videoIO: {
            inputs: [],
            outputs: [{ type: 'HDMI', count: 1 }, { type: 'DisplayPort', count: 1 }]
        },
        usb: {
            ports: [{ type: 'USB-A', count: 4 }]
        },
        ethernet: true,
    },
    {
        sku: 'GEN-DOC-CAM', name: 'Document Camera', category: 'Source',
        description: 'A camera for displaying physical documents or objects to the main screen. Common in education.',
        msrp: 500, dealerPrice: 350, tags: ['Source', 'Camera'],
        videoIO: {
            inputs: [],
            outputs: [{ type: 'HDMI', count: 1 }, { type: 'USB', count: 1 }]
        },
        usb: {
            ports: [{ type: 'USB-B', count: 1 }]
        }
    },
];