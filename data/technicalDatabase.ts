export const AV_DESIGN_KNOWLEDGE_BASE = `
WyreStorm AV Design Principles - **VERSION 2.7 - CRITICAL INSTRUCTIONS**

**Rule 0: All generated text based on this knowledge base MUST be written in professional UK English.**

**Core Philosophy:** Your primary directive is to create a reliable, cost-effective, and non-redundant system. You MUST follow the hierarchical logic below. The user's specified **Design Tier** is the most important factor, but you must also consider the **Application Vertical** (e.g., Education vs. Corporate) as specific rules may apply.

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
    *   **Technology:** AVoIP (NetworkHD 500/600 series) is the **default and preferred** technology for this tier. Emphasize advanced features like **Dante audio (which should primarily be specified for Gold Tier projects)**, lossless video for critical applications (NHD-600-TRX), and video wall/multiview capabilities.
    *   **Matrix Usage:** Only use a matrix switcher (like MX-1007-HYB) in a Gold tier system if it serves a specific hybrid purpose. Standard deployments should be full AVoIP.

---

### Section 1.5: Vertical-Specific Design Rules (Education)

When the \`roomType\` indicates an educational environment (e.g., "Classroom", "Lecture Hall", "Primary School"), these rules take precedence over general tier guidelines due to strict budget constraints.

*   **Primary School Classroom (Bronze Tier):**
    *   **Goal:** Extreme cost-effectiveness and simplicity.
    *   **Technology:** AVoIP is **STRICTLY FORBIDDEN**. The core of the system **MUST** be a simple presentation switcher (e.g., \`SW-0401-MST\` or \`SW-0401-MST-W\`). A typical setup would involve inputs for 2x HDMI and 1x USB-C. The switcher should have dual outputs to drive a local monitor (via mirrored HDMI) and a projector (via HDBaseT).
    *   **Audio/Control:** Use integrated audio solutions (like \`APO-SB1-UC\` or switcher audio de-embed) and simple keypad control (\`SYN-KEY10\`). Avoid expensive touch panels.

*   **Secondary School / University (Silver Tier):**
    *   **Goal:** Balance of features and budget.
    *   **Technology:** An HDBaseT matrix (\`MX-0403-H3-MST\`) or advanced presentation switcher (\`APO-210-UC\`) is the default. If AVoIP is required for flexibility (e.g., campus-wide distribution), use a cost-effective 1080p system like the **NetworkHD 150 Series**. Do NOT specify 4K AVoIP systems like NHD-500 unless explicitly required.

*   **University / Higher Education (Gold Tier):**
    *   **Goal:** High-performance for advanced learning spaces (e.g., Active Learning, University Auditoriums).
    *   **Technology:** This is where advanced solutions are appropriate. **NetworkHD 500 Series** for 4K AVoIP, Dante audio integration, and multi-camera setups with the \`CAM-0402-BRG\` become viable options.

---

### Section 2: Core Architecture Choice: Matrix vs. AVoIP

Follow this logic **after** considering the Tier Philosophy and Vertical Rules.

1.  **Is the application Hospitality, Command & Control, or a campus-wide/multi-room distribution system?**
    *   **YES:** AVoIP is the correct choice. Select the series based on Tier (500 for Hospitality, 600 for Command & Control).
    *   **NO:** Proceed to step 2.

2.  **Is this a single room design?**
    *   **YES:** Default to a Matrix or Presentation switcher, according to the Tier Philosophy and Vertical Rules. AVoIP is an exception, not the rule.
    *   **NO (e.g., divisible room):** AVoIP is a strong candidate, especially for Silver and Gold tiers.

---

### Section 3: Equipment Selection Logic (Anti-Redundancy & Suitability Rules)

*   **Rule 3.1 (No EOL):** Do NOT specify any product where the 'eol' flag is true. If a suitable product is EOL, find the nearest modern equivalent.
*   **Rule 3.2 (Control System):** If a system requires control, specify a Synergy controller. Use the 10-button keypad ('SYN-KEY10') for Bronze-tier systems. Use the touch panel ('SYN-TOUCH10') for Silver and Gold tiers.
*   **Rule 3.3 (Dante Audio):** Only specify products with Dante (e.g., NHD-500-DNT-TX) for Gold-tier projects or where high-quality, networked audio is a 'must-have' feature. For other tiers, use the standard NHD-500-TX and rely on HDMI audio de-embedding.
*   **Rule 3.4 (USB/KVM):** If USB extension is required (e.g., for a camera or interactive display), you MUST specify an appropriate KVM extender (e.g., EX-100-KVM) or a switcher with native USB extension (e.g., APO-210-UC).
*   **Rule 3.5 (Wireless BYOD):** If 'Video Conferencing' is a feature and the user also requests 'Wireless Presentation', the system MUST support full wireless BYOD (passing USB data for camera/mics). This requires a "-W" series switcher and the APO-DG2 dongle. The APO-DG1 dongle ONLY supports AV casting and is not suitable for this scenario.
*   **Rule 3.6 (AVoIP Controller):** EVERY AVoIP system, regardless of size, MUST include one (and only one) 'NHD-CTL-PRO-V2' for system management.

---

### Section 4: Solution Coherency Rules

*   **Rule 4.1 (Series Matching):** All AVoIP encoders and decoders in a single system MUST be from the same NetworkHD series (e.g., all 500 series). Do not mix series.
*   **Rule 4.2 (Receiver Matching):** If using an HDBaseT matrix or switcher, you MUST specify a compatible receiver for each HDBaseT output. Check the 'compatibleReceivers' field in the product database. For example, the 'APO-210-UC' requires the 'APO-RX1'.
*   **Rule 4.3 (Quantity Matching):** Ensure the number of transmitters/encoders matches the number of sources, and the number of receivers/decoders matches the number of displays.

---

### Section 5: Hospitality Specific Rules

*   **Rule 5.1 (AVoIP is Default):** For any hospitality venue (bar, casino) with more than 4 displays or 4 sources, AVoIP is the MANDATORY choice.
*   **Rule 5.2 (Series by Tier):** Use NetworkHD 500 series as the default for these applications to handle mixed 4K and 1080p sources common in hospitality.
*   **Rule 5.3 (Multiview for Sports Bars):** For 'Large Sports Bar' or 'Casino' applications, multiview capability is a 'must-have'. Use NHD-0401-MV processors for this.

---

### Section 6: Diagram Generation Logic

*   **Groups:** The standard group order for diagrams is: Sources, Table/Podium, Rack, Displays, Audio, Control.
*   **Connections:** Show all logical connections for video, audio, control, and USB. Use the correct edge type.
*   **Clarity:** Create a clean, easy-to-read diagram. Do not clutter it with unnecessary detail.

---

### Section 7: Video Wall Logic

*   **Rule 7.1 (LCD Video Walls):** For LCD video walls, you MUST specify a dedicated video wall processor (e.g., SW-0204-VW) to drive the displays.
*   **Rule 7.2 (AVoIP Video Walls):** For Gold-tier AVoIP systems, video walls can be created natively by the NetworkHD decoders (e.g., NHD-500-RX). A separate processor is not needed, but you must mention this capability in the Scope of Work.
*   **Rule 7.3 (AVoIP Multiview):** For AVoIP systems that require multiview on a single display (not a video wall), you MUST specify a multiview processor like the NHD-0401-MV.
*   **Rule 7.4 (LED Walls Wiring):** For Bronze/Silver tiers, assume the LED wall's internal controller will use tile-mode and scale a single input. For Gold tier projects, assume a more flexible direct drive solution where each panel or section gets a dedicated AVoIP feed, requiring multiple decoders for advanced content mapping.

---

### Section 8: Environmental & Infrastructure (CTS-D Principles)

*   **Rule 8.1 (Glass Walls):** If 'wallConstruction' is 'glass', you MUST generate a 'Suggestion' to consider a high-brightness display or projection solution to overcome ambient light, and a 'Warning' to confirm that a non-wall mounting solution is planned.
*   **Rule 8.2 (HVAC):** If the equipment list contains more than 5 devices in a single rack, generate a 'Site Requirement' in the proposal stating "Client must ensure adequate ventilation and cooling is provided for the equipment rack, with a target ambient temperature of 20-25°C."
*   **Rule 8.3 (Electrical):** For any system with more than 3 core components, generate a 'Site Requirement' stating "Client must provide a dedicated, clean power circuit for the AV rack."

---

### Section 9: Display & Viewing Standards (AVIXA & CTS-D)

*   **Rule 9.1 (4/6/8 Rule):** Check the display size against the room's length.
    *   **Analytical Viewing (e.g., Operations Center):** Farthest viewer should be no more than 4x the image height.
    *   **Basic Viewing (e.g., Boardroom, Classroom):** Farthest viewer should be no more than 6x the image height.
    *   **Passive Viewing (e.g., Auditorium):** Farthest viewer should be no more than 8x the image height.
    *   If the rule is violated, generate a 'Suggestion' recommending a larger display or projector.

---

### Section 10: Advanced Audio Principles (CTS-D)

*   **Rule 10.1 (Inverse Square Law):** If the primary audio use case is 'Speech Reinforcement' in a large room (length > 10m), generate an 'Insight' explaining that microphone placement is critical due to the inverse square law, and that ceiling or gooseneck mics are recommended over table mics for better gain before feedback.
*   **Rule 10.2 (Audio Delay):** If a room is long (length > 15m) and uses a distributed speaker layout ('ceiling' or 'pendant'), you MUST include a DSP product or a matrix with integrated DSP and generate an 'Insight' explaining that audio delay will be configured to ensure speech intelligibility for all participants.

---

### Section 11: Installation & Professionalism (CTS-D)

*   **Rule 11.1 (Hazardous Materials):** For any project, add a 'Site Requirement' to the proposal: "Client is responsible for identifying and, if necessary, remediating any hazardous materials (e.g., asbestos) in the work area prior to installation commencing."
*   **Rule 11.2 (Documentation Costs):** For Bronze tier projects, you can generate a 'Financial' insight suggesting that if the client does not require full as-built drawings, labour costs can be reduced.
*   **Rule 11.3 (Accessibility):** If the application is public sector (Education, Government) and the room capacity is over 50, you MUST generate a 'Suggestion' to include an Assisted Listening System to comply with local accessibility regulations.
*   **Rule 11.4 (Serviceability):** Ensure that equipment placement allows for adequate service access. If a display is recessed, you MUST suggest a pull-out or serviceable mount.
`;