import React from 'react';
import { DesignFeedbackItem } from '@/utils/types';

interface FeedbackCategoryProps {
  title: string;
  items: DesignFeedbackItem[] | undefined;
}

const FeedbackCategory: React.FC<FeedbackCategoryProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="p-3 bg-background rounded-md text-sm">
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackCategory;
