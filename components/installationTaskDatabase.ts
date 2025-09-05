
import { InstallationTask } from '../types';

export const installationTaskDatabase: InstallationTask[] = [
    {
        id: 'rack-build',
        name: 'Rack Build & Assembly',
        description: 'Physical assembly of the equipment rack, including mounting shelves, power distribution, and ventilation.',
        estimatedHours: 8,
    },
    {
        id: 'device-install',
        name: 'Device Installation',
        description: 'Mounting and securing all in-room hardware, such as displays, projectors, speakers, and microphones.',
        estimatedHours: 12,
    },
    {
        id: 'cable-pull',
        name: 'Cable Pulling & Termination',
        description: 'Running all necessary low-voltage cabling between the rack and in-room termination points. Terminating all cable ends.',
        estimatedHours: 16,
    },
    {
        id: 'rack-wiring',
        name: 'Rack Wiring & Integration',
        description: 'Connecting all equipment within the rack according to the system diagram. Includes cable management.',
        estimatedHours: 10,
    },
    {
        id: 'control-prog',
        name: 'Control System Programming',
        description: 'Loading and configuring the control system code, including UI design and logic programming.',
        estimatedHours: 20,
    },
    {
        id: 'system-config',
        name: 'System Configuration & Testing',
        description: 'Configuring all network devices, DSP settings, and video scaling. Performing full system testing.',
        estimatedHours: 8,
    },
    {
        id: 'commissioning',
        name: 'Commissioning & Handover',
        description: 'Final testing with the client, providing user training, and delivering project documentation.',
        estimatedHours: 4,
    },
];
