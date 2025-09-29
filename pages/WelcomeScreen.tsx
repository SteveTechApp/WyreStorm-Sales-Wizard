import React from 'react';
import { useThemeContext } from '../context/ThemeContext.tsx';
import F14Cockpit from '../components/cockpit/F14Cockpit.tsx';
import DefaultWelcome from '../components/welcome/DefaultWelcome.tsx';

const WelcomeScreen: React.FC = () => {
    const { theme } = useThemeContext();
    const isCockpit = theme === 'cockpit';

    // When the theme is 'cockpit', render the new F14Cockpit component.
    // For other themes, we'll render a more standard DefaultWelcome view.
    return isCockpit ? <F14Cockpit /> : <DefaultWelcome />;
};

export default WelcomeScreen;