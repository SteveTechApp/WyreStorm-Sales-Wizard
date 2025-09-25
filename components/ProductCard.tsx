import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { Product } from '../utils/types.ts';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import ImagePlaceholder from './ImagePlaceholder.tsx';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { toggleComparison, comparisonList, userProfile } = useAppContext();
    const isComparing = comparisonList.some(p => p.sku === product.sku);
    
    const formatCurrency = (amount: number) => {
        const currencyCode = userProfile?.currency || 'GBP';
        // Use the appropriate locale for correct formatting conventions (e.g., symbol position)
        // FIX: Use the user's selected language directly as the locale for formatting.
        const locale = userProfile?.language || 'en-GB';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    };

    return (
        <div className="bg-card p-2 my-2 rounded-lg border border-border-color not-prose flex gap-4 items-start">
             <div className="w-16 h-16 bg-white rounded-md flex-shrink-0 overflow-hidden">
                <ImagePlaceholder text={product.name} className="w-full h-full" />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-text-primary">{product.name}</h4>
                        <p className="text-xs font-mono text-text-secondary">{product.sku}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-text-primary">{formatCurrency(product.dealerPrice)}</p>
                        <p className="text-xs text-text-secondary line-through">{formatCurrency(product.msrp)}</p>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mt-1">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                     <button 
                        onClick={() => toggleComparison(product)} 
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${isComparing ? 'bg-destructive/20 text-destructive' : 'bg-background-secondary hover:bg-border-color'}`}
                    >
                        {isComparing ? 'Remove from Compare' : 'Compare'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;