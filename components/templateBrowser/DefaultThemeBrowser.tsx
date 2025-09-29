import React from 'react';
import { UserTemplate } from '../../utils/types.ts';

const DefaultThemeBrowser: React.FC = () => {
  // This is a placeholder component for the default theme's template browser view.
  // In a real app, this would receive templates and render them.
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold">Template Browser (Default View)</h3>
      <p className="text-sm text-gray-600">Templates would be displayed here in a grid or list format.</p>
    </div>
  );
};

export default DefaultThemeBrowser;
