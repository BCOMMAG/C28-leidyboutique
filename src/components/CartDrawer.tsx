'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, MessageCircle, ShieldCheck } from 'lucide-react';
import { CartItem } from '@/types';
import { STORE_INFO, PRODUCTS } from '@/data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onQuickAddItem?: (product: (typeof PRODUCTS)[0]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAddItem
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingGoal = STORE_INFO.freeShippingThreshold;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingGoal) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotal);

  // Sugestão de Upsell (peça que ainda não está no carrinho)
  const upsellProduct = PRODUCTS.find((p) => !items.some((i) => i.productId === p.id));

  const generateWhatsAppOrderLink = () => {
    let message = `Olá Leidy! Gostaria de finalizar meu pedido pelo site da *Leidy Boutique*:\n\n`;
    items.forEach((item, index) => {
      message += `🛍️ *${index + 1}. ${item.name}*\n`;
      message += `   - Cor: ${item.color}\n`;
      message += `   - Tamanho: ${item.size}\n`;
      message += `   - Qtd: ${item.quantity}x (R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')})\n\n`;
    });
    message += `💰 *Subtotal das Peças:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    message += `Poderia me confirmar a disponibilidade e passar as opções de pagamento?`;

    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop com desfoque */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] dark:bg-[#141312] text-[#1A1918] dark:text-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#C5A059]/30">
          
          {/* Header da Sacola */}
          <div className="p-5 border-b border-[#C5A059]/20 flex items-center justify-between bg-white dark:bg-[#1A1918]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1918] dark:text-[#FAF8F5]">
                Sua Sacola ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#57534E] dark:text-[#A8A29E] hover:text-[#1A1918] dark:hover:text-white rounded-none hover:bg-[#FAF8F5] dark:hover:bg-[#252220] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso de Frete Cortesia */}
          <div className="px-5 py-3 bg-[#F4EFE6] dark:bg-[#1E1B19] border-b border-[#C5A059]/15">
            <div className="flex justify-between items-center text-xs mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <span className="text-[#57534E] dark:text-[#D6D3D1]">
                  Faltam <strong className="text-[#1A1918] dark:text-[#FAF8F5]">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</strong> para Frete Cortesia!
                </span>
              ) : (
                <span className="text-[#25D366] font-semibold flex items-center gap-1">
                  Parabéns! Você ganhou Frete Cortesia!
                </span>
              )}
              <span className="text-[11px] font-bold text-[#C5A059] dark:text-[#DFBE76]">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full bg-white dark:bg-[#2A2624] h-2 rounded-none overflow-hidden border border-[#C5A059]/20">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFBE76] transition-all duration-500 rounded-none"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-none bg-white dark:bg-[#1E1B19] border border-[#C5A059]/30 flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-7 h-7 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-lg font-medium text-[#1A1918] dark:text-[#FAF8F5]">
                    Sua sacola está vazia
                  </h4>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 max-w-xs">
                    Escolha as suas peças favoritas no catálogo para ver aqui.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1A1918] dark:bg-[#C5A059] text-white rounded-none text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-all cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 bg-white dark:bg-[#1C1A18] rounded-none border border-[#C5A059]/20 shadow-xs relative"
                  >
                    {/* Imagem do Produto */}
                    <div className="relative w-18 h-24 rounded-none overflow-hidden bg-[#F4F2EE] dark:bg-[#252220] shrink-0 border border-black/5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                      <div>
                        <h4 className="text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-1 space-y-0.5">
                          <p>Cor: <span className="text-[#1A1918] dark:text-[#FAF8F5] font-medium">{item.color}</span></p>
                          <p>Tam: <span className="text-[#1A1918] dark:text-[#FAF8F5] font-medium">{item.size.split(' ')[0]}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Seletor de Quantidade */}
                        <div className="flex items-center border border-[#C5A059]/30 rounded-none bg-[#FAF8F5] dark:bg-[#252220] px-2 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] px-1 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5] px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] px-1 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Preço */}
                        <span className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5]">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Botão Remover */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-3 right-3 text-[#A8A29E] hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Remover peça"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Sugestão de Upsell Rápida na Sacola */}
                {upsellProduct && onQuickAddItem && (
                  <div className="p-3.5 rounded-none bg-[#F7F3EB] dark:bg-[#1E1B19] border border-[#C5A059]/30 mt-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] dark:text-[#DFBE76] font-bold block mb-1.5">
                      Você também pode gostar:
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-none overflow-hidden shrink-0 bg-white dark:bg-[#252220]">
                        <Image
                          src={upsellProduct.thumbnail}
                          alt={upsellProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1A1918] dark:text-[#FAF8F5] truncate">
                          {upsellProduct.name}
                        </p>
                        <p className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5]">
                          {upsellProduct.formattedPrice}
                        </p>
                      </div>
                      <button
                        onClick={() => onQuickAddItem(upsellProduct)}
                        className="px-3 py-1.5 bg-white dark:bg-[#252220] border border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white rounded-none text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Rodapé da Sacola com Total e Finalização WhatsApp */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#C5A059]/20 bg-white dark:bg-[#1A1918] space-y-3">
              {/* Resumo do Pedido */}
              <div className="space-y-1.5 text-xs text-[#57534E] dark:text-[#D6D3D1]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Envio / Entrega:</span>
                  <span className="text-[#C5A059] dark:text-[#DFBE76] font-medium">Combinado no WhatsApp</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1918] dark:text-[#FAF8F5] pt-2 border-t border-dashed border-[#C5A059]/20">
                  <span>Total Previsto:</span>
                  <span className="text-[#C5A059] dark:text-[#DFBE76]">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Banner de Transparência do Processo */}
              <div className="p-3 rounded-none bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059]/30 text-[11px] text-[#57534E] dark:text-[#D6D3D1] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span>
                  <strong>Atendimento VIP:</strong> Suas peças serão reservadas e a Leidy entrará em contato para confirmar detalhes e pagamento.
                </span>
              </div>

              {/* Botão Continuar Comprando */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-none text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 border border-[#C5A059]/40 bg-[#FAF8F5] dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] transition-all duration-300 shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>Continuar Comprando</span>
              </button>

              {/* Botão de Envio para WhatsApp */}
              <a
                href={generateWhatsAppOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-none text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#25D366] dark:hover:bg-[#25D366] transition-all duration-300 shadow-md active:scale-95 group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white transition-colors" />
                <span>Finalizar Pedido pelo WhatsApp</span>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
