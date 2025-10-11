export interface Product {
    sku: string;
    name: string;
    category: string;
    description: string;
    msrp: number;
    dealerPrice: number;
    tags: string[];
    audio?: {
        inputs?: number;
        outputs?: number;
        dsp?: boolean;
        speakerphone?: boolean;
    };
    status?: 'active' | 'legacy' | 'eol';
    legacyReason?: string;
}