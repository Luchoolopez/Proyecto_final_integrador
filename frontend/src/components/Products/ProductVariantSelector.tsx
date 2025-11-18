import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { type Variant } from '../../types/Variant';

interface ProductVariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelectVariant: (variant: Variant) => void;
}

const TalleOrder: { [key: string]: number } = {
  'XS': 1,
  'S': 2,
  'M': 3,
  'L': 4,
  'XL': 5,
  'XXL': 6,
};

const getTalleSortValue = (talle: string): number => {
    if (talle in TalleOrder) {
        return TalleOrder[talle];
    }
    
    const numericValue = parseInt(talle, 10);
    if (!isNaN(numericValue)) {
        return numericValue; 
    }

    return 999;
};


export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {

  const sortedVariants = [...variants].sort((a, b) => {
      return getTalleSortValue(a.talle) - getTalleSortValue(b.talle);
  });

  return (
    <div>
      <h5 className="mb-3">Talle</h5>
      <ButtonGroup>
        {sortedVariants.map((variant) => (
          <Button
            key={variant.id}
            variant={selectedVariant?.id === variant.id ? 'dark' : 'outline-dark'}
            onClick={() => onSelectVariant(variant)}
            disabled={variant.stock === 0}
            className="rounded-0" 
          >
            {variant.talle}
            {variant.stock === 0 && <span className="strikethrough-line"></span>}
          </Button>
        ))}
      </ButtonGroup>
      
      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock < 5 && (
        <p className="text-danger mt-2 small">¡Quedan solo {selectedVariant.stock} unidades!</p>
      )}
      {selectedVariant && selectedVariant.stock === 0 && (
        <p className="text-danger mt-2 small">Agotado</p>
      )}

    </div>
  );
};