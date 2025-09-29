import { Product } from '../../utils/types.ts';

export const ACCESSORIES: Product[] = [
    {
        sku: 'SR-1G-MM-SFP',
        name: 'Short Range | 1 Gigabit | Multi Mode | SFP module',
        category: 'Accessory',
        description: 'Short Range | 1 Gigabit | Multi Mode | SFP module for fiber connections.',
        msrp: 50, dealerPrice: 35, tags: ['SFP', 'Fiber', '1G'],
    },
    {
        sku: 'SR-10G-MM-SFPP',
        name: 'Short Range | 10 Gigabit | Multi Mode| SFP Plus module',
        category: 'Accessory',
        description: 'Short Range | 10 Gigabit | Multi Mode| SFP Plus module for high-speed fiber connections.',
        msrp: 150, dealerPrice: 110, tags: ['SFP', 'Fiber', '10G'],
    },
];