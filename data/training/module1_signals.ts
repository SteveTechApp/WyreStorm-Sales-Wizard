import { TrainingModule } from '../../utils/types.ts';

export const MODULE_1_SIGNALS: TrainingModule = {
  id: 'module1_signals',
  title: 'AV Signals & Standards',
  contentPages: [
    {
      title: 'Understanding Resolution',
      content: [
        '# Understanding Resolution',
        '',
        "Resolution refers to the number of distinct pixels in each dimension that can be displayed. It's usually quoted as width × height, with the units in pixels.",
        '',
        '### Common Resolutions',
        '- **SD (Standard Definition):** 720x480 (NTSC) or 720x576 (PAL). Largely obsolete.',
        '- **HD (High Definition) / 720p:** 1280x720 pixels.',
        '- **FHD (Full High Definition) / 1080p:** 1920x1080 pixels. Still a very common standard for broadcast and basic conferencing.',
        '- **QHD (Quad High Definition) / 1440p:** 2560x1440 pixels. Common for computer monitors.',
        '- **UHD (Ultra High Definition) / 4K:** 3840x2160 pixels. The modern standard for high-quality displays and content. It has four times the pixels of 1080p.',
        '- **DCI 4K:** 4096x2160 pixels. A slightly wider version of 4K used in professional cinema.',
        '',
        '**Key Takeaway:** Higher resolution means a sharper, more detailed image, but it also requires more bandwidth to transmit.'
      ].join('\n'),
    },
    {
      title: 'Chroma Subsampling',
      content: [
        '# What is Chroma Subsampling?',
        '',
        'Chroma subsampling is a type of compression that reduces the color information in a signal in favor of luminance data. The human eye is less sensitive to changes in color than to changes in brightness, so this is a clever way to save bandwidth without a significant perceptible loss in quality for motion video.',
        '',
        "It's expressed as a three-part ratio, such as **4:4:4**, **4:2:2**, or **4:2:0**.",
        '',
        '### The Ratios',
        '- **4:4:4:** No compression. Every pixel has unique color and brightness information. This is crucial for computer-generated text and graphics to appear sharp and clear.',
        '- **4:2:2:** Half horizontal chroma resolution. The color information is sampled from pairs of pixels.',
        '- **4:2:0:** Quarter chroma resolution. Color information is sampled from a 2x2 block of pixels. This is the most common for streaming services and Blu-ray, as it offers the best bandwidth savings.',
        '',
        "**Why it Matters:** While 4:2:0 is fine for movies, it can make text and fine lines (like in a spreadsheet) look blurry or have color artifacts. For presentation systems, **4:4:4 is always preferred** to ensure maximum clarity."
      ].join('\n'),
    },
    {
      title: 'HDCP - Content Protection',
      content: [
        '# HDCP: High-bandwidth Digital Content Protection',
        '',
        'HDCP is a form of digital copy protection developed by Intel Corporation to prevent copying of digital audio & video content as it travels across connections.',
        '',
        '### How it Works',
        '1.  **Handshake:** When you connect an HDCP-compliant source (like a Blu-ray player) to an HDCP-compliant display, they perform a "handshake".',
        '2.  **Authentication:** The source asks the display, "Are you a licensed device allowed to receive my content?"',
        '3.  **Key Exchange:** If the display provides a valid key, the source encrypts the content and sends it. The display then decrypts it for viewing.',
        '',
        '### Versions and Compatibility',
        '- **HDCP 1.4:** Designed for 1080p content.',
        '- **HDCP 2.2 / 2.3:** Required for 4K UHD content from sources like 4K Blu-ray players, streaming services (Netflix, Disney+), and modern game consoles.',
        '',
        "**The Golden Rule:** Every single device in the signal chain (source, switcher, extender, display) MUST support the same or a newer version of HDCP. If even one device is not compliant, you will get a black screen or an HDCP error message. This is one of the most common troubleshooting issues in AV."
      ].join('\n'),
      links: [
        { url: 'https://www.hdmi.org/spec/hdcp', text: 'Official HDCP Specification' },
      ],
    },
  ],
  quiz: [
    {
      question: "A client says they need 'better than 1080p' for their new boardroom display. Which resolution offers a significant, 4x increase in detail?",
      options: ["720p", "1440p", "4K UHD", "DCI 4K"],
      correctAnswer: "4K UHD",
      explanation: "4K UHD (3840x2160) is the modern standard for high-quality displays and has four times the pixels of 1080p, providing a much sharper image for detailed content."
    },
    {
      question: "A client complains that text from their PC looks 'fuzzy' on their meeting room display. What technical specification is likely the cause and should be specified as 4:4:4 in your solution?",
      options: ["Resolution", "Chroma Subsampling", "HDCP", "Frame Rate"],
      correctAnswer: "Chroma Subsampling",
      explanation: "Chroma subsampling like 4:2:0 saves bandwidth but can make computer-generated text look blurry. Specifying a system that supports 4:4:4 chroma ensures maximum text clarity."
    },
    {
      question: "A customer wants to play 4K movies from a new player in their boardroom. What content protection standard must every device in your proposed signal chain support?",
      options: ["HDCP 1.4", "HDCP 2.2", "CEC", "HDMI 2.0"],
      correctAnswer: "HDCP 2.2",
      explanation: "To play protected 4K content, every single device in the signal path (source, switcher, extender, display) must support HDCP 2.2 or newer."
    },
    {
      question: "If a client calls you saying their new 4K system is just showing a black screen when they play a movie, what is the most common copy protection issue you should ask them about first?",
      options: ["The cables are too long", "The resolution is set too high", "There might be an HDCP handshake issue between their devices", "The TV is on the wrong input"],
      correctAnswer: "There might be an HDCP handshake issue between their devices",
      explanation: "An HDCP handshake failure is the most common reason for a black screen when playing protected content. It means one device in the chain is not compliant, so the source refuses to send the video."
    }
  ]
};