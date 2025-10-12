import { TrainingModule } from '../../utils/types.ts';

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
      title: 'HDBaseT Versions & Classes',
      content:
        "HDBaseT has evolved, with different versions offering different capabilities.\n\n- **HDBaseT 1.0/2.0**: These are the most common versions and are categorized by distance into **Class A** (up to 100m) and **Class B** (up to 70m for 1080p). They support up to 4K30 video.\n- **HDBaseT 3.0**: The latest generation. It supports **uncompressed 4K60 4:4:4** video up to **100m** over a single Cat6a cable, along with 1Gb Ethernet and USB 2.0.\n\n**Note**: Always use high-quality, solid-core Cat6a cable for the best performance, especially with HDBaseT 3.0.",
      asset: {
          url: 'https://i.imgur.com/pB3yC5K.png',
          title: 'HDBaseT transmission distance comparison by class and resolution.',
          type: 'diagram',
      },
    },
    {
      title: 'HDBaseT vs. Other Technologies',
      content:
        "How does HDBaseT compare to other signal extension methods?\n\n- **vs. Long HDMI Cables**: HDBaseT is far more reliable over distances greater than 15m.\n- **vs. Fiber Optic**: Fiber can go much longer distances (kilometers) and is immune to electrical interference, but is typically more expensive and fragile.\n- **vs. AVoIP**: AVoIP runs over a standard network and is more scalable and flexible for routing (many-to-many), whereas HDBaseT is a point-to-point connection (one-to-one).",
      asset: {
        url: 'https://i.imgur.com/rXf1b1s.png',
        title: 'HDBaseT is a point-to-point technology, while AVoIP is a networked, many-to-many technology.',
        type: 'diagram',
      },
    },
  ],
  quiz: [
    {
      question: 'What is the main advantage of HDBaseT 3.0 over previous versions?',
      options: ['It is cheaper', 'It supports uncompressed 4K60 4:4:4 up to 100m', 'It only works with fiber optic cable'],
      correctAnswer: 'It supports uncompressed 4K60 4:4:4 up to 100m',
      explanation: 'HDBaseT 3.0 provides a significant bandwidth increase, allowing for the transmission of full-spec 4K video over long distances.',
    },
    {
      question: 'Which technology is best for a flexible, many-to-many distribution system?',
      options: ['HDBaseT', 'AVoIP', 'Long HDMI Cable'],
      correctAnswer: 'AVoIP',
      explanation: 'AVoIP uses a network switch as a virtual matrix, allowing any source to be sent to any number of displays, making it ideal for flexible routing.',
    },
  ],
};
