import { Product } from '../../utils/types.ts';

export const CONTROL_SOLUTIONS: Product[] = [
    {
        sku: 'COMP-1LIC', name: 'Companion Control License for 1 Tablet', category: 'Control',
        description: 'Software license for Companion Control App for 1 tablet.',
        msrp: 150, dealerPrice: 100, tags: ['Control', 'Software'],
    },
    {
        sku: 'COMP-3LIC', name: 'Companion Control License for 3 Tablets', category: 'Control',
        description: 'Software license for Companion Control App for 3 tablets.',
        msrp: 400, dealerPrice: 280, tags: ['Control', 'Software'],
    },
    {
        sku: 'COMP-6LIC', name: 'Companion Control License for 6 Tablets', category: 'Control',
        description: 'Software license for Companion Control App for 6 tablets.',
        msrp: 700, dealerPrice: 500, tags: ['Control', 'Software'],
    },
    {
        sku: 'TS-280-EU', name: '2-Gang 2.8" Touchscreen Controller', category: 'Control',
        description: '2-Gang 2.8" Touchscreen Controller for Presentation Switcher Solutions.',
        msrp: 400, dealerPrice: 300, tags: ['Control', 'Touchscreen'],
    },
    {
        sku: 'SYN-KEY10', name: 'Synergy™ 10-Button Keypad Controller', category: 'Control',
        description: 'Synergy™ 10-Button Keypad Controller | Only comes with US back box.',
        msrp: 300, dealerPrice: 220, tags: ['Control', 'Keypad'],
    },
    {
        sku: 'SYN-TOUCH10', name: 'Synergy™ 10.1” All-in-One Touchpad IP Controller', category: 'Control',
        description: 'PoE+ | Table Top Stand & Wall-Mount (US/UK/EU Compatible)',
        msrp: 1200, dealerPrice: 900, tags: ['Control', 'Touchscreen', 'Synergy'],
        ethernet: true,
        poe: true
    },
    {
        sku: 'SYN-CTL-HUB', name: 'Ethernet Protocol Converter for the SYN-TOUCH10', category: 'Control',
        description: 'RS232 | Relay | IR',
        msrp: 500, dealerPrice: 350, tags: ['Control', 'Gateway', 'Synergy'],
        ethernet: true,
        rs232: true
    },
    {
        sku: 'NHD-TOUCH', name: 'Free iPad & Android Control App for NetworkHD', category: 'Control',
        description: 'Free Protocol Converter for the SYN-TOUCH10 | RS232 | Relay | IR',
        msrp: 0, dealerPrice: 0, tags: ['Control', 'Software', 'NetworkHD'],
    },
];
