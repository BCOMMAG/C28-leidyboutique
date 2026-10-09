'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const BottomCartBar: React.FC = () => {
  const router = useRouter();
  const { cartItems, cartCount, isCartOpen, openCart } = useStore();

  if (cartCount === 0 || isCartOpen) {
    return null;
  }

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formattedTotal = totalAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const isFreeShipping = totalAmount >= 350;

  return (
    <aside
      aria-label="Barra de finalização de compras"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-[#1A1918]/98 backdrop-blur-md border-t border-[#C5A059]/35 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3"
    >
      <div className="w-full max-w-[1920px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 pt-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Lado Esquerdo: Miniatura da Peça e Subtotal (clicar abre a sacola) */}
        <div
          onClick={openCart}
          className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 cursor-pointer group"
          title="Ver sacola de compras"
        >
          
          {/* Miniatura Real da Peça no Carrinho */}
          <div className="relative w-9 h-11 sm:w-11 sm:h-13 shrink-0 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 overflow-hidden shadow-2xs group-hover:border-[#C5A059] transition-colors">
            {cartItems[0]?.image ? (
              <Image
                src={cartItems[0].image}
                alt={cartItems[0].name}
                fill
                className="object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#C5A059]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            )}
            {cartCount > 1 && (
              <span className="absolute bottom-0 right-0 bg-[#1A1918] dark:bg-[#C5A059] text-white text-[9px] font-bold px-1 leading-tight">
                +{cartCount - 1}
              </span>
            )}
          </div>

          {/* Textos Informativos */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-tight mb-0.5">
              <span className="text-[10px] sm:text-xs text-[#78716C] dark:text-[#A8A29E] font-medium truncate block group-hover:text-[#C5A059] transition-colors">
                {cartCount} {cartCount === 1 ? 'peça adicionada' : 'peças na sacola'}
              </span>
              {isFreeShipping && (
                <span className="text-[9px] font-semibold text-[#25D366] bg-[#25D366]/10 px-1.5 py-0.5 rounded-none hidden xs:inline-flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> Frete Grátis
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 leading-tight">
              <span className="text-[10px] sm:text-xs text-[#78716C] dark:text-[#A8A29E]">Total:</span>
              <span className="text-sm sm:text-lg font-bold text-[#1A1918] dark:text-[#FAF8F5] tracking-tight">
                {formattedTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Botão de Finalizar Compras -> Direciona com segurança para /checkout */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => router.push('/checkout')}
            className="px-4 sm:px-7 py-2.5 sm:py-3 rounded-none bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] dark:hover:text-[#1A1918] transition-all font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>Finalizar Compras</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

      </div>
    </aside>
  );
};
