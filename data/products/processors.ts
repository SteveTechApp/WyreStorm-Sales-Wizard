import { Product } from '../../utils/types';

export const VIDEO_PROCESSORS: Product[] = [
    {
        sku: 'SW-0204-VW', name: '4K 60Hz 4-Output Video Wall', category: 'Video Processor',
        description: '1x4, 2x2 layout |Ultra-wide resolution support | WEB GUI and RS232 control',
        msrp: 1000, dealerPrice: 750, tags: ['Video Wall', 'Processor'],
    },
    {
        sku: 'SW-0206-VW', name: '4K 60Hz 6-Output Video Wall', category: 'Video Processor',
        description: 'Cascading up to 6 devices | Multi-fast layout and customized layout |Ultra-wide resolution support | WEB GUI and RS232 control',
        msrp: 1500, dealerPrice: 1100, tags: ['Video Wall', 'Processor'],
    },
    {
        sku: 'NHD-0401-MV', name: 'NetworkHD 4-Input 4K60 Multiview Switcher', category: 'Video Processor',
        description: 'Dolby Vision | Audio De-embed | Compatible with 400 & 500 Series',
        msrp: 1800, dealerPrice: 1350, tags: ['Multiview', 'NetworkHD', 'Processor'],
    },
];
