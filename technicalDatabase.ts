// This file serves as a structured knowledge base for the AI to reference when making design decisions.
// It contains technical specifications, best practices, and architectural patterns.

export const AV_DESIGN_KNOWLEDGE_BASE = {
  designPrinciples: {
    bronzeTier: "Focus on core functionality and value. Meets essential requirements reliably and cost-effectively. Typically uses direct connections, simple presentation switchers (e.g., SW-0401-MST), or all-in-one devices (e.g., HALO-VX10). Avoid complex matrixes.",
    silverTier: "The balanced, recommended standard for modern collaboration. Enhances user experience with features like BYOM, wireless casting, and better audio. Use versatile matrix switchers (e.g., MXV- kits, MX-0408-EDU) or all-in-one UC switchers (e.g., APO-210-UC) that offer flexibility with HDBaseT, USB-C, and separate cameras/mics.",
    goldTier: "A premium, seamless, and future-proofed experience. Creates a high-impact environment with advanced integration and automation. Specify high-end, feature-rich hardware. This is where hybrid matrixes (e.g., MX-1007-HYB with AVoIP/HDBT), dedicated audio DSPs, and full AVoIP solutions are appropriate. Justify the cost by highlighting the advanced features being utilized.",
    ucRequirements: "Any room with 'Video Conferencing' or 'BYOM' features MUST have both a camera and a microphone source. This can be an all-in-one video bar (e.g., WyreStorm APO-VX20-UC) or separate components (e.g., CAM-210-PTZ camera and HALO 80 speakerphone)."
  },
  signalTransport: {
    hdmi: {
      description: "High-Definition Multimedia Interface. The standard for direct, short-distance connections.",
      distanceLimit: "Signal integrity degrades significantly after 10m (33ft) for passive cables, especially at 4K. Distances over this require an active solution.",
      solutionForLongDistance: "Use Active Optical Cables (AOC) like CAB-HAOC series for distances up to 30m, or an HDBaseT extender kit for longer runs or more features."
    },
    hdbaset: {
      description: "A standard for transmitting video, audio, USB, Ethernet, control, and power over a single Category cable.",
      hdbaset_2_0: "Supports 4K30 video, USB 2.0 (up to 190Mbps). Good for most KVM applications and standard peripherals.",
      hdbaset_3_0: "Supports uncompressed 4K60 4:4:4 video, USB 2.0 (up to 300Mbps). Necessary for the highest quality video and more demanding USB devices. The recommended standard for new, high-spec installations.",
      distance: "Typically up to 100m (328ft) over a single shielded category cable.",
      useCase: "Ideal for single-room systems, connecting sources at a table to a display/rack. Simplifies wiring."
    },
    avOverIp: {
      description: "Audio-Visual over Internet Protocol. Distributes AV signals over a standard network infrastructure.",
      productLine: "WyreStorm NetworkHD series.",
      benefits: {
        scalability: "Virtually unlimited sources and displays, limited only by network switch capacity. Perfect for future expansion.",
        flexibility: "Any source can be routed to any display. Supports mixed resolutions and video walls easily.",
        longDistance: "Distances are limited only by the network design, can span entire buildings or campuses."
      },
      useCase: "Recommended for projects with more than 4-5 rooms, building-wide distribution needs, or where future scalability is a key requirement. A 1GbE network is sufficient for most applications (NHD 400/500 series), while 10GbE is for uncompressed video (NHD 600 series)."
    },
    usb: {
      description: "Universal Serial Bus. Critical for modern collaboration and KVM.",
      usb_2_0: "480Mbps bandwidth. Sufficient for keyboards, mice, speakerphones, and most webcams.",
      usb_3_x: "5Gbps+ bandwidth. Required for high-performance peripherals, but rarely supported over long-distance extension technologies without significant cost.",
      byomRequirement: "A true 'Bring Your Own Meeting' setup requires USB connectivity to the room peripherals (camera, mic). A single USB-C cable that carries video, data (USB), and power is the Gold Standard user experience."
    }
  },
  systemArchitecture: {
    singleRoom: "For simple, single-room systems, a presentation switcher (e.g., APO-210-UC) or a small matrix (e.g., MX-0403-H3-MST) with HDBaseT or HAOC extension is the most cost-effective and reliable solution.",
    multiRoomAndCampus: "For larger systems, a hybrid approach is best. Use traditional AV hardware (matrixes, switchers) within each room for fast, local switching. Then, use an AV over IP system (NetworkHD) as the 'backbone' to share sources between rooms or distribute content building-wide."
  },
  productSelectionRules: {
    endOfLifeProducts: "You MUST NOT specify any product where the 'eol' flag is set to true. These products are discontinued and unavailable for new projects. The NHD 400 series is a key example.",
    networkHDInteroperability: "Different NetworkHD series (e.g., 100, 400, 500, 600) are not interoperable and cannot share the same network broadcast domain. You MUST NOT mix series within a single system design. If a project requires different series, they must be on completely isolated networks. This can be achieved with physically separate network switches for each series, or by configuring separate, dedicated VLANs on a managed switch to isolate the traffic for each series. Each series still requires its own dedicated controller (NHD-CTL-PRO).",
    hdbasetCompatibility: "When a product with an HDBaseT output is specified (e.g., a matrix or presentation switcher), the system design MUST also include a compatible receiver for each output being used. Check the transmitter's 'compatibleReceivers' property in the product database. If the transmitter is a 'kit' (check for a 'kitContents' property or if 'kit' is in its tags), the receivers are already included and do not need to be added separately. An incompatibility 'Warning' should be generated if a non-kit transmitter is present without a corresponding, compatible receiver in the project's equipment list.",
    danteImplementation: "For Dante audio integration, check the product's 'audio.dante' property. If 'dedicated', the device has a specific Dante LAN port. If 'software', it can be enabled via a software license (e.g., NHD-500 series). Ensure your scope of work reflects this. If the SKU contains 'DNT', it has dedicated Dante hardware.",
    multiviewImplementation: "For multiview or video wall functionality, specific hardware is required. The NHD-150-RX and the NHD-600 series have this capability 'native'. The NHD-500 series does NOT have native multiview; it requires a dedicated multiview processor like the SW-0401-MV-HDBT to achieve this."
  }
};