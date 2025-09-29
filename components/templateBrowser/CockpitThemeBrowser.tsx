import React from 'react';
import { UserTemplate } from '../../utils/types.ts';

const CockpitThemeBrowser: React.FC = () => {
  // This is a placeholder for the cockpit theme's template browser view.
  return (
    <div className="p-4 border-2 border-slate-700 rounded-lg mfd-screen text-green-400 font-mono">
       <p>&gt; TEMPLATE_DATABASE_ACCESS...</p>
       <p>&gt; DISPLAYING_AVAILABLE_BLUEPRINTS...</p>
    </div>
  );
};

export default CockpitThemeBrowser;
