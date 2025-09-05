import { Product } from '../types';

// Pricing data extracted from user-provided price list
export const productDatabase: Product[] = [
    // New Arrivals
    { sku: 'EX-40-KVM-5K', name: '5K30Hz HDBT3.0 Extender Kit', category: 'HDBaseT', description: 'Uncompressed video | HDMI Loop out | Audio de-embedding | Analog Audio pass-through | USB 2.0 | PoH | DIP Switch, RS232 control', dealerPrice: 485, msrp: 969, tags: ['extender', 'hdbaset', '5k', 'kvm'] },
    { sku: 'EX-60-USB2', name: 'USB2.0 Extender Set | 60m', category: 'USB', description: '480Mbps | PoC (Tx - Rx) | 1x USB Host & 4x USB-A ports', dealerPrice: 68, msrp: 136, tags: ['extender', 'usb'] },
    { sku: 'HALO 80', name: 'USB/Bluetooth Speakerphone', category: 'UC', description: 'Daisy-chain up to 9 units | Omni-Direction 4xMics | AEC | Noise Reduction | 3W speaker | USB2.0', dealerPrice: 154, msrp: 220, tags: ['uc', 'speakerphone', 'bluetooth'] },
    { sku: 'EX-100-G2', name: '4K60Hz 4:2:0 HDBaseT Extender | 100m', category: 'HDBaseT', description: 'PoH | CEC | IR | RS232 | 100m/327ft', dealerPrice: 230, msrp: 459, tags: ['extender', 'hdbaset', '4k'] },
    { sku: 'EXA-100-EARC', name: 'HDMI 2.0 Audio Only Extender | eARC', category: 'HDBaseT', description: 'eARC | ARC | RS232 Passthrough l IR Passthrough | CEC Passthrough | 100m/327ft', dealerPrice: 145, msrp: 289, tags: ['extender', 'audio', 'earc'] },
    { sku: 'APO-DG-DOCK', name: 'Docking station for APO-DG1/2', category: 'UC', description: 'Docking station for Apollo wireless casting dongles', dealerPrice: 32, msrp: 65, tags: ['uc', 'accessory', 'apollo'] },
    { sku: 'MX-0403-H3-MST', name: '4x3 HDMI & USB-C Matrix with HDBT 3.0', category: 'Matrix', description: 'Synergy 4K60Hz HDR | MST | Dual 60-Watt Charging | USB 3.2 | 1Gbe | GPIO | Down-Scaling', dealerPrice: 849, msrp: 1698, tags: ['matrix', 'hdbt3', 'usb-c', 'mst'] },
    { sku: 'MXV-0808-H2A-KIT', name: '8x8 HDBaseT Matrix Kit with Receivers', category: 'Matrix', description: '4K60Hz 4:4:4 | 6 standard & 2 Scaling receivers | Dolby Vision & HDR | PoH | Audio De-embed', dealerPrice: 2567, msrp: 5134, tags: ['matrix', 'hdbaset', 'kit', '4k'] },
    { sku: 'EX-100-KVM', name: '4K60Hz 4:2:0 HDBT 2.0 KVM Extender', category: 'KVM', description: 'PoH | USB 2.0 | Analog Audio & RS-232 Passthrough (4K: 100m/328ft)', dealerPrice: 327, msrp: 653, tags: ['extender', 'kvm', 'hdbaset'] },
    { sku: 'EX-40-H2-ARC', name: '4K60Hz 4:4:4 HDBaseT Extender with ARC', category: 'HDBaseT', description: 'Dolby Vision & HDR | ARC | PoH | RS232 & 2-Way IR (4K: 40m/115ft)', dealerPrice: 266, msrp: 532, tags: ['extender', 'hdbaset', '4k', 'arc'] },
    { sku: 'SR-1G-MM-SFP', name: '1 Gigabit Multi Mode SFP module', category: 'Accessory', description: 'Short Range | 1 Gigabit | Multi Mode | SFP module', dealerPrice: 18, msrp: 36, tags: ['sfp', 'network'] },
    { sku: 'SR-10G-MM-SFPP', name: '10 Gigabit Multi Mode SFP+ module', category: 'Accessory', description: 'Short Range | 10 Gigabit | Multi Mode| SFP Plus module', dealerPrice: 36, msrp: 71, tags: ['sfp', 'network', '10g'] },

    // Control
    { sku: 'TS-280-EU', name: '2.8" Touchscreen Controller', category: 'Control', description: '2-Gang Touchscreen Controller for Presentation Switcher Solutions', dealerPrice: 182, msrp: 363, tags: ['control', 'touchscreen'] },
    { sku: 'SYN-KEY10', name: 'Synergy 10-button Keypad Controller', category: 'Control', description: 'Only comes with US back box', dealerPrice: 236, msrp: 472, tags: ['control', 'keypad'] },
    { sku: 'SYN-TOUCH10', name: 'Synergy 10.1” All-In-One Touchpad IP Controller', category: 'Control', description: 'PoE+ | Table Top Stand & Wall-Mount', dealerPrice: 569, msrp: 1138, tags: ['control', 'touchscreen', 'ip'] },
    { sku: 'SYN-CTL-HUB', name: 'Ethernet Protocol Converter', category: 'Control', description: 'For the SYN-TOUCH10 | RS232 | Relay | IR', dealerPrice: 95, msrp: 135, tags: ['control', 'hub'] },
    
    // Video Processor
    { sku: 'SW-0204-VW', name: '4K 60Hz 4-Output Video Wall Processor', category: 'Video Processor', description: '1x4, 2x2 layout | Ultra-wide resolution support | WEB GUI and RS232 control', dealerPrice: 533, msrp: 1065, tags: ['videowall', 'processor'] },
    { sku: 'SW-0206-VW', name: '4K 60Hz 6-Output Video Wall Processor', category: 'Video Processor', description: 'Cascading up to 6 devices | Multi-fast layout and customized layout | WEB GUI and RS232 control', dealerPrice: 925, msrp: 1849, tags: ['videowall', 'processor'] },
    { sku: 'NHD-0401-MV', name: 'NetworkHD 4-Input 4K60 Multiview Switcher', category: 'AV over IP', description: 'Dolby Vision & HDR | Audio De-embed | Compatible with 400 & 500 Series', dealerPrice: 469, msrp: 937, tags: ['avoip', 'multiview', 'networkhd'] },

    // AVoIP
    { sku: 'NHD-120-TX', name: '4K30Hz Encoder', category: 'AV over IP', description: 'PoE | Audio De-embed | IR & RS232 Routing', dealerPrice: 305, msrp: 610, tags: ['encoder', 'avoip', '4k', 'networkhd'] },
    { sku: 'NHD-120-RX', name: '4K30Hz Decoder', category: 'AV over IP', description: 'PoE | Audio De-embed | Video Wall | IR & RS232 Routing | CEC', dealerPrice: 305, msrp: 610, tags: ['decoder', 'avoip', '4k', 'networkhd'] },
    { sku: 'NHD-400-E-TX', name: 'Lite 4K60Hz 4:2:0 Encoder', category: 'AV over IP', description: '1GbE | HDR | PoE | IR', dealerPrice: 329, msrp: 658, tags: ['encoder', 'avoip', '4k', 'networkhd'] },
    { sku: 'NHD-400-E-RX', name: 'Lite 4K60Hz 4:2:0 Decoder', category: 'AV over IP', description: '1GbE | HDR | PoE | Video Wall | Mosaic | CEC | RS232', dealerPrice: 329, msrp: 658, tags: ['decoder', 'avoip', '4k', 'networkhd'] },
    { sku: 'NHD-500-TX', name: '4K60Hz 4:4:4 Encoder', category: 'AV over IP', description: '1GbE | Dolby Vision & HDR | PoE | USB 2.0 | ARC | SFP | Dante', dealerPrice: 526, msrp: 1052, tags: ['encoder', 'avoip', '4k', 'networkhd', 'dante'] },
    { sku: 'NHD-500-RX', name: '4K60Hz 4:4:4 Decoder', category: 'AV over IP', description: '1GbE | Dolby Vision & HDR | PoE | USB 2.0 | Video Wall | ARC | SFP | CEC', dealerPrice: 526, msrp: 1052, tags: ['decoder', 'avoip', '4k', 'networkhd'] },
    { sku: 'NHD-600-TRX', name: '4K60Hz 4:4:4 SDVoE Transceiver', category: 'AV over IP', description: '10G RJ45 | Video Wall | Multiview | PoE+', dealerPrice: 595, msrp: 1189, tags: ['transceiver', 'avoip', '10g', 'sdvoe'] },
    { sku: 'NHD-CTL-PRO-V2', name: 'Pro Controller for NetworkHD Series', category: 'Control', description: 'PoE | Dual NIC Network Isolation | Advanced Setup Interface & Wizard', dealerPrice: 470, msrp: 940, tags: ['controller', 'avoip', 'networkhd'] },

    // UC
    { sku: 'APO-210-UC', name: 'Apollo Video-speakerphone switcher', category: 'UC', description: 'USB-C & HDMI input | HDMI & HDBaseT Out | Dual-View | Airplay & Miracast', dealerPrice: 625, msrp: 1250, tags: ['uc', 'apollo', 'switcher', 'speakerphone'] },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'UC', description: 'USB 3.0 | Network Streaming | 12x optical zoom | A.I. Auto-Framing | HDMI Out', dealerPrice: 497, msrp: 995, tags: ['uc', 'camera', 'ptz'] },
    { sku: 'FOCUS 200 Pro', name: '4K AI Webcam', category: 'UC', description: '120° DFOV | Gesture Control, Auto Framing | Zoom certified | USB 3.0', dealerPrice: 110, msrp: 254, tags: ['uc', 'webcam', '4k'] },
    { sku: 'HALO-VX10-V2', name: 'HALO Video Bar mini', category: 'UC', description: '4K AI camera | 120° DFOV | Auto Framing | Dual 5w stereo Speakers | ZOOM Certification', dealerPrice: 288, msrp: 390, tags: ['uc', 'videobar', '4k'] },
    { sku: 'APO-VX20-UC', name: 'Apollo Video Bar & Switcher', category: 'UC', description: 'USB-C & HDMI input | 4K AI camera | Dual 8w stereo Speakers | Airplay & Miracast', dealerPrice: 890, msrp: 1780, tags: ['uc', 'videobar', 'switcher', 'apollo'] },
    
    // Matrix
    { sku: 'MX-1007-HYB', name: '10x7 Seamless Matrix', category: 'Matrix', description: '4K60 4:4:4 | NetworkHD & HDBT Inputs & outputs | Audio DSP, AMP & Mixing | DANTE', dealerPrice: 4365, msrp: 8730, tags: ['matrix', 'seamless', 'dante', 'hdbaset', 'avoip'] },
    { sku: 'MX-0404-SCL', name: '4x4 Seamless Scaling HDMI Matrix', category: 'Matrix', description: '4K60 4:4:4 | Multiview | Videowall | Scaling Outputs | Audio De-embed', dealerPrice: 606, msrp: 1212, tags: ['matrix', 'seamless', 'hdmi', '4x4'] },
    { sku: 'MX-0808-H2A-MK2', name: '8x8 HDMI Matrix', category: 'Matrix', description: '4K60 4:4:4 | Dolby Vision & HDR | Scaling Outputs | Balanced Audio De-embed', dealerPrice: 883, msrp: 1765, tags: ['matrix', 'hdmi', '8x8'] },
    { sku: 'MXV-0404-H2A-KIT', name: '4x4 HDBaseT Matrix Kit', category: 'Matrix', description: '4K60 4:4:4 | PoH | Includes 4 Receivers | Audio De-embed', dealerPrice: 1358, msrp: 2717, tags: ['matrix', 'hdbaset', 'kit', '4x4'] }
];