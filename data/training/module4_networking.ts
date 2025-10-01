import { TrainingModule } from '../../utils/types.ts';

export const MODULE_4_NETWORKING: TrainingModule = {
  id: 'module4_networking',
  title: 'Networking for AV Pros',
  contentPages: [
    {
      title: 'IP Addresses & Subnets',
      content: [
        '# IP Addresses & Subnets',
        '',
        'Every device on a network needs a unique identifier, similar to a street address. This is its **IP Address**.',
        '',
        '### IP Address',
        'An IP address is a series of four numbers separated by periods (e.g., `192.168.1.100`). Each number can range from 0 to 255.',
        '',
        '### Subnet Mask',
        'A **Subnet Mask** (e.g., `255.255.255.0`) works with the IP address to define which part of the address refers to the network and which part refers to the specific device (host).',
        '',
        '- **Network Portion:** The part of the IP address where the subnet mask is `255`. All devices on the same local network must have the same network portion.',
        '- **Host Portion:** The part of the IP address where the subnet mask is `0`. Every device on the network must have a unique host portion.',
        '',
        '**Example:**',
        '- IP Address: `192.168.1.100`',
        '- Subnet Mask: `255.255.255.0`',
        '- **Network ID:** `192.168.1.x`',
        '- **Host ID:** `x.x.x.100`',
        '',
        'For two devices to communicate directly, their network IDs must match, and their host IDs must be different.'
      ].join('\n'),
    },
    {
      title: 'Unicast vs. Multicast',
      content: [
        '# Unicast vs. Multicast',
        '',
        'These terms describe how data is sent from one point to another on a network.',
        '',
        '### Unicast',
        '- **One-to-One:** A unicast transmission is from a single sender to a single receiver.',
        '- **Analogy:** Making a phone call to one specific person.',
        '- **Use Case:** Most standard internet traffic (browsing a website, sending an email) is unicast. In AV, it might be used for direct control of a specific device.',
        '',
        '### Broadcast',
        '- **One-to-All:** A broadcast transmission is from a single sender to **every** other device on the network, whether they want the data or not.',
        '- **Analogy:** Shouting in a crowded room. Everyone hears you.',
        '- **Use Case:** Rarely used in modern networks because it\'s very inefficient and creates a lot of unnecessary traffic.',
        '',
        '### Multicast',
        '- **One-to-Many (who want it):** A multicast transmission is from a single sender to a group of interested receivers. Devices subscribe to a multicast group, and only those subscribers receive the data.',
        '- **Analogy:** A radio station. You only hear it if you tune your radio to that specific frequency.',
        '- **Use Case:** This is the magic behind AVoIP. An encoder sends its video stream to a multicast address. Decoders that want to show that video subscribe to that address. The network switch (with IGMP Snooping) makes sure the stream only goes to the subscribed decoders.'
      ].join('\n'),
    },
    {
      title: 'VLANs (Virtual LANs)',
      content: [
        '# VLANs: Virtual Local Area Networks',
        '',
        'A VLAN is a way to logically segment a single physical network switch into multiple, separate virtual networks.',
        '',
        '### How it Works',
        'Imagine a 24-port switch. With VLANs, you could configure:',
        '- **VLAN 10 (Corporate Data):** Ports 1-12. Devices on these ports can only talk to each other.',
        '- **VLAN 20 (Guest Wi-Fi):** Ports 13-18. Devices here are isolated from the corporate network.',
        '- **VLAN 30 (AVoIP):** Ports 19-24. All AV encoders and decoders are on these ports.',
        '',
        "Even though all devices are plugged into the same physical switch, devices in VLAN 10 cannot communicate with devices in VLAN 30, and vice versa. It's as if they were on completely separate switches.",
        '',
        '### Why Use a VLAN for AV?',
        '- **Security:** It prevents devices on the main corporate network from accessing or interfering with the AV control system.',
        '- **Performance:** It isolates the high-bandwidth video traffic from regular data traffic, ensuring that a large file download on the corporate network doesn\'t cause the video streams to stutter.',
        '- **Management:** It simplifies network management by keeping AV traffic contained and predictable.',
        '',
        'For AVoIP systems installed on a shared corporate network, using a dedicated VLAN is **best practice** and often a requirement.'
      ].join('\n'),
    },
  ],
  quiz: [
    {
      question: "When proposing an AVoIP system for a client's corporate network, what is the most important information you need to request from their IT department?",
      options: ["The brand of their network firewall", "A list of approved websites", "A dedicated VLAN and a block of static IP addresses for the AV devices", "The Wi-Fi password"],
      correctAnswer: "A dedicated VLAN and a block of static IP addresses for the AV devices",
      explanation: "For a stable and secure AVoIP deployment on a corporate network, a salesperson must engage with IT to secure a dedicated VLAN to isolate traffic and get a reserved range of IP addresses to avoid conflicts."
    },
    {
      question: "When explaining how AVoIP works to a non-technical client, which term best describes the efficient 'one-to-many' method of sending a single source to multiple screens?",
      options: ["Unicast", "Broadcast", "Multicast", "IP Streaming"],
      correctAnswer: "Multicast",
      explanation: "Using the correct terminology is important. Multicast is the specific technology that allows an AVoIP system to efficiently distribute a single stream to many subscribed devices without flooding the network."
    },
    {
      question: "A client is hesitant to put AV equipment on their main corporate network. What feature can you propose to their IT team to address this security concern?",
      options: ["A faster network switch", "Using only Wi-Fi enabled devices", "A VLAN to logically isolate AV traffic from the corporate data", "Using longer ethernet cables"],
      correctAnswer: "A VLAN to logically isolate AV traffic from the corporate data",
      explanation: "A VLAN is the standard and correct answer to this common IT security objection. It demonstrates that you understand their concerns and have a professional solution for them."
    },
    {
        question: "If a client wants to use their own tablet on the corporate Wi-Fi (VLAN 10) to control the AV system (on VLAN 20), what must you explain to them?",
        options: ["It's not possible", "They need to buy a special tablet from you", "Their IT department will need to configure routing between the two VLANs for control traffic to pass", "The Wi-Fi needs to be upgraded to Wi-Fi 6E"],
        correctAnswer: "Their IT department will need to configure routing between the two VLANs for control traffic to pass",
        explanation: "This is a common sales scenario. It's crucial to manage expectations by explaining that communication between VLANs is not automatic and requires configuration (routing) by the IT team."
    }
  ]
};