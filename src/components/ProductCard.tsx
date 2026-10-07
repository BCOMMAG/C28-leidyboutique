'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isOutletSection?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist,
  isOutletSection = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#C5A059]/20 transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Moldura da Imagem com proporção de alta moda (3:4) */}
      <div className="relative aspect-[3/4] w-full bg-[#F4F2EE] overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        
        {/* Imagem do Produto */}
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de Destaque da Peça ou Desconto */}
        {isOutletSection && product.discountBadge ? (
          <div className="absolute top-3 left-3 bg-[#C5A059] text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-sm">
            {product.discountBadge}
          </div>
        ) : product.badge ? (
          <div className="absolute top-3 left-3 bg-[#1A1918]/90 text-[#FAF8F5] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
            {product.badge}
          </div>
        ) : null}

        {/* Badge Especial: Vídeo Disponível */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 text-[#1A1918] text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm border border-[#C5A059]/40 backdrop-blur-sm">
          <div className="w-3.5 h-3.5 rounded-full bg-[#C5A059] flex items-center justify-center text-white">
            <Play className="w-2 h-2 fill-current ml-0.5" />
          </div>
          <span>Vídeo</span>
        </div>

        {/* Botão de Favoritar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-md ${
            isWishlisted
              ? 'bg-[#C5A059] text-white'
              : 'bg-white/90 text-[#1A1918] hover:bg-white hover:text-[#C5A059]'
          }`}
          aria-label="Adicionar aos favoritos"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Botão Overlay Flutuante ao Hover (Desktop) */}
        <div className="absolute bottom-3 left-3 right-14 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="w-full py-2.5 bg-white text-[#1A1918] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md hover:bg-[#1A1918] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver no Provador</span>
          </button>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Categoria */}
          <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-medium block mb-1">
            {product.category}
          </span>

          {/* Nome */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="font-serif-luxury text-base sm:text-lg font-medium text-[#1A1918] leading-snug hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Paleta de Cores e Tamanhos */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              <span className="text-[11px] text-[#78716C] ml-1">
                {product.colors.length > 1 ? `${product.colors.length} cores` : product.colors[0]?.name}
              </span>
            </div>

            <span className="text-[11px] text-[#78716C] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#C5A059]/20">
              {product.sizes[0]?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Preço e Botão de Ação */}
        <div className="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#78716C] block">
              {isOutletSection ? 'Preço Outlet' : 'Valor da Peça'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#1A1918] tracking-tight">
                {product.formattedPrice}
              </span>
              {isOutletSection && product.formattedOriginalPrice && (
                <span className="text-xs text-[#A8A29E] line-through font-normal">
                  {product.formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(product)}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[#FAF8F5] text-[#1A1918] hover:bg-[#1A1918] hover:text-white transition-all border border-[#C5A059]/30 flex items-center gap-1.5 text-xs font-medium"
            title="Abrir Provador"
          >
            <Play className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
            <span className="hidden sm:inline">Provador</span>
          </button>
        </div>

      </div>
    </div>
  );
};
