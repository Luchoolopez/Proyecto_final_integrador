import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';
import { ProductImage } from './product-image.model';
import { Category } from './category.model';
import { User } from './user.model';
import { Order } from './order.model';
import { OrderDetail } from './order-detail.model';
import { Cart } from './cart.model';
import { Address } from './address.model';
import { RefreshToken } from './refresh_token.model';
import { Shipping } from './shipping.model';
import { Subscription } from './subscription.model';

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
  User,
  Order,
  OrderDetail,
  Cart,
  Address,
  RefreshToken,
  Shipping,
  Subscription,
  includeVariants,
  includeAllVariants,
  includeImages,
  includeCategory,
};

// Exportar tipos para facilitar el desarrollo con TypeScript
export type { Product as ProductType } from './product.model';
export type { ProductVariant as ProductVariantType } from './product-variant.model';
export type { ProductImage as ProductImageType } from './product-image.model';
export type { Category as CategoryType } from './category.model';
export type { User as UserType } from './user.model';
export type { Order as OrderType } from './order.model';
export type { OrderDetail as OrderDetailType } from './order-detail.model';
export type { Cart as CartType } from './cart.model';
export type { Address as AddressType } from './address.model';
export type {Subscription as SubscriptionType} from './subscription.model';
