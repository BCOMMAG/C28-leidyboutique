'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { Footer } from '@/components/Footer';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos os Modelos');

  const {
    wishlistIds,
    toggleWishlist,
    addToCart,
    cartCount,
    wishlistCount,
    openCart,
    closeCart,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    selectedProduct,
    isProductModalOpen,
    openProduct,
    closeProduct,
    isSizeGuideOpen,
    openSizeGuide,
    closeSizeGuide,
    isCartOpen
  } = useStore();

  // Filtragem de produtos por categoria
  const filteredProducts = activeCategory === 'Todos os Modelos'
    ? PRODUCTS
    : activeCategory === 'Mais Vendidos'
    ? PRODUCTS
    : activeCategory === 'OUTLET'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  // 4 produtos para preencher cada seção na apresentação
  const bestSellerProducts = [PRODUCTS[3], PRODUCTS[0], PRODUCTS[2], PRODUCTS[1]];
  const outletProducts = PRODUCTS;

  const handleCategorySelection = (category: string) => {
    setActiveCategory(category);
    if (category === 'Mais Vendidos') {
      document.getElementById('mais-vendidos')?.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'OUTLET') {
      document.getElementById('outlet')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121110] text-[#1A1918] dark:text-[#FAF8F5] transition-colors duration-300">
      {/* Header Fixo / Transparente */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={openCart}
        onSelectCategory={handleCategorySelection}
        activeCategory={activeCategory}
      />

      <main className="flex-1">
        {/* Banner Hero com Vídeo Oficial */}
        <HeroBanner
          onExploreClick={() => {
            const el = document.getElementById('mais-vendidos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 1. SEÇÃO: MAIS VENDIDOS */}
        <section id="mais-vendidos" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#DFBE76] font-semibold block mb-1.5">
                Os Favoritos da Boutique
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
                Mais Vendidos
              </h2>
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#A8A29E] max-w-sm hidden sm:block">
              As peças com maior procura na nossa boutique, reconhecidas pelo caimento impecável e acabamento nobre.
            </p>
          </div>

          {/* Grid: 2 por linha no mobile, 4 no desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellerProducts.map((product) => (
              <ProductCard
                key={`bestseller-${product.id}`}
                product={product}
                onOpenDetails={openProduct}
                onQuickAdd={(p) => {
                  addToCart({
                    product: p,
                    size: p.sizes[0],
                    color: p.colors[0].name,
                    quantity: 1
                  });
                }}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {/* Botão Ver Mais Produtos */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/catalogo?categoria=Mais%20Vendidos"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full border border-[#C5A059] bg-white dark:bg-[#1C1A18] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs cursor-pointer"
            >
              <span>Ver Mais Produtos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 2. SEÇÃO: COLEÇÃO ATUAL (CATÁLOGO GERAL) */}
        <section id="catalogo" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#DFBE76] font-semibold block mb-2">
              Todas as Peças
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
              Coleção Atual
            </h2>

            {/* Filtros por Categoria */}
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                const isOutletTab = category === 'OUTLET';
                return (
                  <button
                    key={category}
                    onClick={() => handleCategorySelection(category)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#1A1918] dark:bg-[#C5A059] text-[#FAF8F5] shadow-sm'
                        : isOutletTab
                        ? 'bg-white dark:bg-[#1C1A18] text-[#C5A059] border border-[#C5A059] hover:bg-[#C5A059] hover:text-white font-bold'
                        : 'bg-white dark:bg-[#1C1A18] text-[#57534E] dark:text-[#D6D3D1] border border-[#C5A059]/30 hover:border-[#C5A059] hover:text-[#1A1918] dark:hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid: 2 por linha no mobile, 4 no desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={openProduct}
                onQuickAdd={(p) => {
                  addToCart({
                    product: p,
                    size: p.sizes[0],
                    color: p.colors[0].name,
                    quantity: 1
                  });
                }}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {/* Botão Ver Mais Produtos do Catálogo */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>Ver Mais Produtos no Catálogo Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 3. SEÇÃO: OUTLET */}
        <section id="outlet" className="py-16 sm:py-24 bg-[#F5EFE6]/70 dark:bg-[#181615] border-t border-[#C5A059]/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#DFBE76] font-bold block mb-1.5">
                  Oportunidades Especiais
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
                  OUTLET & Peças Selecionadas
                </h2>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] max-w-sm hidden sm:block">
                Peças exclusivas com valores promocionais e últimas unidades disponíveis na boutique.
              </p>
            </div>

            {/* Grid: 2 por linha no mobile, 4 no desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {outletProducts.map((product) => (
                <ProductCard
                  key={`outlet-${product.id}`}
                  product={product}
                  isOutletSection={true}
                  onOpenDetails={openProduct}
                  onQuickAdd={(p) => {
                    addToCart({
                      product: p,
                      size: p.sizes[0],
                      color: p.colors[0].name,
                      quantity: 1
                    });
                  }}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>

            {/* Botão Ver Mais Produtos do Outlet */}
            <div className="mt-8 sm:mt-12 text-center">
              <Link
                href="/catalogo?categoria=OUTLET"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full border border-[#C5A059] bg-white dark:bg-[#1C1A18] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#C5A059] hover:text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs cursor-pointer"
              >
                <span>Ver Mais Peças do OUTLET</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Modal de Detalhes do Produto (Com Vídeo em 1º Lugar) */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProduct}
        onAddToCart={addToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        onOpenSizeGuide={openSizeGuide}
        onSelectPairedProduct={openProduct}
      />

      {/* Sacola Lateral (Cart Drawer) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onQuickAddItem={openProduct}
      />

      {/* Modal Guia de Medidas */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={closeSizeGuide}
      />

      {/* Botão Flutuante de WhatsApp Geral */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsapp}?text=Ol%C3%A1%20Leidy!%20Estou%20visitando%20a%20sua%20loja%20online%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-6 z-30 p-3.5 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group ${
          cartCount > 0 ? 'bottom-20 sm:bottom-22' : 'bottom-6'
        }`}
        aria-label="Falar com a Leidy no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-bold px-0 group-hover:px-2">
          Falar com a Leidy
        </span>
      </a>
    </div>
  );
}
