import React from 'react';
import { Product } from '../utils/types';
import InfoModal from './InfoModal';
import ProductCard from './ProductCard';

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
