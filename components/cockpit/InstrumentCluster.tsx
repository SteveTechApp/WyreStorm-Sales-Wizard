import React from 'react';

interface InstrumentClusterProps {
    children: React.ReactNode;
    title: string;
}

const InstrumentCluster: React.FC<InstrumentClusterProps> = ({ children, title }) => {
  return (
    <div className="p-4 bg-background-secondary border-2 border-border-color rounded-none">
        <h3 className="font-mono text-center text-accent uppercase tracking-widest border-b-2 border-border-color pb-2 mb-4">// {title}</h3>
        <div className="flex justify-around items-center gap-4">
            {children}
        </div>
    </div>
  );
};

export default InstrumentCluster;
