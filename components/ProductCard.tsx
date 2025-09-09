import React from 'react';
import { Product } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatCurrency = (amount: number) => {
    // A default currency is fine here for display purposes.
    const currency = 'GBP'; 
    const symbol = CURRENCY_OPTIONS[currency]?.symbol || '£';
    return `${symbol}${amount.toFixed(2)}`;
  };
  
  const productUrl = `https://www.wyrestorm.com/product/${product.sku}`;

  return (
    <div className="p-3 my-2 bg-white border border-gray-200 rounded-lg shadow-sm not-prose">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800">{product.name}</h4>
          <p className="text-xs font-mono text-gray-500">{product.sku} | {product.category}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-sm font-semibold text-gray-800">{formatCurrency(product.dealerPrice)}</p>
          <p className="text-xs text-gray-500">Dealer</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 my-2">{product.description}</p>
      <a 
        href={productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
      >
        View Product Page →
      </a>
    </div>
  );
};

export default ProductCard;