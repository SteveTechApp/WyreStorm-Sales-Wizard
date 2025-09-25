import { Product } from '../../utils/types';

export const UC_PRODUCTS: Product[] = [
    {
        sku: 'APO-100-UC', name: 'Apollo™ videophone-speakerphone', category: 'Unified Communications',
        description: 'USB-C Connectivity | 10W Speaker | Omni-Direction 4Mics',
        msrp: 700, dealerPrice: 500, tags: ['UC', 'Speakerphone'],
    },
    {
        sku: 'APO-210-UC', name: 'Apollo 210 UC Conferencing Speakerphone & Switcher', category: 'Unified Communications',
        description: 'USB-C & HDMI input | HDMI Out | 10W Speaker | Omni-Direction 4Mics| Dual-View | Airplay & Miracast & APO-DG1 dongle',
        msrp: 900, dealerPrice: 600, tags: ['USB-C', '4K', 'Speakerphone', 'UC', 'Silver'],
        audio: { dsp: true, speakerphone: true },
    },
    {
        sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera',
        description: 'USB 3.0 | Network Streaming | 12x optical zoom | A.I. Auto-Framing | HDMI Out',
        msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'],
    },
    {
        sku: 'CAM-210-NDI-PTZ', name: '1080p60 PTZ Camera with NDI|HX', category: 'Camera',
        description: 'USB 3.0 | Network Streaming | 12x optical zoom | A.I. Auto-Framing | HDMI Out',
        msrp: 1500, dealerPrice: 1150, tags: ['Camera', 'PTZ', 'NDI'],
    },
    {
        sku: 'FOCUS 200 Pro', name: '4K AI Webcam | 120° DFOV', category: 'Camera',
        description: 'Gesture Control, Auto Framing and Presenter Tracking| Zoom certified | Support 3.0 | Integrated Mic | High fram rate, ZOOM Certification',
        msrp: 250, dealerPrice: 180, tags: ['Camera', 'Webcam', '4K'],
    },
    {
        sku: 'HALO 60', name: 'Compact USB Speakerphone', category: 'Unified Communications',
        description: 'Omni-direction 4Mics | AEC & AGC & ANR | 2500mAh Battery',
        msrp: 200, dealerPrice: 150, tags: ['UC', 'Speakerphone'],
    },
    {
        sku: 'APO-VX10-V2', name: 'HALO Video Bar Mini', category: 'Unified Communications',
        description: '4K AI camera | 120° DFOV | Auto Framing and Presenter Tracking| Dual 5w stereo speakers | ZOOM Certification',
        msrp: 700, dealerPrice: 500, tags: ['UC', 'Soundbar', 'Camera', 'Bronze'],
    },
    {
        sku: 'APO-VX20-UC', name: 'Apollo VX20 Conferencing Soundbar', category: 'Unified Communications',
        description: '4K AI camera | 120° DFOV | Auto Framing and Presenter Tracking| Dual 8w stereo speakers | Airplay & Miracast & APO-DG1, ZOOM',
        msrp: 1300, dealerPrice: 950, tags: ['UC', 'Soundbar', '4K', 'Camera', 'Silver'],
        audio: { dsp: true, speakerphone: true },
    },
    {
        sku: 'APO-DG2',
        name: 'Apollo™ 4K Wireless Casting Dongle',
        category: 'Unified Communications',
        description: 'Apollo™ 4K USB-C/HDMI dongle for wireless casting and screen mirroring (without App).',
        msrp: 200,
        dealerPrice: 150,
        tags: ['UC', 'Casting', 'Dongle', '4K'],
    },
    {
        sku: 'APO-MIC-EXT', name: 'Apollo Extension Microphone', category: 'Accessory',
        description: 'Mini-USB to Ethernet adaptor for connection between Videobar and Companion mic APO-COM-MIC',
        msrp: 250, dealerPrice: 180, tags: ['UC', 'Microphone', 'Accessory'],
    },
];