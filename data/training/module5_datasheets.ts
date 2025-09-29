import { TrainingModule } from '../../utils/types.ts';

export const MODULE_5_DATASHEETS: TrainingModule = {
  id: 'module5_datasheets',
  title: 'How to Read a Datasheet',
  contentPages: [
    {
      title: 'The Header & Overview',
      content: [
        '# Reading a Datasheet: The Header & Overview',
        '',
        "A product datasheet is the single source of truth for a product's capabilities. Let's break down how to read a typical WyreStorm datasheet, using the **APO-210-UC** as an example.",
        '',
        '### Header Section',
        "This is where you'll find the most critical, at-a-glance information:",
        '- **Product Name:** Apollo 210 UC Conferencing Speakerphone & Switcher',
        '- **SKU:** APO-210-UC',
        '- **Short Description:** A one-sentence summary of what the product is and its main application.',
        '- **Key Features:** A bulleted list of the most important selling points (e.g., "USB-C & HDMI input", "Dual-View", "Airplay & Miracast"). This is the first place to check if a product meets your core requirements.',
        '',
        '### Overview/Description',
        "Below the header, you'll find a more detailed paragraph describing the product's purpose, ideal use cases, and how it solves common problems. This section provides context for the technical specifications that follow.",
        '',
        "**Example for APO-210-UC:** The overview would explain that it's designed for medium-sized conference rooms, combining switching, scaling, speakerphone, and wireless casting into one device to simplify BYOM (Bring Your Own Meeting) setups."
      ].join('\n'),
      asset: {
        url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/datasheet_header.png',
        title: 'Example Datasheet Header',
        type: 'image',
      },
    },
    {
      title: 'Key Specifications',
      content: [
        '# Decoding Key Specifications',
        '',
        "The specifications table is the heart of the datasheet. Here's what to look for:",
        '',
        '### Video',
        '- **Inputs/Outputs:** Tells you the number and type of connections (e.g., 1x HDMI In, 1x USB-C In, 1x HDMI Out).',
        '- **Max Resolution:** The highest video signal it can handle (e.g., `3840x2160p @ 60Hz 4:4:4`). This is critical.',
        '- **Data Rate:** The maximum bandwidth it can process (e.g., `18Gbps`). This must be high enough for the desired resolution and chroma subsampling.',
        '- **HDCP:** The version of content protection supported (e.g., `HDCP 2.2`).',
        '',
        '### Audio',
        '- **Inputs/Outputs:** Specifies analog or digital audio connections (e.g., `1x Audio Out (3.5mm Stereo)`).',
        '- **Audio Formats:** Lists the supported formats (e.g., `2ch LPCM, Dolby, DTS`).',
        '- **DSP Features:** Details on built-in audio processing, like **AEC (Acoustic Echo Cancellation)**, which is vital for conferencing.',
        '',
        '### Control',
        '- **Control Ports:** Lists the available control methods (e.g., `RS-232`, `IR Sensor`, `IP Control`).',
        '- **CEC:** Indicates if it supports Consumer Electronics Control for basic display power on/off.',
        '',
        '### General',
        '- **Power:** Shows the power supply voltage and max consumption.',
        '- **PoE/PoH:** Specifies if it can be powered by or provide power to another device.',
        '- **Dimensions & Weight:** Crucial for planning rack space or mounting.'
      ].join('\n'),
    },
    {
      title: 'Diagrams & Certifications',
      content: [
        '# Diagrams & Certifications',
        '',
        'Visual aids and official approvals are key parts of a datasheet.',
        '',
        '### Connectivity Diagram',
        'Most datasheets include a **basic application diagram**. This is an incredibly useful visual tool that shows:',
        '- **Typical Setup:** How the product is intended to be connected in a real-world scenario.',
        '- **Signal Flow:** The path of video, audio, and control signals.',
        '- **Peripheral Devices:** What kinds of sources, displays, and control systems it\'s designed to work with.',
        '',
        'This diagram can often answer questions about system design faster than reading through all the text.',
        '',
        '### Certifications',
        'This section lists any official third-party testing and certification the product has received. This is a mark of quality and interoperability.',
        '- **Safety:** (e.g., CE, FCC, UL) Certifies that the product is safe to use and meets regulatory standards for electromagnetic emissions.',
        '- **Technology:** (e.g., HDBaseT Alliance) Confirms that the product adheres to the standards of a specific technology, ensuring compatibility with other certified devices.',
        '- **Software/Platform:** (e.g., Zoom, Microsoft Teams) Certifies that the product has been tested and approved for use with a specific software platform, guaranteeing a seamless user experience.',
        '',
        "**Example:** The APO-210-UC being **Zoom Certified** is a major selling point, as it assures the customer it will work reliably with their chosen UC platform."
      ].join('\n'),
      asset: {
        url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/datasheet_diagram.png',
        title: 'Example Connectivity Diagram',
        type: 'diagram',
      },
    },
  ],
  quiz: [
    {
      question: "A customer asks, 'Does this box do AirPlay?' Where on the datasheet is the quickest place to find this kind of feature information?",
      options: ["The Specifications Table", "The Header / Key Features list", "The Certifications Section", "The Dimensions"],
      correctAnswer: "The Header / Key Features list",
      explanation: "The 'Key Features' list in the header is designed to give a salesperson the most important selling points at a glance, and is the fastest way to confirm a major feature like wireless casting."
    },
    {
      question: "A client wants to connect their new 4K/60Hz laptop. What three key video specifications must you check on a switcher's datasheet to guarantee it will work perfectly?",
      options: ["Max Resolution, Data Rate, and HDCP version", "Power Consumption, Dimensions, and Weight", "CEC, IR, and RS-232", "Audio Formats, DSP, and AEC"],
      correctAnswer: "Max Resolution, Data Rate, and HDCP version",
      explanation: "To pass a modern 4K signal, you must confirm the device supports the resolution (4K/60), has enough bandwidth (18Gbps for 4:4:4), and is compliant with the correct content protection (HDCP 2.2)."
    },
    {
      question: "You're selling a conferencing solution and the client is worried about echo on their calls. Which three-letter acronym in the audio specs should you point to that solves this problem?",
      options: ["DSP", "LPCM", "AEC", "UHD"],
      correctAnswer: "AEC",
      explanation: "AEC (Acoustic Echo Cancellation) is the specific DSP feature that prevents remote participants from hearing their own voice echo back. It is a critical feature for any quality conferencing system."
    },
    {
      question: "You're trying to quickly explain to a customer how a presentation switcher fits into their room with their laptop and display. What is the most useful visual tool on the datasheet for this purpose?",
      options: ["The product photo", "The list of dimensions", "The application/connectivity diagram", "The certifications list"],
      correctAnswer: "The application/connectivity diagram",
      explanation: "The application diagram is a powerful sales tool because it visually demonstrates how the product solves the customer's problem in a typical setup, making it easy for them to understand."
    }
  ]
};
