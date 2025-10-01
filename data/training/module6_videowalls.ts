import { TrainingModule } from '../../utils/types.ts';

export const MODULE_6_VIDEOWALLS: TrainingModule = {
  id: 'module6_videowalls',
  title: 'Video Wall Design',
  contentPages: [
    {
      title: 'Types of Video Walls',
      content: [
        '# Types of Video Walls',
        '',
        'A video wall is a large visualization surface built from multiple smaller displays. They are used when a single display is not large enough or does not have a high enough resolution.',
        '',
        '### LCD Video Walls',
        '- **Construction:** Made from multiple commercial-grade LCD panels with ultra-thin bezels.',
        '- **Pros:** High resolution (each panel is typically 1080p or 4K), very bright, relatively cost-effective for their size.',
        '- **Cons:** The lines (bezels) between the panels are visible, which can interrupt the image.',
        '- **Use Case:** Corporate lobbies, retail signage, and most command & control rooms.',
        '',
        '### Direct View LED (dvLED)',
        '- **Construction:** Made from modular LED panels (or "cabinets"). There are no bezels.',
        '- **Pros:** Completely seamless image, can be built to any size or shape, very high brightness, suitable for outdoor use.',
        '- **Cons:** Significantly more expensive, lower resolution per area (defined by "pixel pitch"), more complex to install and calibrate.',
        '- **Use Case:** Large-scale advertising billboards, concert stages, high-end broadcast studios, and premium boardrooms.'
      ].join('\n'),
    },
    {
      title: 'Key Design Considerations',
      content: [
        '# Key Design Considerations',
        '',
        'Designing a video wall involves more than just buying screens.',
        '',
        '### 1. Bezel Compensation',
        '- For LCD walls, the processor must account for the physical plastic border (bezel) around each screen.',
        '- Without bezel compensation, the image will look disjointed, as if parts are missing.',
        '- A good processor electronically removes the part of the image that would fall on the bezel, creating a more continuous and natural look across the screens.',
        '',
        '### 2. Processing Location',
        'Where does the video get split up to feed the individual screens?',
        '- **At the Source (Processor):** A dedicated video wall processor (like the **SW-0204-VW**) takes one input and splits it into multiple outputs, one for each screen. This is a simple and robust solution for single-source walls.',
        '- **At the Display (Decoder):** In an AVoIP system, a single video stream is sent over the network. Each display has its own decoder (**e.g., NHD-500-RX**) that is programmed to grab and display only its portion of the overall image. This is extremely flexible and scalable.',
        '',
        '### 3. Resolution',
        'The total resolution of the video wall is the sum of the resolutions of its panels. A 2x2 wall of 1080p screens creates a total 4K canvas (3840x2160). Your source and processing must be able to handle this high resolution.'
      ].join('\n'),
    },
    {
      title: 'WyreStorm Video Wall Solutions',
      content: [
        '# WyreStorm Video Wall Solutions',
        '',
        'WyreStorm offers several ways to build and drive a video wall, depending on the application\'s needs.',
        '',
        '### Standalone Processors',
        '- **SW-0204-VW & SW-0206-VW:** These are simple, dedicated video wall processors. They take a single 4K HDMI input and can drive common layouts like 2x2, 1x4, etc.',
        '- **Best for:** Simple, single-source applications like a menu board or a small retail display where flexibility is not the primary concern.',
        '',
        '### NetworkHD AVoIP',
        'This is the most powerful and flexible way to create a video wall.',
        '- **NHD-120-RX:** Can be configured in a video wall layout of up to 4x4. A very cost-effective solution for signage.',
        '- **NHD-150-RX:** A specialized multi-view decoder that can create a video wall layout and also display multiple sources on that wall simultaneously.',
        '- **NHD-500-RX:** Low-latency, visually lossless quality. Supports bezel correction and can be used to create video walls up to 16x16. This is the premium choice for corporate and control room video walls.',
        '',
        '**The AVoIP Advantage:** With NetworkHD, you can instantly switch from showing one large image across the entire wall to showing a different source on each individual screen. This flexibility is impossible with a basic standalone processor.'
      ].join('\n'),
    },
  ],
  quiz: [
    {
      question: "A high-end retail client wants a completely seamless video wall with no visible grid lines for their flagship store. Which display technology should you propose?",
      options: ["LCD Video Wall", "A single large projector", "Direct View LED (dvLED)", "A matrix of standard TVs"],
      correctAnswer: "Direct View LED (dvLED)",
      explanation: "dvLED is the correct choice for a seamless image, as it's made of modular panels with no bezels. This is a premium solution for clients who require the best visual impact."
    },
    {
      question: "When selling an LCD video wall, a customer is concerned about the image looking 'broken up' by the screen borders. What feature of a WyreStorm processor addresses this?",
      options: ["4K Upscaling", "Bezel Compensation", "HDCP 2.2", "Auto-Switching"],
      correctAnswer: "Bezel Compensation",
      explanation: "Bezel compensation is the specific feature that addresses this common customer concern. It electronically adjusts the image to make it appear continuous across the physical gaps between screens."
    },
    {
      question: "A client wants to show a single 4K source across their new 2x2 video wall, which is built from 1080p panels. Is this possible and why?",
      options: ["No, the source resolution is too high", "Yes, because a 2x2 grid of 1080p panels creates a native 4K resolution canvas", "No, you can only show 1080p content on 1080p panels", "Yes, but it will look stretched"],
      correctAnswer: "Yes, because a 2x2 grid of 1080p panels creates a native 4K resolution canvas",
      explanation: "This is a key concept. Four 1080p panels (1920x1080 each) combine to create one large 4K canvas (3840x2160), making it a perfect pixel-for-pixel match for a 4K source."
    },
    {
      question: "A command center client needs to sometimes see one large map across their video wall, and other times see 16 different camera feeds. Which WyreStorm technology provides this level of flexibility?",
      options: ["A standalone processor like the SW-0204-VW", "A standard HDBaseT extender", "A NetworkHD AVoIP system", "An HDMI matrix switcher"],
      correctAnswer: "A NetworkHD AVoIP system",
      explanation: "This is the core value proposition of AVoIP for video walls. Its flexibility allows a user to instantly switch from 'video wall mode' (one large image) to 'matrix mode' (individual sources on each screen)."
    }
  ]
};