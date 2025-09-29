import { Product } from '../../utils/types.ts';

export const EXTENDERS: Product[] = [
    {
        sku: 'EX-40-G3', name: '1080p60 UTP Extender Set', category: 'Extender',
        description: 'IR Passthrough | PoC (1080p: 40m 131ft)',
        msrp: 300, dealerPrice: 200, tags: ['Extender', '1080p'],
    },
    {
        sku: 'EX-70-G2', name: '4K60Hz 4:2:0 HDBaseT Extender', category: 'Extender',
        description: 'PoH | CEC | IR | RS232 (4K: 35m/115ft, 1080p: 70m/230ft)',
        msrp: 500, dealerPrice: 350, tags: ['Extender', 'HDBaseT'],
        status: 'legacy',
        legacyReason: 'This extender uses older HDBaseT technology limited to 4K 4:2:0 chroma subsampling. For full 4K60 4:4:4, consider newer HDBaseT 3.0 or AVoIP solutions.',
    },
];