'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const BottomCartBar: React.FC = () => {
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
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A1918]/95 backdrop-blur-md border-t border-[#C5A059]/40 shadow-[0_-10px_35px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        
        {/* Lado Esquerdo: Miniaturas dos Itens e Valores Acumulados */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          
          {/* Miniaturas Sobrepostas dos Produtos Adicionados */}
          <div className="hidden sm:flex items-center -space-x-2 shrink-0">
            {cartItems.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="relative w-9 h-9 rounded-none overflow-hidden border-2 border-white dark:border-[#1A1918] shadow-sm bg-[#FAF8F5]"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
            ))}
            {cartItems.length > 3 && (
              <div className="w-9 h-9 rounded-none bg-[#1A1918] dark:bg-[#C5A059] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-[#1A1918] shadow-sm">
                +{cartItems.length - 3}
              </div>
            )}
          </div>

          {/* Ícone de Sacola no Mobile */}
          <div className="sm:hidden relative p-2 rounded-none bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059]/30 text-[#C5A059] shrink-0">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-none bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </div>

          {/* Textos Informativos */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#78716C] dark:text-[#A8A29E] font-medium hidden sm:inline">
                {cartCount} {cartCount === 1 ? 'peça adicionada' : 'peças adicionadas'}
              </span>
              {isFreeShipping && (
                <span className="text-[10px] font-semibold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-none inline-flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Frete Cortesia
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">Total:</span>
              <span className="text-base sm:text-lg font-bold text-[#1A1918] dark:text-[#FAF8F5] tracking-tight">
                {formattedTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Botão de Alta Conversão "Finalizar Compras" */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openCart}
            className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-none bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] dark:hover:text-[#1A1918] transition-all font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Finalizar Compras</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
