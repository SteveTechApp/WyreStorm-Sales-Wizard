import React from 'react';
import DefaultWelcome from '../components/welcome/DefaultWelcome.tsx';

const WelcomeScreen: React.FC = () => {
    // The cockpit theme has been removed, so we always render the default welcome screen.
    return <DefaultWelcome />;
};

export default WelcomeScreen;