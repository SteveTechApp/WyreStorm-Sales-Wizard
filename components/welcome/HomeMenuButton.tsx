import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext.tsx';

interface HomeMenuButtonProps {
    to?: string;
    onClick?: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
    isDamaged?: boolean;
}

const HomeMenuButton: React.FC<HomeMenuButtonProps> = ({ to, onClick, icon, title, description, isDamaged }) => {
    const { theme } = useThemeContext();

    const content = (
        <div className="flex flex-col items-start p-6 h-full">
            {icon}
            <h3 className="text-xl font-bold mt-4 text-text-primary">{title}</h3>
            <p className="text-sm mt-1 flex-grow text-text-secondary">{description}</p>
        </div>
    );
    
    const isSpitfireTheme = theme === 'wyrestorm';
    const baseClassName = "block transition-all duration-300 h-48 text-left w-full border-2 bg-background-secondary shadow-lg";
    const themeClassName = isSpitfireTheme
        ? 'rounded-none border-border-color hover:bg-background hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'
        : 'rounded-lg border-border-color hover:shadow-2xl hover:-translate-y-2 hover:border-accent';

    const finalClassName = `${baseClassName} ${themeClassName} ${isDamaged ? 'bullet-hole' : ''}`;


    if (to) {
        return <Link to={to} className={finalClassName}>{content}</Link>;
    }
    
    return <button onClick={onClick} className={finalClassName} >{content}</button>;
};

export default HomeMenuButton;
