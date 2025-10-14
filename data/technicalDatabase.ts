export const TECHNICAL_DATABASE = `
# WyreStorm Technical Information & AV Fundamentals

## Part 1: Signal Types & Connectivity

### Core Signal Concepts
- **Digital vs. Analog**: Digital signals (HDMI, DisplayPort) use binary data and are robust against noise over distance. Analog signals (VGA, Component) are continuous waves that degrade easily. Digital is the modern standard.
- **Bandwidth**: The data rate of a signal, measured in gigabits per second (Gbps). Higher resolutions and frame rates require more bandwidth.
  - **HDMI 1.4**: Max bandwidth of 10.2 Gbps. Supports up to 4K30 4:4:4 or 4K60 4:2:0.
  - **HDMI 2.0**: Max bandwidth of 18 Gbps. Required for full 4K60 4:4:4 HDR signals.
  - **HDMI 2.1**: Max bandwidth of 48 Gbps. For 8K and high frame rate 4K.
  All components in the chain (cables, switchers, extenders) must support the required bandwidth.

### Common Connection Types
- **HDMI (High-Definition Multimedia Interface)**: The industry standard for AV. Carries video, audio, and sometimes control (CEC) and network data.
- **DisplayPort (DP)**: Common on PCs and commercial displays. Often supports higher bandwidths and refresh rates than consumer HDMI of the same era.
- **USB-C**: The most versatile connector. Can carry video (using DP Alt Mode), data (USB 3.x), network, and power (USB-PD). Enables single-cable docking solutions.
- **SDI (Serial Digital Interface)**: A robust, locking connector used in broadcast and professional video. Excellent for long cable runs (up to 100m+).

### USB Standards & Distances
- **USB 2.0 (High Speed)**: 480Mbps bandwidth. Sufficient for keyboards, mice, and basic webcams. Passive cable limit is ~5 meters.
- **USB 3.x (SuperSpeed)**: 5Gbps or higher. Required for high-quality cameras, multiple peripherals, and fast data transfer. The passive cable limit is very short, around ~3 meters.
- **USB-C**: A versatile connector that can carry USB 3.x data and video. When used for video, it is also subject to short distance limits and often requires active cables or extenders for in-room applications.
- **USB Extension**: Extending any USB signal beyond its passive limit requires an active extender. HDBaseT and AVoIP are common technologies for extending USB over long distances.

### EDID & HDCP
- **EDID (Extended Display Identification Data)**: Data from a display that tells a source its capabilities (e.g., "I am a 1080p display"). A failed "EDID handshake" is a primary cause of "No Signal" errors.
- **HDCP (High-bandwidth Digital Content Protection)**: Encryption to prevent content piracy. All devices in a signal chain must support the same version. **HDCP 2.2/2.3** is required for most commercial 4K content (e.g., from streaming services).

## Part 2: Signal Extension Technologies

### HDBaseT
A technology for transmitting a bundle of signals (Video, Audio, USB, Control, Ethernet, Power) over a single category cable. It is a **point-to-point** technology, requiring a Transmitter (TX) and a Receiver (RX).

#### HDBaseT 2.0 (Classes A & B)
- **Native Bandwidth**: ~10.2 Gbps. Natively supports 1080p up to 100m (Class A) / 70m (Class B) and 4K30 4:4:4 up to 70m (Class A) / 40m (Class B).
- **Visually Lossless Compression (VLC)**: To support higher bandwidth signals like 4K60 4:4:4 (18Gbps), many HDBaseT 2.0 products use VLC (also known as DSC - Display Stream Compression). This allows an 18Gbps signal to be sent over a 10.2Gbps link with no perceptible loss in quality. This is a cost-effective way to achieve 4K60 extension.
- **USB**: USB 2.0 support is an optional feature. Products must explicitly state they support USB/KVM.
- **Cabling**: Requires a minimum of Cat6, but Cat6a is always recommended.

#### HDBaseT 3.0
- **Native Bandwidth**: ~18 Gbps. Supports **uncompressed** 4K60 4:4:4 video, audio, USB 2.0, control, and 1GbE Ethernet.
- **Distance**: Up to 100m.
- **USB**: USB 2.0 is a standard part of the HDBaseT 3.0 specification.
- **Cabling**: Requires a minimum of **Cat6a** or Cat7 cable.

- **PoH (Power over HDBaseT)**: Allows one HDBaseT device to power the other over the category cable, simplifying installation.


### Fiber Optic Extenders
Uses light to transmit signals over glass fiber.
- **Benefits**: Can transmit signals over extremely long distances (kilometers). Immune to electromagnetic interference (EMI). Provides high security as it's difficult to tap.
- **Drawbacks**: More fragile and typically more expensive than category cable solutions.

## Part 3: AVoIP (Audio-Visual over Internet Protocol)

AVoIP is the technology of sending AV signals over a standard network. It uses **Encoders** (at sources) and **Decoders** (at displays) with a network switch acting as a flexible, scalable matrix.

### 1Gb vs. 10Gb Networks
- **1GbE (Gigabit Ethernet)**: Most common network infrastructure. Requires video to be compressed to fit within the ~1Gbps bandwidth limit.
- **10GbE (10 Gigabit Ethernet)**: Offers much higher bandwidth, allowing for visually lossless or even fully uncompressed video transmission. Requires higher-spec switches and cabling (Cat6a minimum).

### AVoIP Codecs (Compression)
- **H.264/H.265 (High Compression)**: Low bandwidth usage (~2-30Mbps). Higher latency (~200-500ms). Good for streaming and large-scale digital signage where bandwidth is a concern. Used in **WyreStorm NHD-120 Series**.
- **JPEG-XS (Visually Lossless)**: Light, intra-frame compression. Excellent image quality and very low latency (<1 frame). A great all-rounder for high-quality distribution on 1GbE networks. Used in **WyreStorm NHD-500 Series**.
- **Uncompressed**: Pixel-perfect, zero-latency video. Requires a 10GbE network. The ultimate in quality for mission-critical applications like medical or command & control. Used in **WyreStorm NHD-600 Series**.

### Network Requirements for AVoIP
- **Managed Switch**: An unmanaged "dumb" switch will not work. A managed switch is required for configuration.
- **PoE+ (802.3at)**: Provides up to 30W of power per port, sufficient to power most encoders and decoders.
- **IGMP Snooping**: **CRITICAL** for multicast traffic. It prevents AVoIP streams from flooding the entire network and only sends them to ports that have requested them.
- **Jumbo Frames**: Allows for larger packet sizes, which can improve the efficiency of video transmission.

## Part 4: Advanced AV Concepts

### Video Walls
- **LCD Video Wall**: A grid of LCD panels with ultra-thin bezels. The visible lines between panels are called **mullions**. **Bezel Compensation** is a feature in video wall processors that accounts for the mullion gap, preventing a "jump" in the image.
- **Direct-View LED (DV-LED)**: A seamless video wall made of LED modules. Offers a completely unbroken image but is typically more expensive.
- **Driving a Video Wall**: Can be done with a dedicated **video wall processor** or with an **AVoIP system** (one decoder per panel). AVoIP offers more flexibility. Note that low-bandwidth AVoIP solutions like the NHD-120 series do not support bezel compensation.

### Multiview
The ability to display multiple video sources on a single screen simultaneously (e.g., in a quad-view). This can be achieved with a dedicated multiview processor (like the **NHD-0401-MV** for 400/500 series) or specialized AVoIP decoders (like the **NHD-150-RX** for 100/120 series). The 600 series also has this capability.

### Dante Audio
**Dante (Digital Audio Network Through Ethernet)** is the industry standard for distributing uncompressed, multi-channel audio over a standard IP network.
- **Use Cases**: Used in systems with many audio sources that require flexible routing and mixing, such as auditoriums, theaters, and houses of worship.
- **Dante Implementations**:
  - **Dedicated Hardware**: Devices with dedicated Dante chips and ports for primary/secondary networks (e.g., **NHD-610** models).
  - **Software-based (Dante AV-A)**: Some devices can have Dante capability activated via a software license. The **WyreStorm NHD-500 series** supports Dante AV-A, which can be enabled via Audinate's software.

## Part 5: WyreStorm Specific Technologies & Naming

### Apollo Series (Wireless Casting)
- **APO-DG1**: A wireless casting dongle for video and audio. It does **not** transmit USB data for BYOM functionality. It is compatible with devices like the APO-210-UC for video/audio-only casting.
- **APO-DG2**: A wireless casting dongle that **does** transmit USB data, enabling full BYOM (Bring Your Own Meeting) functionality.
- **Compatibility**: The **APO-DG2** is a specialized dongle that only works with WyreStorm presentation switchers whose SKU ends in **-W** (e.g., SW-640L-TX-W). It is **NOT** compatible with devices like the APO-VX20 or APO-210-UC.
`;