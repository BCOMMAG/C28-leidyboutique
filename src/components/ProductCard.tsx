'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isOutletSection?: boolean;
  columnsCount?: 2 | 3 | 4 | 5;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist,
  isOutletSection = false,
  columnsCount = 4
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = product.media.find((m) => m.type === 'video')?.src;

  // Reproduzir vídeo somente no hover (Desktop)
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, videoSrc]);

  // Variações de estilo baseadas na densidade de colunas
  const isCompact = columnsCount === 5;
  const isMedium = columnsCount === 4;
  const isSpacious = columnsCount === 2 || columnsCount === 3;

  const [isJustAdded, setIsJustAdded] = useState(false);
  const { cartCount, addToCart } = useStore();

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartCount === 0) {
      // 1. Carrinho Vazio: Comprar Agora -> Adiciona e abre a sacola diretamente
      addToCart({
        product,
        size: product.sizes[0] || 'Tamanho Único',
        color: product.colors[0]?.name || 'Padrão',
        quantity: 1,
        openDrawer: true
      });
    } else {
      // 2. Já existem itens no carrinho: Adiciona silenciosamente e a barra inferior guia o fechamento
      addToCart({
        product,
        size: product.sizes[0] || 'Tamanho Único',
        color: product.colors[0]?.name || 'Padrão',
        quantity: 1,
        openDrawer: false
      });
      setIsJustAdded(true);
      setTimeout(() => setIsJustAdded(false), 1600);
    }
  };

  return (
    <div
      className="group relative flex flex-col h-full bg-white dark:bg-[#1A1918] rounded-2xl overflow-hidden border border-[#C5A059]/20 dark:border-[#C5A059]/30 transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Moldura da Imagem / Vídeo com proporção de alta moda (3:4) */}
      <div
        className="relative aspect-[3/4] w-full bg-[#F4F2EE] dark:bg-[#22201E] overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        {/* Imagem do Produto */}
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`object-cover object-top transition-all duration-700 ${
            isHovered && videoSrc ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
          }`}
        />

        {/* Vídeo do Provador (Toca somente no hover) */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 pointer-events-none ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de Destaque: Somente OUTLET com % de OFF ou 'Restam apenas 5 peças' */}
        {product.discountBadge ? (
          <div className={`absolute top-2.5 left-2.5 bg-[#C5A059] text-white uppercase tracking-wider font-bold rounded-md backdrop-blur-sm shadow-xs ${
            isCompact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2.5 py-1'
          }`}>
            {product.discountBadge}
          </div>
        ) : product.badge?.includes('Restam') ? (
          <div className={`absolute top-2.5 left-2.5 bg-[#8B5A2B]/90 dark:bg-black/90 text-[#FAF8F5] uppercase tracking-wider font-semibold rounded-md backdrop-blur-sm border border-[#C5A059]/40 ${
            isCompact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2.5 py-1'
          }`}>
            {product.badge}
          </div>
        ) : null}

        {/* Botão de Favoritar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-full transition-all duration-300 shadow-md cursor-pointer ${
            isWishlisted
              ? 'bg-[#C5A059] text-white'
              : 'bg-white/90 dark:bg-[#1A1918]/90 text-[#1A1918] dark:text-white hover:bg-white hover:text-[#C5A059]'
          }`}
          aria-label="Adicionar aos favoritos"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Botão Overlay Flutuante ao Hover (Desktop) */}
        <div className="absolute bottom-2.5 left-2.5 right-12 hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="w-full py-2 bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-md hover:bg-[#1A1918] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span className="truncate">{isCompact ? 'Detalhes' : 'Ver Detalhes'}</span>
          </button>
        </div>
      </div>

      {/* Detalhes do Produto com Slots de Altura Garantida */}
      <div className={`flex flex-col flex-1 justify-between bg-white dark:bg-[#1A1918] ${
        isCompact ? 'p-2.5 sm:p-3' : isMedium ? 'p-3 sm:p-4' : 'p-4 sm:p-5'
      }`}>
        <div className="flex flex-col">
          {/* SLOT 1: Categoria (Altura fixa garantida para nunca empurrar o título) */}
          <div className="h-5 sm:h-6 flex items-center">
            <span className={`uppercase tracking-widest text-[#C5A059] dark:text-[#DFBE76] font-medium truncate block ${
              isCompact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-[11px]'
            }`}>
              {product.category}
            </span>
          </div>

          {/* SLOT 2: Nome da Peça (Altura fixa reservada com line-clamp-2) */}
          <div className={`flex items-start ${
            isCompact ? 'h-8 sm:h-9' : isMedium ? 'h-9 sm:h-10' : 'h-11 sm:h-12'
          }`}>
            <h3
              onClick={() => onOpenDetails(product)}
              className={`font-serif-luxury font-medium text-[#1A1918] dark:text-[#FAF8F5] leading-snug hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer line-clamp-2 ${
                isCompact
                  ? 'text-xs sm:text-[13px]'
                  : isMedium
                  ? 'text-xs sm:text-sm'
                  : 'text-sm sm:text-base'
              }`}
              title={product.name}
            >
              {product.name}
            </h3>
          </div>

          {/* SLOT 3: Paleta de Cores e Tamanhos (Altura fixa perfeitamente nivelada) */}
          <div className="mt-1.5 sm:mt-2 h-6 sm:h-7 flex items-center justify-between gap-1">
            {/* Cores */}
            <div className="flex items-center gap-1 min-w-0">
              <div className="flex items-center -space-x-1 shrink-0">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-2xs block shrink-0"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <span className={`text-[#78716C] dark:text-[#A8A29E] truncate ${
                isCompact ? 'text-[10px] max-w-[60px]' : 'text-[11px] max-w-[90px]'
              }`}>
                {product.colors.length > 1
                  ? `${product.colors.length} cores`
                  : product.colors[0]?.name}
              </span>
            </div>

            {/* Tamanho */}
            <span className={`text-[#78716C] dark:text-[#A8A29E] bg-[#FAF8F5] dark:bg-[#252220] rounded border border-[#C5A059]/20 font-medium shrink-0 ${
              isCompact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] sm:text-[11px] px-2 py-0.5'
            }`}>
              {product.sizes[0]?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* SLOT 4: Preço e Botão de Ação (Cravado na base do card) */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#C5A059]/15 flex items-end justify-between gap-1">
          <div className="min-w-0 flex-1">
            {/* Rótulo de preço */}
            <span className="text-[9px] uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] block truncate leading-none mb-1">
              {isOutletSection ? 'Preço Outlet' : 'Valor da Peça'}
            </span>
            {/* Valor numérico */}
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className={`font-bold text-[#1A1918] dark:text-[#FAF8F5] tracking-tight leading-none ${
                isCompact ? 'text-sm sm:text-base' : isMedium ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
              }`}>
                {product.formattedPrice}
              </span>
              {isOutletSection && product.formattedOriginalPrice && (
                <span className="text-[10px] text-[#A8A29E] line-through font-normal leading-none">
                  {product.formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Botão de Compra Inteligente (Comprar Agora vs Adicionar ao Carrinho) */}
          {cartCount === 0 ? (
            <button
              onClick={handleAction}
              className={`rounded-lg bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] dark:hover:text-[#1A1918] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs ${
                isCompact
                  ? 'px-2 py-1.5 gap-1 text-[11px] font-semibold'
                  : 'px-3 py-2 gap-1.5 text-xs font-semibold'
              }`}
              title="Comprar Agora"
              aria-label="Comprar Agora"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>{isCompact ? 'Comprar' : 'Comprar Agora'}</span>
            </button>
          ) : (
            <button
              onClick={handleAction}
              className={`rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-2xs border ${
                isJustAdded
                  ? 'bg-[#25D366] text-white border-[#25D366]'
                  : 'bg-[#FAF8F5] dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] border-[#C5A059]/40'
              } ${
                isCompact
                  ? 'px-2 py-1.5 gap-1 text-[11px] font-medium'
                  : 'px-2.5 py-2 gap-1 text-xs font-medium'
              }`}
              title="Adicionar à Sacola"
              aria-label="Adicionar à Sacola"
            >
              {isJustAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Adicionado</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>{isCompact ? '+ Sacola' : '+ Carrinho'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
