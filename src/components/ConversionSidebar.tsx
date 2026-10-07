'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Flame,
  Clock,
  Sparkles,
  MessageCircle,
  Truck,
  Video,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { Product } from '@/types';
import { PRODUCTS, STORE_INFO } from '@/data/products';

interface ConversionSidebarProps {
  onOpenProduct: (product: Product) => void;
}

export const ConversionSidebar: React.FC<ConversionSidebarProps> = ({ onOpenProduct }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Produtos para os slides de alta conversão
  const outletDeals = PRODUCTS.filter((p) => p.isOutlet);
  const lastPieces = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[9] || PRODUCTS[2]];
  const topSets = PRODUCTS.filter((p) => p.category.includes('Conjuntos') || p.category.includes('Alfaiataria'));

  const slides = [
    {
      title: 'Melhores Ofertas',
      subtitle: 'Peças em promoção imperdível',
      tag: 'OUTLET ATÉ 24% OFF',
      tagColor: 'bg-[#C5A059] text-white',
      icon: Flame,
      product: outletDeals[activeSlide % outletDeals.length] || PRODUCTS[1],
      highlight: 'Desconto por tempo limitado'
    },
    {
      title: 'Últimas Peças',
      subtitle: 'Poucas unidades no estoque',
      tag: 'ÚLTIMAS 2 UNIDADES',
      tagColor: 'bg-red-600 text-white animate-pulse',
      icon: Clock,
      product: lastPieces[activeSlide % lastPieces.length] || PRODUCTS[0],
      highlight: 'Alta procura na boutique'
    },
    {
      title: 'Melhores Conjuntos',
      subtitle: 'O caimento mais elogiado',
      tag: 'FAVORITO DA LEIDY',
      tagColor: 'bg-[#1A1918] dark:bg-black text-[#DFBE76]',
      icon: Sparkles,
      product: topSets[activeSlide % topSets.length] || PRODUCTS[3],
      highlight: 'Conjunto completo elegante'
    }
  ];

  const currentSlide = slides[activeSlide % slides.length];

  // Alternância automática a cada 4.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <aside className="space-y-5 sticky top-24">
      
      {/* 1. VITRINE DINÂMICA / CARROSSEL DE ALTA CONVERSÃO */}
      <div className="bg-white dark:bg-[#1A1918] p-4 rounded-3xl border border-[#C5A059]/30 shadow-sm relative overflow-hidden">
        
        {/* Header do Card com Navegação */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#C5A059]/15">
          <div className="flex items-center gap-1.5">
            <currentSlide.icon className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1918] dark:text-[#FAF8F5]">
              {currentSlide.title}
            </span>
          </div>

          {/* Controles de Próximo / Anterior */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
              className="p-1 rounded-full text-[#78716C] dark:text-[#A8A29E] hover:text-[#1A1918] dark:hover:text-white hover:bg-[#FAF8F5] dark:hover:bg-[#252220] transition-colors cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="p-1 rounded-full text-[#78716C] dark:text-[#A8A29E] hover:text-[#1A1918] dark:hover:text-white hover:bg-[#FAF8F5] dark:hover:bg-[#252220] transition-colors cursor-pointer"
              title="Próximo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Produto em Destaque do Slide */}
        {currentSlide.product && (
          <div
            onClick={() => onOpenProduct(currentSlide.product)}
            className="group cursor-pointer"
          >
            {/* Foto com Badge de Urgência */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F4F2EE] dark:bg-[#252220] mb-3">
              <Image
                src={currentSlide.product.thumbnail}
                alt={currentSlide.product.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <span className={`absolute top-2.5 left-2.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-xs ${currentSlide.tagColor}`}>
                {currentSlide.tag}
              </span>
            </div>

            {/* Informações da Peça */}
            <h4 className="font-serif-luxury text-sm font-medium text-[#1A1918] dark:text-[#FAF8F5] group-hover:text-[#C5A059] transition-colors line-clamp-1 leading-snug">
              {currentSlide.product.name}
            </h4>

            <div className="mt-1 flex items-baseline justify-between">
              <div>
                <span className="text-base font-bold text-[#1A1918] dark:text-[#FAF8F5]">
                  {currentSlide.product.formattedPrice}
                </span>
                {currentSlide.product.formattedOriginalPrice && (
                  <span className="text-[11px] text-[#A8A29E] line-through ml-2">
                    {currentSlide.product.formattedOriginalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#C5A059] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Ver Vídeo <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* Indicadores de Progresso do Carrossel */}
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-[#C5A059]/15">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === idx ? 'w-5 bg-[#C5A059]' : 'w-1.5 bg-[#C5A059]/25 hover:bg-[#C5A059]/50'
              }`}
            />
          ))}
        </div>

      </div>

      {/* 2. CARD DE ATENDIMENTO VIP WHATSAPP (CONVERSÃO MÁXIMA) */}
      <div className="bg-[#FAF8F5] dark:bg-[#1A1918] p-4 rounded-3xl border border-[#C5A059]/30 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#1A1918] flex items-center justify-center text-white border border-[#C5A059]">
              <span className="font-serif-luxury font-bold text-xs text-[#DFBE76]">LB</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] rounded-full ring-2 ring-white dark:ring-[#1A1918]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5]">
              Atendimento Pessoal da Leidy
            </h4>
            <span className="text-[10px] text-[#25D366] font-medium block">
              ● Online agora para tirar dúvidas
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#57534E] dark:text-[#D6D3D1] leading-relaxed">
          Tem dúvida sobre qual tamanho veste melhor ou quer um vídeo detalhado de alguma peça no corpo?
        </p>

        <a
          href={`https://wa.me/${STORE_INFO.whatsapp}?text=Ol%C3%A1%20Leidy!%20Estou%20vendo%20as%20pe%C3%A7as%20no%20cat%C3%A1logo%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span>Falar com a Leidy</span>
        </a>
      </div>

      {/* 3. BENEFÍCIOS & GARANTIAS DA BOUTIQUE */}
      <div className="bg-white dark:bg-[#1A1918] p-4 rounded-3xl border border-[#C5A059]/25 shadow-xs space-y-2.5 text-xs text-[#57534E] dark:text-[#D6D3D1]">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>
            <strong>Frete Cortesia</strong> em compras a partir de R$ 350
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Video className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>
            <strong>Provador em Vídeo</strong> em todos os produtos
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
          <span>
            <strong>Atendimento VIP</strong> e peças selecionadas a dedo
          </span>
        </div>
      </div>

      {/* 4. NOTIFICAÇÃO SUTIL DE PROVA SOCIAL */}
      <div className="p-3 rounded-2xl bg-[#F7F3EB] dark:bg-[#201D1B] border border-[#C5A059]/20 text-[11px] text-[#78716C] dark:text-[#A8A29E] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping shrink-0" />
        <span>
          Mais de <strong>300 clientes atendidas</strong> com caimento perfeito em todo o Brasil.
        </span>
      </div>

    </aside>
  );
};
