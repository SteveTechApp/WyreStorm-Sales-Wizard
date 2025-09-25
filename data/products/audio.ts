import { Product } from '../../utils/types';

export const AUDIO_SYSTEMS: Product[] = [
    {
        sku: 'AMP-260-DNT', name: '120W Network Amplifier', category: 'Amplifier',
        description: '2 x 60w or 4 x 25w Channel Output @ 4ohm | Dual Power Options | Advanced DSP with Dante Integration',
        msrp: 1000, dealerPrice: 750, tags: ['Amplifier', 'Dante', 'DSP'],
    },
    {
        sku: 'APO-SKY-MIC', name: 'Apollo™ companion Add-On Ceiling Mic', category: 'Microphone',
        description: 'RJ45 connection',
        msrp: 400, dealerPrice: 300, tags: ['Microphone', 'Ceiling'],
    },
    {
        sku: 'COM-MIC-HUB', name: 'Microphone Hub | Microphone Mixer', category: 'Audio Processor',
        description: 'AEC & AGC & ANR | Web-UI',
        msrp: 500, dealerPrice: 380, tags: ['DSP', 'Microphone'],
    },
    {
        sku: 'EXP-CON-AUD-H2', name: '4K60Hz 4:4:4 HDMI 2.0 Audio Extractor', category: 'Audio Processor',
        description: 'HDMI to S/PDIF or RCA | 4K60 | Dolby Vision & HDR',
        msrp: 200, dealerPrice: 150, tags: ['Audio', 'Extractor'],
    },
];
