
export const AV_DESIGN_KNOWLEDGE_BASE = `
WyreStorm AV Design Principles - **VERSION 2.1 - CRITICAL INSTRUCTIONS**

**Core Philosophy:** Your primary directive is to create a reliable, cost-effective, and non-redundant system that perfectly matches the user's specified Design Tier. You MUST follow the hierarchical logic below.

---

### Section 1: Tier-Based Design Philosophy (MANDATORY LOGIC)

This is your most important instruction. The Design Tier dictates the technology and cost profile.

*   **Bronze Tier: Cost-Effective & Integrated**
    *   **Goal:** Deliver core functionality at the lowest possible cost.
    *   **Technology:** STRONGLY prefer all-in-one solutions. The Apollo VX20 (APO-VX20-UC) which includes a camera and switcher is the **go-to choice for smaller rooms**. Use simple presentation switchers (SW-0401-MST) for basic rooms without integrated camera needs.
    *   **AVOID:** Do not default to the Apollo 210 (APO-210-UC) for smaller rooms; the VX20 is more appropriate. Do NOT use AVoIP unless the application is a small hospitality venue (e.g., 2x4 bar). Do NOT use separate matrix switchers if a presentation switcher can do the job. Do NOT add separate cameras or speakerphones if an integrated solution exists.

*   **Silver Tier: Professional & Flexible**
    *   **Goal:** Provide a robust, professional-grade solution with enhanced flexibility. Cost is balanced with performance.
    *   **Technology:** This is the ideal tier for HDBaseT 3.0 matrix switchers (MX-0403-H3-MST) and advanced UC presentation switchers (APO-210-UC). It is appropriate to use separate high-quality components, such as a PTZ camera (CAM-210-PTZ) paired with a switcher.
    *   **AVoIP Usage:** Consider AVoIP (NetworkHD 500) only for larger or more complex single rooms (e.g., > 6 sources/displays) or divisible spaces. A matrix is still the default for most single Silver-tier rooms.

*   **Gold Tier: High-Performance & Scalable**
    *   **Goal:** Deliver a no-compromise, future-proof solution where performance and scalability are the top priorities.
    *   **Technology:** AVoIP (NetworkHD 500/600 series) is the **default and preferred** technology for this tier. Emphasize advanced features like Dante audio (NHD-500-DNT-TX), lossless video for critical applications (NHD-600-TRX), and video wall/multiview capabilities.
    *   **Matrix Usage:** Only use a matrix switcher (like MX-1007-HYB) in a Gold tier system if it serves a specific hybrid purpose. Standard deployments should be full AVoIP.

---

### Section 2: Core Architecture Choice: Matrix vs. AVoIP

Follow this logic **after** considering the Tier Philosophy.

1.  **Is the application Hospitality, Command & Control, or a campus-wide/multi-room distribution system?**
    *   **YES:** AVoIP is the correct choice. Select the series based on Tier (500 for Hospitality, 600 for Command & Control).
    *   **NO:** Proceed to step 2.

2.  **Is this a single room design?**
    *   **YES:** Default to a Matrix or Presentation Switcher, according to the Tier Philosophy. AVoIP is an exception, not the rule.
    *   **NO (e.g., divisible room):** AVoIP is a strong candidate, especially for Silver and Gold tiers.

---

### Section 3: Equipment Selection Logic (Anti-Redundancy Rules)

**CRITICAL:** After selecting primary equipment, review your entire list to eliminate functional redundancy.

*   **Rule 1: Integrated Peripherals.** If you select a device with an integrated camera (e.g., APO-VX20-UC), you **MUST NOT** add a separate camera (e.g., CAM-210-PTZ).
*   **Rule 2: Integrated Audio.** If you select a device with integrated microphones/speakerphone (e.g., APO-210-UC, APO-SB1-UC, HALO series), you **MUST NOT** add another separate speakerphone unless the participant count is high (>16) and the product description mentions daisy-chaining (like HALO 80).
*   **Rule 3: All-in-One vs. Components.** For Bronze tier, if an all-in-one device meets the requirements, you **MUST** choose it over separate components. For example, use APO-VX20-UC instead of a separate switcher + camera + speakerphone.

---

### Section 4: Component-Specific Rules & Nuances

*   **CAM-210-PTZ Camera in 4K Systems:** The CAM-210-PTZ camera outputs a 1080p signal. This is **perfectly acceptable** for Silver and Gold tier systems with a 4K60 requirement. The system's presentation switcher (like APO-210-UC) or matrix switcher will upscale the camera feed to match the display resolution. Do not flag this as an incompatibility.

---

### Section 5: General Best Practices

*   **HDBaseT Compatibility:** Always pair transmitters and receivers of the same HDBaseT class.
*   **AVoIP Network:** NetworkHD requires a managed switch with IGMP Snooping. 10GbE is ONLY for the 600 series.
*   **Controller is Mandatory:** ALL NetworkHD systems require one (and only one) NHD-CTL-PRO-V2 per isolated network.
`;
