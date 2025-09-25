export const TECHNICAL_DATABASE = `
# WyreStorm Technical Information Database

## Signal Integrity & Distance
- **HDMI:** Reliable up to 15m (50ft) for 1080p. 4K signals are more sensitive and may require shorter, higher-quality cables. Active HDMI cables can extend this range.
- **HDBaseT:** Standard for long-distance AV extension over a single Category cable (Cat6/6a recommended).
  - **Class A:** Up to 100m (328ft) for 1080p, 70m for 4K.
  - **Class B:** Up to 70m (230ft) for 1080p, 35m for 4K.
- **AVoIP (NetworkHD):** Distance is limited only by the network infrastructure, effectively unlimited within a local area network (LAN). Requires managed network switches with specific features (IGMP Snooping, Jumbo Frames).
  - **100 Series (120):** Good quality, low-latency H.264/H.265 for 4K30. Best for large-scale distribution where bandwidth is a concern.
  - **500 Series:** Visually lossless JPEG-XS for 4K60 4:4:4 with Dante audio support. Excellent for high-quality, low-latency applications.
  - **600 Series:** Uncompressed 4K60 over 10GbE network. The ultimate in quality for demanding environments.

## Video Standards
- **Resolutions:**
  - **1080p (Full HD):** 1920x1080 pixels. Standard for basic video conferencing and presentation.
  - **4K UHD:** 3840x2160 pixels. The modern standard for high-quality displays.
- **Chroma Subsampling:** Expressed as a ratio (e.g., 4:4:4, 4:2:2, 4:2:0).
  - **4:4:4:** Full color information. Crucial for computer-generated text and graphics to appear sharp.
  - **4:2:0:** Compressed color information. Saves bandwidth. Acceptable for motion video but can make text look blurry.
- **HDCP (High-bandwidth Digital Content Protection):** Encryption standard to prevent copying of digital content. All devices in the signal chain (source, switcher, display) must support the same version (e.g., HDCP 2.2 for 4K content).

## Audio Standards
- **Low-Impedance (Stereo):** Typically 4 or 8 ohms. Used for home audio and high-fidelity sound systems. Requires shorter, thicker speaker cable runs.
- **High-Impedance (70V/100V):** Used for commercial distributed audio systems (e.g., ceiling speakers). Allows for long cable runs with many speakers on a single amplifier channel.
- **Dante / AES67:** Audio-over-IP (AoIP) standards. Allows for routing many channels of uncompressed digital audio over a standard network. Highly flexible and scalable.

## Control
- **CEC (Consumer Electronics Control):** Allows HDMI devices to control each other. Can be used for basic functions like turning a display on/off when a source is connected.
- **RS-232:** A robust serial communication standard for controlling professional AV devices (displays, projectors, switchers).
- **IR (Infrared):** Same technology as a standard remote control. Can be extended over HDBaseT.
- **IP Control:** Controlling devices over the network using Telnet or API calls. Most modern professional devices support this.
`;
