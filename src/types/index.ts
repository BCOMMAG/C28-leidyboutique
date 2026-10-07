export interface ProductMedia {
  type: 'video' | 'image';
  src: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  originalPrice?: number;
  formattedOriginalPrice?: string;
  discountBadge?: string;
  isOutlet?: boolean;
  isBestSeller?: boolean;
  category: string;
  badge?: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string; imageSrc?: string }[];
  media: ProductMedia[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  pairedWithId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}
