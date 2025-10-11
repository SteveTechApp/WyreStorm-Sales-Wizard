import { TrainingModule } from '../../utils/types';

export const MODULE_2_HDBASET: TrainingModule = {
  id: 'module-2-hdbaset',
  title: 'HDBaseT Fundamentals',
  contentPages: [
    {
      title: 'What is HDBaseT?',
      content:
        "**HDBaseT** is a global standard for transmitting video, audio, USB, control signals, and power over a single standard category cable (like Cat6).\n\nIt solves the primary problem of modern AV: **distance**. Standard HDMI cables become unreliable over 15 meters, but HDBaseT allows for robust long-distance transmission, making it a cornerstone of professional AV installations.",
      asset: {
        url: 'https://i.imgur.com/1mYqf8F.png',
        title: 'A typical HDBaseT setup uses a Transmitter (TX) and a Receiver (RX).',
        type: 'diagram',
      },
    },
    {
      title: 'The 5-Play Feature Set',
      content:
        'HDBaseT is famous for its **5-Play** feature set, which describes the five types of signals it can carry simultaneously:\n\n1.  **Uncompressed Video & Audio**: Transmit high-definition video and audio without loss of quality.\n2.  **USB**: Extend USB 2.0 for devices like interactive displays, cameras, and keyboards/mice (KVM).\n3.  **Ethernet**: Pass through a 100Mbps Ethernet connection.\n4.  **Control**: Send control signals like IR (Infrared) and RS-232.\n5.  **Power**: Deliver power to the remote device using **PoH** (Power over HDBaseT), eliminating the need for a power supply at the display end.',
      asset: {
        url: 'https://i.imgur.com/YdK0fJj.png',
        title: 'The five components of the HDBaseT 5-Play feature set.',
        type: 'diagram',
      },
    },
    {
      title: 'HDBaseT Classes',
      content:
        "There are different classes of HDBaseT that determine the transmission distance:\n\n- **Class A**: The highest performance. Transmits 1080p up to **100m** and 4K up to **70m**.\n- **Class B**: A more cost-effective option. Transmits 1080p up to **70m** and 4K up to **35-40m**.\n- **HDBaseT 3.0**: The latest generation, supporting uncompressed 4K/60 4:4:4 video up to **100m**.\n\n**Note**: Always use high-quality, solid-core Cat6 or Cat6a cable for best results.",
      asset: {
          url: 'https://i.imgur.com/pB3yC5K.png',
          title: 'HDBaseT transmission distance comparison by class and resolution.',
          type: 'diagram',
      },
    },
  ],
  quiz: [
    {
      question: 'What is the maximum distance for a 4K signal using HDBaseT Class B?',
      options: ['100m', '70m', '35m'],
      correctAnswer: '35m',
      explanation: 'HDBaseT Class B is a cost-effective solution that supports 4K video up to 35 meters (or 40m in some cases).',
    },
    {
      question: 'What does "PoH" stand for in the context of HDBaseT?',
      options: ['Power over HDMI', 'Power over HDBaseT', 'Power on Handshake'],
      correctAnswer: 'Power over HDBaseT',
      explanation: 'PoH allows the transmitter to send power over the category cable to the receiver, simplifying installation.',
    },
  ],
};
