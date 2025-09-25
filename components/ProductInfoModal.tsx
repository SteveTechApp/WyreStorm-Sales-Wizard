import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { Product } from '../utils/types.ts';
import InfoModal from './InfoModal.tsx';
import ProductCard from './ProductCard.tsx';

interface ProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} title="Product Details">
        <ProductCard product={product} />
    </InfoModal>
  );
};

export default ProductInfoModal;