export const getVideoWallLogic = () => `
  **Video Wall Design Logic:**
  - **LCD Walls**: Specify one decoder for EACH panel (rows * cols). Use 'NHD-500-RXE' for NHD 500 series walls.
  - **Direct-View LED Walls**: Require a single HDMI input. Design for a single decoder.
    - **Multiview on LED**: If required, select based on tier: 'NHD-0401-MV' (Bronze), 'NHD-150-RX' (Silver), 'NHD-600-TRX' (Gold).
    - **Single Source on LED**: If no multiview, use 'NHD-500-E-RX' as the single decoder.
  - **Alternatives**: For basic, single-input walls, 'SW-0204-VW' or 'SW-0206-VW' are cost-effective choices. For basic multiview, 'NHD-0401-MV' feeding displays' loop-through is a budget option.
`;
