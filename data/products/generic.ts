import { Product } from '../../utils/types';

export const GENERIC_DEVICES: Product[] = [
    {
        sku: 'GEN-PC', name: 'Dedicated Room PC', category: 'Source',
        description: 'A dedicated in-room computer for running presentations and video conferencing software.',
        msrp: 1000, dealerPrice: 800, tags: ['Source', 'PC'],
    },
    {
        sku: 'GEN-DOC-CAM', name: 'Document Camera', category: 'Source',
        description: 'A camera for displaying physical documents or objects to the main screen. Common in education.',
        msrp: 500, dealerPrice: 350, tags: ['Source', 'Camera'],
    },
];
