import { TrainingModule } from '../../utils/types';

export const MODULE_7_FIELD_GUIDES: TrainingModule = {
  id: 'module-7-field-guides',
  title: 'Field Installation Guides',
  contentPages: [
    {
      title: 'Cable Best Practices',
      content: 'Proper cabling is the foundation of a reliable AV system.\n- Use solid-core copper category cable for HDBaseT and AVoIP.\n- Avoid running AV cables parallel to high-voltage power lines to prevent interference.\n- Test and certify every cable before connecting equipment.\n- Label everything clearly at both ends!',
    },
    {
      title: 'Rack Building Essentials',
      content: 'A well-built equipment rack is easier to service and more reliable.\n- **Ventilation**: Heat is the enemy of electronics. Ensure proper airflow, leaving at least 1U of space between hot devices like amplifiers. Use fan trays if necessary.\n- **Power Management**: Use a professional power distribution unit (PDU) to protect equipment and sequence power-on.\n- **Cable Management**: Use horizontal and vertical managers to keep wiring neat and tidy. This prevents strain on connectors and makes troubleshooting much easier.',
    },
  ],
  quiz: [
    {
      question: 'What type of category cable should be used for HDBaseT installations?',
      options: ['Copper Clad Aluminum (CCA)', 'Solid-core copper', 'Stranded patch cable'],
      correctAnswer: 'Solid-core copper',
      explanation: 'Solid-core copper provides the best performance and reliability for high-bandwidth data transmission over long distances.',
    },
    {
      question: 'What is the primary reason for good ventilation in an equipment rack?',
      options: ['To make it look tidy', 'To prevent equipment from overheating', 'To reduce noise'],
      correctAnswer: 'To prevent equipment from overheating',
      explanation: 'Excessive heat can cause equipment to fail prematurely. Proper airflow and thermal management are critical for long-term reliability.',
    },
  ],
};
