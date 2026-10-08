'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';

interface RecentlyViewedSectionProps {
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  onOpenDetails,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist
}) => {
  const { recentlyViewedProducts, clearRecentlyViewed } = useStore();

  // Não renderiza nada se o usuário ainda não tiver clicado/visto nenhum produto
  if (!recentlyViewedProducts || recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="vistos-recentemente"
      className="py-14 sm:py-20 lg:py-24 bg-transparent border-t border-[#C5A059]/25 scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#DFBE76]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#DFBE76] font-bold drop-shadow-xs">
                Seu Histórico Exclusivo
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl text-white font-medium drop-shadow-sm">
              Vistos Recentemente por Você
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-white/85 max-w-sm hidden sm:block">
              Peças que você visualizou recentemente na boutique para você comparar e escolher com calma.
            </p>

            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Limpar histórico recente"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>

        {/* Grid de Cards dos Produtos Vistos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {recentlyViewedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
              onQuickAdd={onQuickAdd}
              isWishlisted={isWishlisted(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Rodapé da seção */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-none border border-[#C5A059] bg-white dark:bg-[#1C1A18] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs cursor-pointer group"
          >
            <span>Explorar Outros Modelos no Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-current group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
