import { Product } from '../../utils/types.ts';

export const CABLES: Product[] = [
    {
        sku: 'CAB-HAOC-10', name: 'Essentials 10m 4K/60Hz 4:4:4 Active Optical HDMI Cable', category: 'Cable',
        description: 'A hybrid active optical fiber HDMI cable for extending 18Gbps signals up to 10 meters.',
        msrp: 120, dealerPrice: 90, tags: ['Cable', 'HDMI', 'AOC', 'Fiber', '18Gbps', '10m'],
    },
    {
        sku: 'CAB-HAOC-30', name: 'Essentials 30m 4K/60Hz 4:4:4 Active Optical HDMI Cable', category: 'Cable',
        description: 'A hybrid active optical fiber HDMI cable for extending 18Gbps signals up to 30 meters.',
        msrp: 200, dealerPrice: 150, tags: ['Cable', 'HDMI', 'AOC', 'Fiber', '18Gbps', '30m'],
    },
    {
        sku: 'CBL-USBC-C-1', name: '1m USB 3.2 Gen 2 Type-C Cable', category: 'Cable',
        description: 'A 1-meter USB-C to USB-C cable supporting 10Gbps data, 4K video, and 100W power delivery.',
        msrp: 30, dealerPrice: 20, tags: ['Cable', 'USB-C', '10Gbps', '1m', '100W'],
    },
     {
        sku: 'CBL-USB-A-B-2', name: '2m USB 3.0 A to B Cable', category: 'Cable',
        description: 'A 2-meter USB 3.0 cable for connecting host devices like a switcher to a PC.',
        msrp: 25, dealerPrice: 18, tags: ['Cable', 'USB', 'USB3.0', '2m'],
    },
     {
        sku: 'CBL-HDMI-HS-2', name: '2m Essentials High-Speed HDMI Cable', category: 'Cable',
        description: 'High-speed 18Gbps HDMI cable supporting 4K/60Hz 4:4:4 resolutions up to 2 meters.',
        msrp: 25, dealerPrice: 19, tags: ['Cable', 'HDMI', '4K', '18Gbps', '2m'],
    },
];
