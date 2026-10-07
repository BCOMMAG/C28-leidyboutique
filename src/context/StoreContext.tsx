'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { PRODUCTS } from '@/data/products';

interface StoreContextType {
  cartItems: CartItem[];
  wishlistIds: string[];
  isCartOpen: boolean;
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  isSizeGuideOpen: boolean;
  cartCount: number;
  wishlistCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addToCart: (params: {
    product: Product;
    size: string;
    color: string;
    quantity: number;
  }) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  openCart: () => void;
  closeCart: () => void;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Carregar dados e tema do localStorage na montagem
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('leidy_wishlist');
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }
      const savedCart = localStorage.getItem('leidy_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedTheme = localStorage.getItem('leidy_theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('leidy_theme', nextTheme);
      } catch (e) {
        console.error(e);
      }
      return nextTheme;
    });
  };

  // Salvar favoritos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('leidy_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Salvar carrinho no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('leidy_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const addToCart = ({
    product,
    size,
    color,
    quantity
  }: {
    product: Product;
    size: string;
    color: string;
    quantity: number;
  }) => {
    const itemKey = `${product.id}-${size}-${color}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.id === itemKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.thumbnail,
          size,
          color,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProduct = () => {
    setIsProductModalOpen(false);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openSizeGuide = () => setIsSizeGuideOpen(true);
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistIds.length;

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        wishlistIds,
        isCartOpen,
        selectedProduct,
        isProductModalOpen,
        isSizeGuideOpen,
        cartCount,
        wishlistCount,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleWishlist,
        isWishlisted,
        openProduct,
        closeProduct,
        openCart,
        closeCart,
        openSizeGuide,
        closeSizeGuide
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
