
export const AV_DESIGN_KNOWLEDGE_BASE = `
WyreStorm AV Design Principles:

1.  **Signal Integrity is Key:** Always choose the right technology for the distance.
    - Short runs (<5m): Use high-quality passive HDMI cables.
    - Medium runs (5-15m): Use Active Optical Cables (AOC) like CAB-HAOC series.
    - Long runs (>15m): Use HDBaseT or AVoIP extenders.

2.  **Resolution and Bandwidth:**
    - 4K60 4:4:4 requires 18Gbps. This needs HDMI 2.0, HDBaseT 3.0, or high-performance AVoIP (like NetworkHD 500/600 series).
    - 1080p is sufficient for many applications and can be reliably sent over HDBaseT 2.0 or lower-bandwidth AVoIP (NetworkHD 300/400 series).

3.  **Unified Communications (UC) & Bring Your Own Device (BYOD):**
    - A key differentiator is the USB connection. A true BYOD solution must extend USB for webcams, microphones, and speakerphones.
    - Products like the Apollo series (APO-210-UC, APO-VX20-UC) are designed for this, combining switching with USB-C connectivity.
    - "Wireless Casting" is NOT the same as "Wireless BYOD".
        - Casting (e.g., in SW-0401-MST-W) sends video/audio from a device.
        - BYOD requires a USB data path back to the laptop to connect to room peripherals. This is often achieved with a dongle like the APO-DG2.

4.  **Audio Integration:**
    - For simple rooms, de-embedded audio from an extender or switcher is fine.
    - For larger rooms or complex audio needs, a dedicated DSP is recommended.
    - Dante is the standard for networked audio in enterprise environments. WyreStorm offers products with native Dante (NHD-500-DNT-TX, MX-1007-HYB) or software-upgradable Dante (NHD-500-TX/RX).

5.  **Choosing AVoIP (NetworkHD):**
    - **100 Series (JPEG2000):** Good for low-latency, video wall, and multiview applications up to 1080p.
    - **300 Series (H.264):** Ideal for streaming to the web (YouTube, Facebook) or recording.
    - **400 Series (JPEG2000):** The previous 4K HDR solution. The 500 series is now the primary 1GbE recommendation.
    - **500 Series (H.265/HEVC):** The current flagship 1GbE solution. 4K60 4:4:4, Dolby Vision, HDR, and full KVM/USB support. The best choice for high-quality, flexible distribution on a standard 1GbE network. Requires a controller (NHD-CTL-PRO).
    - **600 Series (SDVoE):** For zero-latency, uncompressed 4K60 4:4:4 performance. Requires a 10GbE network, making it suitable for high-end applications like command centers or medical imaging.

6.  **Control:**
    - CEC (Consumer Electronics Control) can turn displays on/off over HDMI. It's simple but can be unreliable in complex systems.
    - RS-232 is the most reliable method for professional display control.
    - For full room control, use a Synergy keypad or touch panel, or integrate with a third-party control system.

7.  **Product Tiers:**
    - **Bronze:** Focus on all-in-one solutions (APO-VX20-UC) or simple HDBaseT switchers (SW-0401-MST). Cost-effective and reliable for basic needs.
    - **Silver:** Move to matrix switchers (MX-0403-H3-MST), more powerful UC solutions (APO-210-UC), and professional PTZ cameras (CAM-210-PTZ). Offers more flexibility.
    - **Gold:** Based on AVoIP (NetworkHD 500/600 series) for ultimate scalability and performance. Includes advanced audio (Dante) and control.
`;
