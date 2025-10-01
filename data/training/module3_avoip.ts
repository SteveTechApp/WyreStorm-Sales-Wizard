import { TrainingModule } from '../../utils/types.ts';

export const MODULE_3_AVOIP: TrainingModule = {
  id: 'module3_avoip',
  title: 'Introduction to AV over IP',
  contentPages: [
    {
      title: 'What is AV over IP?',
      content: [
        '# What is AV over IP (AVoIP)?',
        '',
        'AV over IP refers to the use of standard network equipment to transmit and switch audio and video signals. Instead of using traditional, fixed-port matrix switchers, AVoIP uses a flexible system of **encoders** and **decoders** on a network.',
        '',
        '- **Encoder:** Connects to a source (e.g., media player, camera) and converts its AV signal into IP packets that can be sent over a network.',
        '- **Decoder:** Connects to a display and converts the IP packets from the network back into a standard AV signal (like HDMI).',
        '- **Network Switch:** A standard managed IP switch (like you\'d use for computers) acts as the "matrix", routing the packets from any encoder to any decoder.',
        '',
        '### The AVoIP Advantage',
        '- **Scalability:** An AVoIP system is not limited by a fixed number of inputs and outputs. Need to add another screen? Just add another decoder. Need a new source? Add an encoder. The system can grow with your needs.',
        '- **Flexibility:** Any source can be sent to any display, or to all displays simultaneously (multicasting). This is perfect for applications like sports bars, command centers, and digital signage.',
        '- **Distance:** The distance is limited only by the network infrastructure itself, which can easily span entire buildings or campuses using fiber optic cable.'
      ].join('\n'),
    },
    {
      title: 'WyreStorm NetworkHD Series',
      content: [
        '# WyreStorm\'s NetworkHD Series',
        '',
        'WyreStorm offers several series of AVoIP products, each using a different **codec** (a method for compressing and decompressing data) to suit different applications and budgets.',
        '',
        '### NetworkHD 100/200 Series (H.264/H.265)',
        '- **Codec:** H.264/H.265 (also used by YouTube, Netflix).',
        '- **Pros:** Very low bandwidth, highly scalable, cost-effective. Excellent for digital signage, hospitality, and large-scale distribution where some video compression is acceptable.',
        '- **Cons:** Higher latency (200-300ms), visible compression artifacts, especially on static text.',
        '',
        '### NetworkHD 400/500 Series (JPEG2000 / JPEG-XS)',
        '- **Codec:** A visually lossless, frame-based codec.',
        '- **Pros:** Low latency (~1 frame), excellent image quality with no visible artifacts. Supports advanced features like Dante audio (500 Series) and USB. The workhorse for high-quality corporate and education spaces.',
        '- **Cons:** Higher bandwidth than H.264 (typically 200-800Mbps).',
        '',
        '### NetworkHD 600 Series (Uncompressed)',
        '- **Codec:** None! It sends uncompressed video.',
        '- **Pros:** Zero latency, pixel-perfect image quality. The ultimate choice for mission-critical applications like medical imaging, command and control, and high-end residential.',
        '- **Cons:** Very high bandwidth, requires a 10GbE network infrastructure.'
      ].join('\n'),
      links: [
        { url: 'https://www.wyrestorm.com/networkhd/', text: 'Learn more about NetworkHD' },
      ],
    },
    {
      title: 'Basic Network Requirements',
      content: [
        '# Basic Network Requirements for AVoIP',
        '',
        "You can't just plug AVoIP encoders and decoders into any basic, unmanaged switch you buy at a retail store. AVoIP systems require a **managed network switch** with specific features.",
        '',
        '### Key Switch Features',
        '- **Gigabit Ports:** Most AVoIP systems (like the NetworkHD 100-500 series) require at least 1Gbps ports. The 600 series requires 10Gbps ports.',
        '- **PoE (Power over Ethernet):** Just like PoH for HDBaseT, PoE allows the network switch to power the encoders and decoders, drastically simplifying wiring. Ensure the switch\'s "PoE budget" is sufficient for all your devices.',
        '- **IGMP Snooping:** This is the most critical feature. IGMP (Internet Group Management Protocol) snooping ensures that video traffic (multicast) only goes to the ports that have requested it. Without IGMP Snooping, a single video stream would flood the entire network, causing it to crash.',
        '',
        '**Configuration is Key:** While the hardware is standard IT equipment, it must be configured correctly for AVoIP. WyreStorm provides configuration guides and pre-configured switches to simplify this process. Using an un-configured or underspecified switch is the #1 cause of AVoIP system failures.'
      ].join('\n'),
    },
  ],
  quiz: [
    {
      question: "Your client wants to add a new satellite receiver to their AVoIP system. What WyreStorm device do you need to sell them to connect this new source to the network?",
      options: ["Decoder", "Encoder", "Network Switch", "Matrix Switcher"],
      correctAnswer: "Encoder",
      explanation: "To add a new source to an AVoIP system, you always need an Encoder to convert the source's signal into IP packets for the network."
    },
    {
      question: "A client is building a high-end command center where video latency is unacceptable. Which NetworkHD series is the only appropriate choice to propose?",
      options: ["100 Series (H.264)", "500 Series (JPEG-XS)", "600 Series (Uncompressed)", "Any series will work"],
      correctAnswer: "600 Series (Uncompressed)",
      explanation: "The 600 Series sends uncompressed video, resulting in zero latency. This is a critical requirement for command and control or medical applications where any delay is unacceptable."
    },
    {
      question: "When selling a NetworkHD system that will be installed on a client's existing network, what is the most critical feature you must confirm their network switch supports?",
      options: ["PoE (Power over Ethernet)", "10GbE Ports", "IGMP Snooping", "It must be a WyreStorm brand switch"],
      correctAnswer: "IGMP Snooping",
      explanation: "Without IGMP Snooping, multicast video traffic will flood the client's entire network, potentially crashing it. Confirming the switch supports this is the most critical step."
    },
    {
      question: "A sports bar owner wants to be able to add more TVs and sources in the future without replacing the core system. What is the key advantage of an AVoIP system that you would highlight?",
      options: ["It has better picture quality", "It's easier to install", "Its scalability, allowing them to easily add more endpoints as their business grows", "It uses less power"],
      correctAnswer: "Its scalability, allowing them to easily add more endpoints as their business grows",
      explanation: "The biggest sales advantage of AVoIP for a growing business is its scalability. They can start with the system they need today and easily expand it tomorrow by simply adding more encoders and decoders."
    }
  ]
};