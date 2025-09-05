
export interface ProductConnectivity {
    type: 'input' | 'output' | 'feature';
    port?: string;
    description?: string;
}

export interface WyreStormProduct {
    name: string;
    category: string;
    description: string;
    connectivity: ProductConnectivity[];
    productUrl?: string;
}

export const WYRESTORM_PRODUCT_DATABASE: WyreStormProduct[] = [
    {
        name: 'SW-540-TX-W',
        category: 'Presentation Switcher',
        description: '4-Input HDBaseT & Class C DSC Presentation Switcher with wireless casting.',
        connectivity: [
            { type: 'input', port: 'HDMI' },
            { type: 'input', port: 'HDMI' },
            { type: 'input', port: 'USB-C' },
            { type: 'input', port: 'Wireless Casting' },
            { type: 'output', port: 'HDBaseT' },
            { type: 'output', port: 'HDMI' },
            { type: 'feature', description: '4K/60 4:2:0' },
            { type: 'feature', description: 'USB 2.0 Hub' }
        ],
        productUrl: 'https://www.wyrestorm.com/product/sw-540-tx-w/'
    },
    {
        name: 'NHD-400-E-TX',
        category: 'AV over IP Encoder',
        description: 'NetworkHD 400 Series 4K AV over IP JPEG 2000 Encoder with PoE.',
        connectivity: [
            { type: 'input', port: 'HDMI' },
            { type: 'output', port: 'RJ45 LAN' },
            { type: 'feature', description: '4K/60 4:2:0' },
            { type: 'feature', description: 'PoE Support' }
        ],
        productUrl: 'https://www.wyrestorm.com/product/nhd-400-e-tx/'
    },
    {
        name: 'NHD-400-D-RX',
        category: 'AV over IP Decoder',
        description: 'NetworkHD 400 Series 4K AV over IP JPEG 2000 Decoder with Video Wall Processing.',
        connectivity: [
            { type: 'input', port: 'RJ45 LAN' },
            { type: 'output', port: 'HDMI' },
            { type: 'feature', description: 'Video Wall Processing' },
            { type: 'feature', description: 'PoE Support' }
        ],
        productUrl: 'https://www.wyrestorm.com/product/nhd-400-d-rx/'
    },
    {
        name: 'MXV-0808-H2A-H',
        category: 'Matrix Switcher',
        description: '8x8 HDBaseT 4K HDR Matrix Switcher with Audio Matrix & DSP.',
        connectivity: [
            { type: 'input', port: 'HDMI' },
            { type: 'input', port: 'Digital Audio' },
            { type: 'output', port: 'HDBaseT' },
            { type: 'output', port: 'HDMI' },
            { type: 'output', port: 'Analog Audio' },
            { type: 'feature', description: 'Audio DSP' },
            { type: 'feature', description: '4K HDR' }
        ],
        productUrl: 'https://www.wyrestorm.com/product/mxv-0808-h2a-h/'
    },
    {
        name: 'AMP-001-010',
        category: 'Audio Amplifier',
        description: 'HDBaseT Digital Audio Amplifier with 2x20w output.',
        connectivity: [
            { type: 'input', port: 'HDBaseT Audio' },
            { type: 'output', port: 'Speaker Level' },
            { type: 'feature', description: 'PoE Support' }
        ],
        productUrl: 'https://www.wyrestorm.com/product/amp-001-010/'
    }
];
