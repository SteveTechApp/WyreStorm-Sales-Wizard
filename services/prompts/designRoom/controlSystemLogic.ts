export const getControlSystemLogic = () => `
  **Control System Design Logic (CRITICAL):**
  Select control hardware based on the user's 'Control System' choice and 'Design Tier'.
  - **If 'Touch Panel'**:
    - For **'Gold' tier**, you **MUST** add 'SYN-TOUCH10'.
    - For **NHD 100/120/500 Series**, mention the free 'NHD-TOUCH' app.
    - For **NHD 600 Series**, you **MUST** add 'SYN-TOUCH10' (app lacks video previews).
  - **If 'Simple Keypad'**:
    - For **'Bronze' or 'Silver'**, you **MUST** add 'SYN-KEY10'.
  - **If 'Third-Party Integration'**:
    - **DO NOT** add WyreStorm control hardware.
    - State in the functionality statement that the system is ready for control via API.
  - **If 'None (Auto-switching)'**:
    - **DO NOT** add control hardware. Ensure the selected switcher has an 'Auto-switching' tag.
`;
