import React from 'react';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { Product } from '../utils/types.ts';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({ isOpen, onClose }) => {
    const { comparisonList, userProfile } = useAppContext();

    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        const currencyCode = userProfile?.currency || 'GBP';
        // FIX: Use the user's selected language directly as the locale for formatting.
        const locale = userProfile?.language || 'en-GB';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    };

    const renderValue = (value: any): string => {
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'object' && value !== null) {
            return Object.entries(value)
                .map(([key, val]) => `${key}: ${val}`)
                .join(', ');
        }
        if (typeof value === 'undefined' || value === null) return 'N/A';
        return String(value);
    };

    const specs: { key: string; label: string; path: (p: Product) => any }[] = [
        { key: 'category', label: 'Category', path: p => p.category },
        { key: 'description', label: 'Description', path: p => p.description },
        { key: 'dealerPrice', label: 'Dealer Price', path: p => formatCurrency(p.dealerPrice) },
        { key: 'msrp', label: 'MSRP', path: p => formatCurrency(p.msrp) },
        { key: 'audio.inputs', label: 'Audio Inputs', path: p => p.audio?.inputs },
        { key: 'audio.outputs', label: 'Audio Outputs', path: p => p.audio?.outputs },
        { key: 'audio.dsp', label: 'Audio DSP', path: p => p.audio?.dsp },
        { key: 'audio.speakerphone', label: 'Speakerphone', path: p => p.audio?.speakerphone },
    ];

    const doValuesDiffer = (path: (p: Product) => any) => {
        if (comparisonList.length < 2) return false;
        const firstValue = JSON.stringify(path(comparisonList[0]));
        return comparisonList.slice(1).some(p => JSON.stringify(path(p)) !== firstValue);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-background rounded-lg shadow-xl p-3 w-full max-w-5xl m-4 flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-border-color pb-3 mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-text-primary">Compare Products</h2>
                    <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
                </div>

                <div className="overflow-auto flex-grow">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead className="sticky top-0 bg-background-secondary z-10">
                            <tr>
                                <th className="p-3 text-left font-bold text-text-primary border-b border-r border-border-color w-1/5">Feature</th>
                                {comparisonList.map(product => (
                                    <th key={product.sku} className="p-3 text-left font-bold text-text-primary border-b border-l border-border-color">
                                        <p>{product.name}</p>
                                        <p className="font-mono text-xs font-normal text-text-secondary">{product.sku}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {specs.map(({ key, label, path }) => {
                                const differs = doValuesDiffer(path);
                                const hasData = comparisonList.some(p => path(p) !== undefined && path(p) !== null);
                                if (!hasData) return null;

                                return (
                                    <tr key={key} className={`border-b border-border-color ${differs ? 'bg-primary/10' : 'bg-card'}`}>
                                        <td className="p-3 font-semibold text-text-secondary align-top border-r border-border-color">{label}</td>
                                        {comparisonList.map(product => (
                                            <td key={product.sku} className="p-3 text-sm text-text-primary border-l border-border-color align-top">
                                                {renderValue(path(product))}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-border-color flex-shrink-0">
                    <button type="button" onClick={onClose} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Close</button>
                    <button type="button" onClick={onClose} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Done</button>
                </div>
            </div>
        </div>
    );
};

export default ProductComparisonModal;