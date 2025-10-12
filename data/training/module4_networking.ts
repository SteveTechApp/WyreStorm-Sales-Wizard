import { TrainingModule } from '../../utils/types.ts';

export const MODULE_4_NETWORKING: TrainingModule = {
  id: 'module-4-networking',
  title: 'AV Networking Basics',
  contentPages: [
    {
      title: 'The LAN & The Network Switch',
      content:
        'A **LAN (Local Area Network)** is the collection of connected devices within a single physical location, like an office building. For AVoIP systems, the **network switch** is the heart of the system, acting as the virtual matrix switcher. Not all switches are suitable for AV.\n\nYou need a **Managed Switch** that can be configured to handle the high-bandwidth, real-time nature of video traffic.',
      asset: {
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
        title: 'A managed network switch is the core of any AVoIP system.',
        type: 'image',
      },
    },
    {
      title: 'IP Addresses & DHCP',
      content:
        'Every device on a network needs a unique **IP Address** to communicate, just like every house needs a unique street address.\n\n- **Static IP**: You manually assign a permanent IP address to each device. This is reliable but can be time-consuming to manage.\n- **DHCP (Dynamic Host Configuration Protocol)**: A service on the network (usually on the router) that **automatically assigns** IP addresses to devices when they connect. This is much easier to manage, especially for large systems. Most AVoIP systems can work with either method.',
      asset: {
        url: 'https://i.imgur.com/3c8i8tK.png',
        title: 'A DHCP server on the LAN automatically provides IP addresses to new devices.',
        type: 'diagram',
      },
    },
    {
      title: 'Essential Switch Features',
      content:
        'Key features to look for in a network switch for AVoIP include:\n\n- **PoE (Power over Ethernet)**: Can power encoders and decoders directly from the switch, simplifying wiring. Look for **PoE+ (802.3at)** for most devices.\n- **IGMP Snooping**: This is **crucial** for multicast traffic. It prevents video streams from flooding the entire network by only sending them to the ports that have requested them.\n- **Jumbo Frames**: Allows for larger packet sizes (e.g., 9000 bytes), which can improve efficiency when transmitting large amounts of video data.',
      asset: {
        url: 'https://i.imgur.com/k2e4k1N.png',
        title: 'With IGMP Snooping, multicast traffic only goes where it is needed.',
        type: 'diagram',
      },
    },
    {
      title: 'Dedicated vs. Converged Networks',
      content:
        "There are two main approaches to deploying an AVoIP network:\n\n- **Dedicated Network**: The AV system runs on its own **physically separate network**, with its own switches. This is the simplest and most reliable method, as it isolates AV traffic from corporate data.\n- **Converged Network**: The AV system **shares the same network infrastructure** as the client's existing data, voice, and other services. This requires careful coordination with the IT department and advanced network configuration (like VLANs) to ensure performance.",
      asset: {
        url: 'https://i.imgur.com/fLz4S8X.png',
        title: 'Comparison of a simple dedicated network and a converged network using VLANs.',
        type: 'diagram',
      },
    },
  ],
  quiz: [
    {
      question: 'What is the most critical feature a network switch must have for multicast AVoIP systems?',
      options: ['PoE', 'Jumbo Frames', 'IGMP Snooping'],
      correctAnswer: 'IGMP Snooping',
      explanation: 'IGMP Snooping is essential to prevent multicast video from overwhelming the network by only sending streams to the ports that need them.',
    },
    {
      question: 'What automatically assigns IP addresses to devices on a network?',
      options: [
        'LAN',
        'DHCP',
        'IGMP',
      ],
      correctAnswer: 'DHCP',
      explanation: 'DHCP (Dynamic Host Configuration Protocol) simplifies network administration by leasing IP addresses to devices automatically.',
    },
  ],
};
