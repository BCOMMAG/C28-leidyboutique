'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductCard } from '@/components/ProductCard';
import { ProductLoopCarousel } from '@/components/ProductLoopCarousel';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { Footer } from '@/components/Footer';
import { EditorialBreak } from '@/components/EditorialBreak';
import { AboutLeidy } from '@/components/AboutLeidy';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { ArrowRight } from 'lucide-react';

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

  // Produtos organizados para cada vitrine temática da Home
  const newReleasesProducts = PRODUCTS.filter(
    (p) => p.status?.includes('Lançamento') || p.id === '04-conjunto-alfaiataria-bege' || p.id === '03-conjunto-alfaiataria-terracota' || p.id === '07-t-shirt-algodao-egipcio' || p.id === '01-casaco-tricot'
  );
  const bestSellerProducts = PRODUCTS.filter((p) => p.isBestSeller);
  const outletProducts = PRODUCTS.filter((p) => p.isOutlet);

  const handleCategorySelection = (category: string) => {
    setActiveCategory(category);
    if (category === 'Lançamentos') {
      document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'Mais Vendidos') {
      document.getElementById('mais-vendidos')?.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'OUTLET') {
      document.getElementById('outlet')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
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
            const el = document.getElementById('lancamentos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 1. SEÇÃO: LANÇAMENTOS */}
        <section id="lancamentos" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#DFBE76] font-semibold block mb-1.5">
                Novidades da Temporada
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
                Lançamentos Exclusivos
              </h2>
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#A8A29E] max-w-sm hidden sm:block">
              As últimas novidades que acabaram de chegar na boutique, com tecidos nobres e acabamento impecável.
            </p>
          </div>

          {/* Carrossel em looping automático com 4 cards (pausa no hover/clique) */}
          <ProductLoopCarousel
            products={newReleasesProducts}
            onOpenDetails={openProduct}
            onQuickAdd={(p) => {
              addToCart({
                product: p,
                size: p.sizes[0],
                color: p.colors[0].name,
                quantity: 1
              });
            }}
            isWishlisted={(id) => wishlistIds.includes(id)}
            onToggleWishlist={toggleWishlist}
          />

          {/* Botão Ver Todos os Lançamentos */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/catalogo?status=Lançamento"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-none border border-[#C5A059] bg-white dark:bg-[#1C1A18] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs cursor-pointer"
            >
              <span>Ver Todos os Lançamentos no Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 2. SEÇÃO: MAIS VENDIDOS */}
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

          {/* Carrossel em looping automático com 4 cards (pausa no hover/clique) */}
          <ProductLoopCarousel
            products={bestSellerProducts}
            onOpenDetails={openProduct}
            onQuickAdd={(p) => {
              addToCart({
                product: p,
                size: p.sizes[0],
                color: p.colors[0].name,
                quantity: 1
              });
            }}
            isWishlisted={(id) => wishlistIds.includes(id)}
            onToggleWishlist={toggleWishlist}
          />

          {/* Botão Ver Mais Produtos */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/catalogo?categoria=Mais%20Vendidos"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-none border border-[#C5A059] bg-white dark:bg-[#1C1A18] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs cursor-pointer"
            >
              <span>Ver Mais Produtos Mais Vendidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* FAIXA EDITORIAL DE RESPIRO (MANIFESTO DA BOUTIQUE & PROVADOR) */}
        <EditorialBreak />

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

            {/* Carrossel em looping automático com 4 cards (pausa no hover/clique) */}
            <ProductLoopCarousel
              products={outletProducts}
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
              isWishlisted={(id) => wishlistIds.includes(id)}
              onToggleWishlist={toggleWishlist}
            />

            {/* Botão Ver Mais Produtos do Outlet */}
            <div className="mt-8 sm:mt-12 text-center">
              <Link
                href="/catalogo?categoria=OUTLET"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-none border border-[#C5A059] bg-white dark:bg-[#1C1A18] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#C5A059] hover:text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs cursor-pointer"
              >
                <span>Ver Mais Peças do OUTLET</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. SEÇÃO INSTITUCIONAL: SOBRE A LEIDY & PROPÓSITO */}
        <AboutLeidy />

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

      </div>
  );
}
