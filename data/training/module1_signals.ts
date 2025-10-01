import { TrainingModule } from '../../utils/types';

export const MODULE_1_SIGNALS: TrainingModule = {
  id: 'module-1-signals',
  title: 'AV Signals & Connections',
  contentPages: [
    {
      title: 'Understanding Digital Video',
      content:
        'Modern AV systems primarily use digital signals. The most common is **HDMI** (High-Definition Multimedia Interface), which carries video, audio, and control data. **DisplayPort** is also common, especially for connecting computers.\n\nKey concepts include:\n- **Resolution**: The number of pixels (e.g., 1920x1080 for 1080p, 3840x2160 for 4K).\n- **Refresh Rate**: How many times per second the image is updated, measured in Hertz (Hz) (e.g., 60Hz).\n- **Bandwidth**: The amount of data that can be transmitted, measured in Gbps. Higher resolutions and refresh rates require more bandwidth.',
    },
    {
      title: 'Chroma Subsampling',
      content:
        "To save bandwidth, video signals often use chroma subsampling. It's expressed as a ratio like **4:4:4**, **4:2:2**, or **4:2:0**.\n\n- **4:4:4**: No compression. Every pixel gets full color information. This is crucial for sharp text and computer graphics.\n- **4:2:0**: High compression. Color information is shared across a 2x2 block of pixels. It's great for movies and broadcast TV but can make text look blurry.\n\nFor most corporate and education applications, **4:4:4** support is preferred to ensure computer-generated content looks crisp.",
    },
    {
      title: 'Content Protection (HDCP)',
      content:
        '**HDCP** (High-bandwidth Digital Content Protection) is an encryption standard built into HDMI and other connections to prevent illegal copying of content from sources like Blu-ray players or streaming services.\n\nEvery device in the signal chain (source, switcher, extender, display) must support the same version of HDCP for the image to appear. **HDCP 2.2** or higher is required for most 4K content.',
    },
  ],
  quiz: [
    {
      question: 'Which chroma subsampling ratio provides the best quality for computer text?',
      options: ['4:2:0', '4:2:2', '4:4:4'],
      correctAnswer: '4:4:4',
      explanation: '4:4:4 provides full color information for every pixel, which is essential for rendering sharp, clear text and graphics.',
    },
    {
      question: 'What version of HDCP is typically required for protected 4K content?',
      options: ['HDCP 1.4', 'HDCP 2.2', 'Any version will work'],
      correctAnswer: 'HDCP 2.2',
      explanation: 'HDCP 2.2 is the content protection standard widely adopted for 4K UHD content from streaming services, Blu-ray, and other sources.',
    },
  ],
};
