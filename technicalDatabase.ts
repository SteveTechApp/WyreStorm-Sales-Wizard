
export const AV_DESIGN_KNOWLEDGE_BASE = `
WyreStorm AV Design Principles:

**Core Philosophy:** The goal is to create a reliable, user-friendly system that meets the client's needs now and in the future. The choice between a traditional matrix-based system and a networked AVoIP system is the most fundamental decision.

---

### Section 1: Application Principles (Room Type -> Technology)

This section guides the high-level architectural choice based on the room's purpose.

*   **Corporate (Huddle, Conference, Boardroom):**
    *   **Small/Medium Rooms (up to 16 seats):** Traditional matrix switchers (e.g., MX-0403-H3-MST) or powerful presentation switchers (e.g., APO-210-UC) are often the best fit. They are cost-effective, reliable, and provide all necessary BYOD connectivity in a single chassis.
    *   **Large Boardrooms / Divisible Rooms:** AVoIP (NetworkHD 500 series) becomes highly advantageous here. It offers scalability to add more sources/displays easily, simplifies routing to different room combinations, and supports integrated Dante audio for better voice lift and conferencing audio.

*   **Education (Classroom, Lecture Hall):**
    *   **Standard Classroom:** Reliability and simplicity are key. An HDBaseT matrix switcher is an excellent choice, providing robust long-distance transmission to projectors or displays from a central lectern.
    *   **Large Lecture Halls / University Campuses:** AVoIP is the superior solution. It allows for overflow rooms, lecture capture streaming (with NHD-300 encoders), and campus-wide content distribution. The ability to route any source to any display across the network is a massive benefit.

*   **Hospitality (Sports Bar, Venue):**
    *   This is a prime use case for AVoIP (NetworkHD 500). The need to route many sources (e.g., 8-16 satellite decoders) to many displays (e.g., 10-50 screens) makes a traditional matrix expensive and inflexible. AVoIP allows for an 'any-to-any' configuration that can be easily controlled by staff from a tablet (NetworkHD Touch App).

*   **Command & Control / Operations Centers:**
    *   Latency and image quality are critical. For these applications, the NetworkHD 600 Series (SDVoE) is the recommended solution. It provides lossless, zero-latency 4K60 video over a 10GbE network, which is essential for monitoring critical data feeds. Video wall and multiview capabilities are also native to this platform.

---

### Section 2: Technology Mapping Rules (Requirement -> Product Feature)

This section provides hard rules for selecting products based on specific technical requirements.

*   **Resolution & HDR:**
    *   **Requirement: 4K60 4:4:4 or Dolby Vision.**
    *   **Rule:** This requires a full 18Gbps bandwidth pipeline.
    *   **Products:** HDBaseT 3.0 solutions (e.g., MX-0403-H3-MST, APO-210-UC), NetworkHD 500 Series, or NetworkHD 600 Series. HDBaseT 2.0 products are NOT suitable.

*   **BYOD & USB:**
    *   **Requirement: Full BYOD (user connects laptop to use room camera/mic).**
    *   **Rule:** The system MUST support USB 2.0 (or higher) extension and switching alongside video.
    *   **Products:** Apollo UC series (APO-210-UC, APO-VX20-UC), HDBaseT 3.0 matrixes (MX-0403-H3-MST), or KVM-capable AVoIP (NetworkHD 500/600).

*   **Wireless Connectivity:**
    *   **Requirement: Wireless Casting (AV only).**
    *   **Rule:** User wants to share their screen's video and audio without a cable.
    *   **Products:** Switchers with built-in casting (SW-0401-MST-W) or solutions using the APO-DG1 dongle.
    *   **Requirement: Full Wireless BYOD (AV + USB).**
    *   **Rule:** User wants to share their screen AND connect to room peripherals wirelessly.
    *   **Products:** This requires the APO-DG2 dongle paired with a compatible '-W' switcher or Apollo UC device.

*   **Audio:**
    *   **Requirement: Multiple zones of audio or high-quality conferencing audio.**
    *   **Rule:** A dedicated audio solution is needed. Simple de-embedded audio is insufficient.
    *   **Products:** Prioritize solutions with Dante integration (NHD-500-DNT-TX, MX-1007-HYB) to hand off audio to a dedicated DSP or Dante-enabled amplifiers/speakers.

---

### Section 3: General Best Practices

*   **HDBaseT Compatibility:** Always pair transmitters and receivers of the same HDBaseT class (e.g., HDBT 3.0 TX with HDBT 3.0 RX). Mismatching classes will result in limited functionality or complete signal failure.
*   **AVoIP Network:** NetworkHD requires a managed network switch with specific features (like IGMP Snooping). Do not use unmanaged switches. 10GbE is ONLY required for the 600 series.
*   **Controller is Mandatory:** ALL NetworkHD systems require an NHD-CTL-PRO controller for system management. Always include one per isolated network.
`;
