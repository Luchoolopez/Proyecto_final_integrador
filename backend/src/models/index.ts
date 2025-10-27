import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';
import { ProductImage } from './product-image.model';
import { Category } from './category.model';

import {
  setupAssociations,
  includeVariants,
  includeAllVariants,
  includeImages,
  includeCategory,
} from './associations';

setupAssociations();

export {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  includeVariants,
  includeAllVariants,
  includeImages,
  includeCategory,
};

export type { Product as ProductType } from './product.model';
export type { ProductVariant as ProductVariantType } from './product-variant.model';
export type { ProductImage as ProductImageType } from './product-image.model';
export type { Category as CategoryType } from './category.model';
