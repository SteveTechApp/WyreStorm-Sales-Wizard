import { TrainingModule } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

export const TRAINING_MODULES: TrainingModule[] = [
    // Module 1: AV Signals
    {
        id: uuidv4(),
        title: 'Introduction to AV Signals',
        contentPages: [
            {
                title: 'What are AV Signals?',
                content: `Audiovisual (AV) signals are the electronic representations of sound (audio) and pictures (video). In the world of professional AV, we deal with various types of signals that need to be transmitted, switched, and displayed reliably. Understanding the basics of these signals is the first step to designing any AV system.\n\n**Key Concepts:**\n\n* **Analog vs. Digital:** Older signals like VGA (video) and RCA (audio) were analog. Modern signals like HDMI are digital, offering higher quality and more features.\n* **Resolution:** This refers to the number of pixels in a video image, determining its clarity. Common resolutions include 1080p (Full HD) and 4K (Ultra HD).\n* **Bandwidth:** This is the amount of data that can be transmitted over a connection in a given amount of time. Higher resolutions and frame rates require more bandwidth. 4K video requires significantly more bandwidth than 1080p.`
            },
            {
                title: 'Common Connectors',
                content: `You'll encounter many different connectors in AV. Here are the most common ones today:\n\n* **HDMI (High-Definition Multimedia Interface):** The industry standard for consumer and commercial AV. It carries uncompressed video, audio, and control data in a single cable.\n* **DisplayPort:** Another digital interface, common on computers and professional displays. It's very similar to HDMI in capability.\n* **USB-C:** A versatile connector that is becoming increasingly popular. It can carry video (using DisplayPort Alternate Mode), data, and power over a single cable, making it ideal for "one-cable" docking solutions.\n* **XLR & Phoenix:** Common connectors for professional balanced audio, used for microphones and connections to amplifiers.`,
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/common_connectors.png',
                    title: 'Various AV Connectors',
                    type: 'image'
                }
            }
        ],
        quiz: [
            {
                question: 'Which modern connector can carry video, data, and power over a single cable?',
                options: ['HDMI', 'VGA', 'USB-C', 'DisplayPort'],
                correctAnswer: 'USB-C',
                explanation: 'USB-C is a highly versatile standard that can transmit video, data, and power, making it a popular choice for modern devices and "bring your own device" (BYOD) meeting rooms.'
            },
            {
                question: 'What does "Resolution" refer to in a video signal?',
                options: ['The speed of the signal', 'The number of pixels in the image', 'The type of connector used', 'The volume of the audio'],
                correctAnswer: 'The number of pixels in the image',
                explanation: 'Resolution, like 1920x1080 (1080p) or 3840x2160 (4K), defines the detail and clarity of a video image by specifying the number of horizontal and vertical pixels.'
            }
        ]
    },
    // Module 2: HDBaseT
    {
        id: uuidv4(),
        title: 'Understanding HDBaseT',
        contentPages: [
            {
                title: 'The Challenge: Signal Distance',
                content: `HDMI cables are fantastic, but they have a major limitation: distance. A reliable HDMI signal can typically only travel about 15 meters (50 feet) before it starts to degrade. For larger rooms, or sending signals between rooms, this is a significant problem.\n\nThis is where signal extension technology comes in. The most common and reliable technology for this is **HDBaseT**.`,
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/hdmi_distance_limit.png',
                    title: 'HDMI Distance Limitation Diagram',
                    type: 'diagram'
                }
            },
            {
                title: 'What is HDBaseT?',
                content: `HDBaseT is a global standard for transmitting uncompressed, high-definition video, audio, power, Ethernet, USB, and control signals over a single standard Category cable (like Cat6 or Cat6a).\n\nIt's a point-to-point technology, meaning it works with a **Transmitter (TX)** at the source end and a **Receiver (RX)** at the display end.\n\n**The 5Play™ Feature Set:**\n\n1.  **Video:** Uncompressed HD and 4K video.\n2.  **Audio:** All standard audio formats.\n3.  **Power:** Power over HDBaseT (PoH) allows the transmitter to power the receiver, so you only need one power supply.\n4.  **Ethernet:** 100Mbps Ethernet connection.\n5.  **Control:** Control signals like IR and RS-232 can be passed through.\n\nWyreStorm offers a huge range of HDBaseT extenders, switchers, and matrixes to solve any distance challenge.`,
                links: [
                    {
                        url: 'https://hdbaset.org/what-is-hdbaset/',
                        text: 'Learn more at the HDBaseT Alliance'
                    }
                ]
            }
        ],
        quiz: [
            {
                question: 'What is the primary problem that HDBaseT technology solves?',
                options: ['Poor video quality', 'Lack of different connector types', 'Limited transmission distance of HDMI', 'Inability to carry audio'],
                correctAnswer: 'Limited transmission distance of HDMI',
                explanation: 'HDBaseT was developed to overcome the inherent distance limitations of standard HDMI cables, allowing high-quality signals to be sent over 100 meters.'
            },
            {
                question: 'What type of cable does HDBaseT use?',
                options: ['Coaxial cable', 'Fiber optic cable', 'A standard Category cable (e.g., Cat6)', 'Proprietary WyreStorm cable'],
                correctAnswer: 'A standard Category cable (e.g., Cat6)',
                explanation: 'One of the key advantages of HDBaseT is its ability to use affordable and readily available network infrastructure cabling (like Cat6) to transmit AV signals.'
            },
            {
                question: 'What does PoH stand for?',
                options: ['Power over HDMI', 'Power over HDBaseT', 'Picture over HDBaseT', 'Power on Hand'],
                correctAnswer: 'Power over HDBaseT',
                explanation: 'Power over HDBaseT (PoH) is a key feature that simplifies installation by allowing the Transmitter to send power to the Receiver over the same Cat cable, eliminating the need for a power outlet at the display location.'
            }
        ]
    },
    // Module 3: AVoIP
    {
        id: uuidv4(),
        title: 'Introduction to AVoIP',
        contentPages: [
            {
                title: 'Beyond Point-to-Point',
                content: `HDBaseT is great for connecting one source to one display (or multiple sources to multiple displays with a matrix). But what if you need a truly flexible system? What if you need to send any source to any combination of displays on a large campus, or add new sources and displays easily?\n\nThis is where **AV over IP (AVoIP)** comes in. AVoIP uses a standard IP network (like your office computer network) to distribute video and audio.`
            },
            {
                title: 'How AVoIP Works',
                content: `Instead of a traditional matrix switcher, an AVoIP system uses:\n\n*   **Encoders (TX):** One encoder for each source device (e.g., PC, camera). The encoder takes the HDMI signal and converts it into network packets.\n*   **Decoders (RX):** One decoder for each display. The decoder takes the network packets and converts them back into an HDMI signal.\n*   **A Network Switch:** A standard 1Gb or 10Gb network switch acts as the "matrix", routing the packets from any encoder to any decoder.\n\n**WyreStorm's NetworkHD** is our powerful and versatile AVoIP product line. The 500 series, for example, offers visually lossless 4K60 4:4:4 video, plus Dante audio, over a standard 1Gb network.`,
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/avoip_system_diagram.png',
                    title: 'AVoIP System Diagram',
                    type: 'diagram'
                }
            }
        ],
        quiz: [
            {
                question: 'What piece of hardware replaces a traditional matrix switcher in an AVoIP system?',
                options: ['A larger HDBaseT extender', 'A standard IP Network Switch', 'A video processor', 'A distribution amplifier'],
                correctAnswer: 'A standard IP Network Switch',
                explanation: 'The core of an AVoIP system is the network switch, which takes on the role of routing signals from any encoder (source) to any decoder (display), providing immense flexibility.'
            },
            {
                question: 'In an AVoIP system, what device connects to a source like a PC or media player?',
                options: ['A Decoder', 'An Amplifier', 'An Encoder', 'A Receiver'],
                correctAnswer: 'An Encoder',
                explanation: 'Encoders are connected to source devices to "encode" the HDMI signal into IP packets that can be sent over the network.'
            }
        ]
    },
     // Module 4: Video Walls
    {
        id: uuidv4(),
        title: 'Advanced Display Systems: Video Walls',
        contentPages: [
            {
                title: 'Understanding Video Walls',
                content: "A video wall is a large visualization surface built from multiple smaller displays (called 'panels' or 'tiles'). They are used when a single display is either not large enough or not the right shape for the application. There are two main types:\n\n* **LCD Video Walls:** Use special thin-bezel LCD panels. They are great for data visualization in boardrooms and control rooms.\n* **Direct-View LED (dvLED):** Use tiles of tiny LEDs. They are seamless (no bezels) and can be incredibly bright, making them perfect for large-scale digital signage and auditoriums."
            },
            {
                title: 'Processing: The Brains of the Wall',
                content: "You can't just plug an HDMI cable into a video wall. You need a processor to split the source image across the multiple displays. There are several ways to do this:\n\n*   **Internal Processing (Loop/Tiling):** Many video wall panels have a 'loop-through' or 'tiling' mode. You connect your source to the first panel, and then 'daisy-chain' the panels together. The displays' internal processors handle the image splitting. This is simple but can be limited in flexibility.\n*   **Video Wall Matrix (e.g., MX-1616-H2XC-VW):** A dedicated matrix switcher with video wall capabilities. It takes multiple sources and can output them to a specific group of displays in a video wall format.\n*   **AVoIP Decoders:** This is the most flexible method. Each display gets its own decoder (like an **NHD-500-E-RX**). The NetworkHD system handles the video wall processing, allowing for dynamic layouts and control. The **NHD-150-RX** is a specialized decoder that can display multiple sources *on a single screen*, which can then be part of a larger video wall.",
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/videowall_processing.png',
                    title: 'Video Wall Processing Methods',
                    type: 'diagram'
                },
                links: [
                    { url: 'https://www.wyrestorm.com/product/nhd-150-rx/', text: 'See the NHD-150-RX Decoder' }
                ]
            },
            {
                title: 'WyreStorm Solutions & Key Considerations',
                content: "**Key Considerations:**\n\n*   **Bezel Correction:** The gap between LCD panels (the bezel) needs to be compensated for in the video processing so the image looks continuous. The **NHD-120-RX does not have bezel correction**, so it's not ideal for video walls. The 500 and 600 series decoders have this built-in.\n*   **Cost-Effectiveness:** For a simple video wall showing one source, using an **NHD-500-E-RX** per display is a great, cost-effective AVoIP solution as it omits features not needed in a video wall (like USB).\n*   **Flexibility:** For maximum flexibility (multiple windows, drag-and-drop layouts), use the **NHD-150-RX**. It requires a wireless network for control via the free **NHD-Touch-App**.\n*   **High-End Systems:** The **NHD-600-TRX** can be used as a single, powerful input (TX) to a looped video wall, or as decoders (RX) for the highest quality 4K60 4:4:4 video."
            }
        ],
        quiz: [
            {
                question: "For a simple video wall where cost is a key factor, which AVoIP decoder is often the best choice?",
                options: ["NHD-120-RX", "NHD-500-RX", "NHD-500-E-RX", "NHD-600-TRX"],
                correctAnswer: "NHD-500-E-RX",
                explanation: "The NHD-500-E-RX is a more economical version of the 500-RX that removes features like USB and audio breakout, which are often unnecessary for a simple video wall display, making it a great value choice."
            },
            {
                question: "Which WyreStorm NetworkHD product is specialized for creating dynamic, multi-window layouts on a video wall, controlled by a touch app?",
                options: ["NHD-120-TX", "NHD-150-RX", "A standard matrix switcher", "An HDBaseT extender"],
                correctAnswer: "NHD-150-RX",
                explanation: "The NHD-150-RX is a powerful multi-view decoder that can create highly flexible and dynamic layouts, which can be controlled on-the-fly using the NHD-Touch app."
            }
        ]
    },
    // Module 5: Field Guides
    {
        id: uuidv4(),
        title: 'Field Guides & Checklists',
        contentPages: [
            {
                title: 'The Sales Cheat Sheet',
                content: "Keep this guide handy for quick reminders and essential questions to ask a client. A few smart questions can completely change the direction of a sale and show your expertise.\n\nThis sheet covers:\n\n*   **Key Acronyms & Terms**\n*   **Signal Distance Reminders**\n*   **Killer Discovery Questions**\n*   **Positioning Bronze, Silver & Gold**\n\nDownload the asset to keep it on your tablet or print it out.",
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/sales_cheat_sheet.png',
                    title: 'Sales Cheat Sheet',
                    type: 'diagram'
                }
            },
            {
                title: 'Site Survey Guide: Preparation',
                content: "A successful site survey starts before you even arrive. Being prepared shows professionalism and ensures you don't waste the client's time.\n\n**Your Toolkit:**\n\n*   **Laser Distance Measurer:** Essential for accurate room dimensions.\n*   **Camera:** Use your phone to take photos of the room, ceiling, wall construction, and potential equipment locations.\n*   **Notepad & Pen:** Don't rely on memory. Write everything down.\n*   **Small Flashlight:** For looking into ceiling voids or behind existing equipment.\n\n**Your Research:**\n\n*   **Who are you meeting?** Know their role in the company.\n*   **What does the company do?** Understanding their business helps you understand their AV needs.\n*   **Review the initial brief:** Re-read the client's email or notes so their goals are fresh in your mind.",
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/site_survey_kit.png',
                    title: 'Site Survey Toolkit',
                    type: 'image'
                }
            },
            {
                title: 'Site Survey Guide: Room Assessment',
                content: "While on-site, you are a detective. Your job is to gather all the physical information you'll need to create an accurate design and quote. Use the downloadable checklist to make sure you don't miss anything.\n\n**Key Areas to Assess:**\n\n1.  **Dimensions:** Measure length, width, and ceiling height.\n2.  **Construction:** What are the walls made of (drywall, glass, concrete)? What type of ceiling is it (tiles, solid)? This impacts speaker choice and cable installation.\n3.  **Infrastructure:** Where are the power outlets? Where are the network ports? Is there existing cable containment (conduit, trunking) you can use?\n4.  **Environment:** Note sources of ambient light (windows, skylights) which will affect display brightness. Listen for ambient noise (HVAC systems) which will impact microphone choice.",
                asset: {
                    url: 'https://storage.googleapis.com/wyrestorm-wingman-assets/training/site_survey_checklist.png',
                    title: 'Site Survey Checklist',
                    type: 'diagram'
                }
            },
            {
                title: 'Site Survey Guide: The Client Conversation',
                content: "This is the most important part. The information you gather here will determine the success of the project. Your goal is to understand their needs, frustrations, and goals.\n\n**Essential Questions to Ask:**\n\n*   **Usage:** *'Walk me through how you envision using this room. Who are the primary users?'*\n*   **Sources:** *'What types of devices will people need to connect? Are they company laptops or guest devices? Is a single-cable (like USB-C) connection important?'*\n*   **Audio:** *'Besides the audio from presentations, do you need speech reinforcement for the presenter? Is high-quality music or video playback important?'*\n*   **Control:** *'How simple does the system control need to be? Are you happy for it to switch automatically, or do you need a dedicated touch panel?'*\n*   **Frustrations:** *'What's the biggest challenge or frustration you have with your current AV setup?'* This question is gold!\n*   **Future:** *'Are there any plans for this space or your technology in the next 3-5 years we should be aware of?'*"
            }
        ],
        quiz: [
            {
                question: "When on a site survey, what is one of the most important things to physically measure?",
                options: ["The color of the walls", "The room's dimensions (length, width, height)", "The speed of the guest Wi-Fi", "The brand of the existing furniture"],
                correctAnswer: "The room's dimensions (length, width, height)",
                explanation: "Accurate dimensions are critical for determining display size, speaker placement, and cable lengths. It's a foundational piece of information for any AV design."
            },
            {
                question: "A client says 'it needs to be super easy for guests to present'. What is a key follow-up question to ask?",
                options: ["What is your total budget for the project?", "What brand of laptops do your employees use?", "What connection types do your guests typically need (e.g., HDMI, USB-C)?", "How many people will be in the room?"],
                correctAnswer: "What connection types do your guests typically need (e.g., HDMI, USB-C)?",
                explanation: "This question directly addresses the 'how'. Understanding the connection types needed is crucial for selecting the right input plate or presentation switcher (e.g., one with USB-C)."
            }
        ]
    }
];
