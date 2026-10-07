'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const EditorialBreak: React.FC = () => {
  return (
    <section className="relative w-full my-12 sm:my-16 overflow-hidden border-y border-[#C5A059]/30 bg-[#1A1918] text-[#FAF8F5]">
      {/* Background com imagem em tratamento editorial P&B / Duotone e Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Image
          src="/products/04-conjunto-alfaiataria-bege/bege.jpg"
          alt="Editorial Leidy Boutique"
          fill
          className="object-cover object-center grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1918] via-[#1A1918]/90 to-[#1A1918]" />
      </div>

      {/* Grid de Alfaiataria e Iluminação */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 tailoring-grid-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Lado Esquerdo: Tipografia de Alta Costura */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#C5A059]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#DFBE76] font-semibold">
                Manifesto da Boutique &bull; Temporada Exclusiva
              </span>
            </div>

            <blockquote className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl leading-tight font-normal text-white">
              &ldquo;A verdadeira elegância não consiste em ser notada, mas sim em ser lembrada.&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-2 text-xs text-[#A8A29E]">
              <div>
                <span className="text-white font-serif-luxury text-base block font-medium">Leidy</span>
                <span className="text-[10px] uppercase tracking-wider text-[#DFBE76]">Curadoria & Fundadora</span>
              </div>
              <div className="hidden sm:block w-[1px] h-8 bg-white/15" />
              <p className="max-w-md text-xs leading-relaxed text-[#D6D3D1]">
                Cada tecido nobre e cada caimento são rigorosamente testados no provador real para garantir que sua experiência seja impecável do clique ao espelho.
              </p>
            </div>
          </div>

          {/* Lado Direito: Chamada de Ação Editorial */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <div className="p-6 border border-[#C5A059]/40 bg-white/5 backdrop-blur-xs w-full lg:max-w-xs space-y-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#DFBE76] font-bold">
                Provador Virtual em Vídeo
              </div>
              <p className="text-xs text-[#FAF8F5]/80 leading-relaxed font-light">
                Assista ao movimento e à textura de cada peça antes de tomar sua decisão.
              </p>
              <Link
                href="/catalogo"
                className="w-full py-3 px-4 bg-[#C5A059] hover:bg-[#DFBE76] text-[#1A1918] font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between group cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
