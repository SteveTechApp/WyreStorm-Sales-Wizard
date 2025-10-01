import { TrainingModule } from '../../utils/types';

export const MODULE_3_AVOIP: TrainingModule = {
  id: 'module-3-avoip',
  title: 'Introduction to AVoIP',
  contentPages: [
    {
      title: 'What is AVoIP?',
      content:
        '**AVoIP** (Audio-Visual over Internet Protocol) is the technology for sending AV signals over a standard IP network (like an office LAN).\n\nInstead of a traditional matrix switcher, AVoIP uses a system of **Encoders** and **Decoders**.\n- An **Encoder** connects to a source (like a PC or camera) and converts its AV signal into network packets.\n- A **Decoder** connects to a display or speaker and converts the network packets back into an AV signal.\n\nA standard network switch handles the routing, making the system incredibly flexible and scalable.',
    },
    {
      title: 'Benefits of AVoIP',
      content:
        'AVoIP offers several key advantages over traditional AV distribution:\n\n- **Scalability**: You are not limited by a fixed number of inputs and outputs. You can add more encoders or decoders at any time.\n- **Distance**: The transmission distance is virtually unlimited, constrained only by the reach of the network itself.\n- **Flexibility**: Any source can be routed to any display, or even to multiple displays simultaneously (multicasting).\n- **Advanced Features**: AVoIP enables features like video walls, multiview (multiple sources on one screen), and integration with other network services.',
    },
    {
      title: 'WyreStorm NetworkHD Series',
      content:
        "WyreStorm's AVoIP product line is called **NetworkHD**. It includes several series based on different compression technologies (codecs):\n\n- **100/120 Series (H.264/H.265)**: A low-bandwidth solution ideal for large-scale deployments where network capacity is a concern. Good for digital signage and non-critical viewing.\n- **500 Series (JPEG-XS)**: A high-quality, low-latency solution that is visually lossless. Excellent for corporate boardrooms and command centers where quality is paramount.\n- **600 Series (Uncompressed)**: A zero-latency, pixel-perfect solution for the most demanding applications like medical imaging or broadcast, requiring a 10GbE network.",
    },
  ],
  quiz: [
    {
      question: 'In an AVoIP system, what device connects to a display?',
      options: ['Encoder', 'Decoder', 'Network Switch'],
      correctAnswer: 'Decoder',
      explanation: 'Decoders receive AV data from the network and convert it back into a signal (like HDMI) that a display can understand.',
    },
    {
      question: 'Which NetworkHD series offers the highest possible video quality with zero latency?',
      options: ['120 Series', '500 Series', '600 Series'],
      correctAnswer: '600 Series',
      explanation: 'The 600 Series sends uncompressed video over a 10GbE network, resulting in pixel-perfect quality and no transmission delay.',
    },
  ],
};
