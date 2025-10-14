import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../utils/types.ts';
import { PRODUCT_DATABASE } from '../data/productDatabase.ts';
import { TRAINING_MODULES } from '../data/trainingContent.ts';
import { NAV_LINKS } from '../data/navigation.ts';
import InfoModal from './InfoModal.tsx';
import ProductInfoModal from './ProductInfoModal.tsx';

// --- Sub-components ---

interface SearchResultItemProps {
  title: string;
  description?: string;
  category: string;
  onClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ title, description, category, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-3 rounded-lg hover:bg-background-secondary transition-colors flex justify-between items-center group">
        <div>
            <p className="font-semibold text-text-primary group-hover:text-accent">{title}</p>
            {description && <p className="text-sm text-text-secondary truncate">{description}</p>}
        </div>
        <span className="text-xs font-mono bg-background text-text-secondary px-2 py-1 rounded-md flex-shrink-0 ml-4 border border-border-color">{category}</span>
    </button>
);

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);


// --- Main Search Component ---

const Search: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: Product[]; training: typeof TRAINING_MODULES; pages: typeof NAV_LINKS }>({ products: [], training: [], pages: [] });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut listener (Cmd+K / Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen])

    // Debounced search logic
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!query.trim()) {
                setResults({ products: [], training: [], pages: [] });
                return;
            }

            const lowerCaseQuery = query.toLowerCase();

            const productResults = PRODUCT_DATABASE.filter(p =>
                p.name.toLowerCase().includes(lowerCaseQuery) ||
                p.sku.toLowerCase().includes(lowerCaseQuery) ||
                p.description.toLowerCase().includes(lowerCaseQuery) ||
                p.tags.some(t => t.toLowerCase().includes(lowerCaseQuery))
            ).slice(0, 5);

            const trainingResults = TRAINING_MODULES.filter(m =>
                m.title.toLowerCase().includes(lowerCaseQuery) ||
                m.contentPages.some(p => p.content.toLowerCase().includes(lowerCaseQuery))
            ).slice(0, 3);

            const pageResults = NAV_LINKS.filter(l =>
                l.label.toLowerCase().includes(lowerCaseQuery)
            ).slice(0, 3);

            setResults({
                products: productResults,
                training: trainingResults,
                pages: pageResults,
            });

        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    const handleCloseModal = () => {
        setIsOpen(false);
        setQuery('');
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handlePageClick = (path: string) => {
        handleCloseModal();
        navigate(path);
    };

    const handleCloseProductModal = () => {
        setSelectedProduct(null);
        handleCloseModal();
    }

    const hasResults = results.products.length > 0 || results.training.length > 0 || results.pages.length > 0;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-2 text-sm text-text-secondary bg-background-secondary border border-border-color rounded-md px-3 py-2 hover:bg-border-color hover:text-text-primary transition-colors w-64 text-left"
                aria-label="Search (Ctrl+K)"
            >
                <SearchIcon className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="ml-auto text-xs font-mono bg-background border border-border-color rounded px-1.5 py-0.5">⌘K</kbd>
            </button>

            <InfoModal isOpen={isOpen} onClose={handleCloseModal} className="max-w-2xl" title={null}>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                         <SearchIcon className="h-5 w-5 text-text-secondary" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products, features, or training..."
                        className="w-full p-3 pl-10 border-2 border-border-color rounded-lg bg-input-bg focus:outline-none focus:border-accent"
                    />
                </div>
                
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    {query && !hasResults && <p className="text-center text-text-secondary p-4">No results found for "{query}".</p>}
                    
                    {results.products.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-bold text-sm uppercase text-text-secondary px-3 mb-1">Products</h4>
                            {results.products.map(p => <SearchResultItem key={p.sku} title={p.name} description={p.sku} category={p.category} onClick={() => handleProductClick(p)} />)}
                        </div>
                    )}
                    
                    {results.training.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-bold text-sm uppercase text-text-secondary px-3 mb-1">Training</h4>
                            {results.training.map(t => <SearchResultItem key={t.id} title={t.title} category="Module" onClick={() => handlePageClick('/training')} />)}
                        </div>
                    )}

                    {results.pages.length > 0 && (
                        <div>
                            <h4 className="font-bold text-sm uppercase text-text-secondary px-3 mb-1">Navigation</h4>
                            {results.pages.map(l => <SearchResultItem key={l.path} title={l.label} category="Page" onClick={() => handlePageClick(l.path)} />)}
                        </div>
                    )}
                </div>
            </InfoModal>

            {selectedProduct && (
                <ProductInfoModal
                    isOpen={!!selectedProduct}
                    onClose={handleCloseProductModal}
                    product={selectedProduct}
                />
            )}
        </>
    );
};

export default Search;
