'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { STORE_INFO } from '@/data/products';

export const AboutLeidy: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6] to-[#FAF8F5] border-t border-b border-[#C5A059]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Esquerdo: Imagem e Identidade */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/40 bg-[#FAF8F5]">
              <Image
                src="/products/04-conjunto-alfaiataria-bege/bege.jpg"
                alt="Leidy - Curadoria & Estilo"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] uppercase tracking-widest text-[#DFBE76] font-semibold block mb-1">
                  Fundadora & Curadora
                </span>
                <h3 className="font-serif-luxury text-2xl font-medium">
                  Leidy
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  &quot;Vestir bem não é sobre padrão, é sobre abraçar a sua melhor versão.&quot;
                </p>
              </div>
            </div>

            {/* Selo Flutuante */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 rounded-2xl shadow-xl border border-[#C5A059]/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#C5A059]/30">
                <Heart className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1918]">Atendimento VIP</p>
                <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: A Mensagem da Boutique */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C5A059]/30 text-xs text-[#C5A059] tracking-widest uppercase font-semibold">
              
              <span>O Propósito da Boutique</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1A1918] font-normal leading-tight">
              Uma experiência de compra feita por quem entende as suas escolhas.
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-light">
              Na <strong>Leidy Boutique</strong>, você nunca compra no escuro. Criamos uma proposta onde cada roupa passa por uma curadoria rigorosa de tecidos nobres, acabamento e caimento real.
            </p>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-light">
              Mais do que fotos bonitas, nós vestimos as peças no nosso provador e mostramos em vídeo como elas se comportam na vida real. Seja para compor um look de trabalho poderoso ou um evento inesquecível, a nossa consultoria está a um clique de distância no seu WhatsApp.
            </p>

            {/* 3 Diferenciais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-[#C5A059]/20 shadow-xs">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1918] mb-1">
                  Transparência Total
                </h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Sem pegadinhas ou cobranças ocultas. O valor que você vê é o valor exato da peça.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#C5A059]/20 shadow-xs">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1918] mb-1">
                  🕊️ Toque Humano
                </h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Conversa direta de mulher para mulher para acertar cores, combinações e caimento.
                </p>
              </div>
            </div>

            {/* Chamada para o WhatsApp */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Ol%C3%A1%20Leidy!%20Adorei%20conhecer%20a%20proposta%20da%20sua%20boutique.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1A1918] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Conversar com a Leidy no WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


