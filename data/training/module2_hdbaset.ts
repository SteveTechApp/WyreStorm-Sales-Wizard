import { TrainingModule } from '../../utils/types.ts';

export const MODULE_2_HDBASET: TrainingModule = {
  id: 'module2_hdbaset',
  title: 'HDBaseT Fundamentals',
  contentPages: [
    {
      title: 'What is HDBaseT?',
      content: [
        '# What is HDBaseT?',
        '',
        'HDBaseT is a global standard for the transmission of ultra-high-definition video & audio, Ethernet, controls, USB, and power over a single, long-distance cable.',
        '',
        'For the professional AV market, it has become the de-facto standard for extending signals in commercial environments like conference rooms, classrooms, and digital signage applications.',
        '',
        '### The Problem it Solves',
        'Standard HDMI cables have a very limited effective range, typically maxing out around 15 meters (50 ft) for 1080p, and even less for reliable 4K. HDBaseT allows you to extend those same signals up to 100 meters (328 ft) over a standard, cost-effective Category cable (Cat6/6a).',
        '',
        '### How it Works',
        'An HDBaseT system consists of two components:',
        '- **Transmitter (TX):** Connects to the source device (e.g., laptop, media player). It converts the AV and control signals into a format that can be sent over the category cable.',
        '- **Receiver (RX):** Connects to the display device (e.g., TV, projector). It converts the signal back into its original format.'
      ].join('\n'),
      asset: {
        url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/hdbaset_tx_rx.png',
        title: 'HDBaseT Transmitter and Receiver',
        type: 'diagram',
      },
    },
    {
      title: 'HDBaseT Classes & Versions',
      content: [
        '# HDBaseT Classes & Versions',
        '',
        'Not all HDBaseT is created equal. The capabilities, especially distance, vary by class and version.',
        '',
        '### HDBaseT Classes',
        '- **Class A (Full HDBaseT):**',
        '  - **Distance:** Up to 100m (328ft)',
        '  - Supports the full 5-Play feature set (explained on the next page).',
        '  - WyreStorm Example: **EX-100-G2**',
        '- **Class B (HDBaseT Lite):**',
        '  - **Distance:** Up to 70m (230ft) for 1080p, 35-40m for 4K.',
        '  - A more cost-effective solution that supports video, audio, power, and control, but typically not Ethernet.',
        '  - WyreStorm Example: **EX-70-G2**',
        '- **Class C:**',
        '  - Similar to Class B but often with specific feature optimizations.',
        '',
        '### HDBaseT Versions',
        '- **HDBaseT 1.0/2.0:** The most common versions, supporting up to 4K/30Hz 4:4:4 or 4K/60Hz 4:2:0.',
        '- **HDBaseT 3.0 (VS3000 chipset):** The latest generation.',
        '  - **Uncompressed Video:** Can transmit uncompressed 4K/60Hz 4:4:4 and even 5K signals.',
        '  - **Full USB 2.0:** Supports high-speed USB for webcams and peripherals.',
        '  - WyreStorm Example: **MX-0403-H3-MST**',
        '',
        '**Key Takeaway:** Always check the class and version to ensure the extender meets the distance and feature requirements of the application.'
      ].join('\n'),
    },
    {
      title: 'The 5-Play Feature Set',
      content: [
        '# The "5-Play" Feature Set',
        '',
        'The term "5-Play" is often used to describe the five key functionalities that a full HDBaseT (Class A) system can deliver over a single category cable.',
        '',
        '### The 5 Plays',
        '1.  **Ultra-HD Video & Audio:** Uncompressed or visually lossless video and all standard audio formats.',
        '2.  **Ethernet:** 100BaseT Ethernet, allowing you to provide a network connection to a smart TV or other device at the display location.',
        '3.  **Control:** Bi-directional control signals, most commonly **RS-232** and **Infrared (IR)**. This allows a control system to turn a display on/off, or a display\'s remote to control the source.',
        '4.  **USB:** Can support USB 2.0 extension for keyboards, mice, and webcams (KVM functionality). HDBaseT 3.0 significantly improves this.',
        '5.  **Power (PoH/PoC):** Power over HDBaseT (or Power over Cable). This allows the transmitter to power the receiver, or vice versa. This is incredibly useful as it means you only need one power outlet for the entire extender set.',
        '',
        '**Practical Application:** In a conference room, you could have a transmitter in the table and a receiver behind the display. With a single Cat6 cable, you can send video, provide a wired network jack at the table, control the display\'s power, and power the receiver, eliminating the need for an electrician to install an outlet behind the TV.'
      ].join('\n'),
      asset: {
        url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/5-play.png',
        title: 'HDBaseT 5-Play Features',
        type: 'diagram',
      },
    },
  ],
  quiz: [
    {
      question: "A client needs to connect a laptop at a conference table to a display that is 90 meters away. Which HDBaseT class is required to guarantee performance over this distance?",
      options: ["Class B", "Class A", "Class C", "Any HDBaseT class will work"],
      correctAnswer: "Class A",
      explanation: "HDBaseT Class A is the only class rated for transmission up to 100 meters. Class B is limited to 70 meters for 1080p."
    },
    {
      question: "You are explaining the benefits of HDBaseT to a customer. Which feature is NOT something you would mention as part of the '5-Play' standard?",
      options: ["Power over HDBaseT (PoH)", "Extending a Wi-Fi signal", "100Mbps Ethernet Passthrough", "Bi-directional IR and RS-232 Control"],
      correctAnswer: "Extending a Wi-Fi signal",
      explanation: "HDBaseT is a wired standard. The 5-Play set includes Video/Audio, Ethernet, Control, USB, and Power. Wi-Fi is a separate, wireless technology."
    },
    {
      question: "A client is concerned about the cost of getting a new power outlet installed behind their wall-mounted TV. How does Power over HDBaseT (PoH) solve this problem?",
      options: ["It makes the TV wireless", "It allows the transmitter at the source location to power the receiver at the TV over the same Cat cable", "It reduces the power consumption of the TV", "It doesn't, you still need a power outlet"],
      correctAnswer: "It allows the transmitter at the source location to power the receiver at the TV over the same Cat cable",
      explanation: "PoH is a key sales feature because it saves the client money on electrical work by eliminating the need for a power outlet at one end of the link."
    },
    {
      question: "An engineering firm client insists on having 'zero compromise' on video quality for their 4K CAD workstations. Which HDBaseT version should you specify in your proposal to meet this need?",
      options: ["HDBaseT 1.0", "HDBaseT 2.0", "HDBaseT 3.0", "HDBaseT Lite"],
      correctAnswer: "HDBaseT 3.0",
      explanation: "HDBaseT 3.0 is the only version with enough bandwidth to transmit uncompressed 4K/60Hz 4:4:4 video, which is essential for the sharp lines and text found in CAD drawings."
    }
  ]
};
