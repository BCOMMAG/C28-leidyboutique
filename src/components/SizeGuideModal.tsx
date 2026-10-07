'use client';

import React from 'react';
import { X, Ruler, HelpCircle, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '@/data/products';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#C5A059]/40 p-6 sm:p-8">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#57534E] hover:text-[#1A1918] rounded-full hover:bg-white transition-colors"
          aria-label="Fechar Guia"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título do Guia */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#1A1918]">
              Tabela & Guia de Medidas
            </h3>
            <p className="text-xs text-[#78716C]">
              Encontre o tamanho ideal com caimento impecável para seu biotipo
            </p>
          </div>
        </div>

        {/* Tabela de Medidas */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#C5A059]/30 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EB] text-[#1A1918] uppercase tracking-wider font-semibold border-b border-[#C5A059]/20">
              <tr>
                <th className="py-3 px-4">Tamanho</th>
                <th className="py-3 px-4">Manequim</th>
                <th className="py-3 px-4">Busto (cm)</th>
                <th className="py-3 px-4">Cintura (cm)</th>
                <th className="py-3 px-4">Quadril (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/15 text-[#57534E]">
              <tr className="hover:bg-[#FAF8F5]">
                <td className="py-3 px-4 font-bold text-[#1A1918]">P</td>
                <td className="py-3 px-4">36 - 38</td>
                <td className="py-3 px-4">84 - 88 cm</td>
                <td className="py-3 px-4">66 - 70 cm</td>
                <td className="py-3 px-4">92 - 96 cm</td>
              </tr>
              <tr className="hover:bg-[#FAF8F5]">
                <td className="py-3 px-4 font-bold text-[#1A1918]">M</td>
                <td className="py-3 px-4">40</td>
                <td className="py-3 px-4">90 - 94 cm</td>
                <td className="py-3 px-4">72 - 76 cm</td>
                <td className="py-3 px-4">98 - 102 cm</td>
              </tr>
              <tr className="hover:bg-[#FAF8F5]">
                <td className="py-3 px-4 font-bold text-[#1A1918]">G</td>
                <td className="py-3 px-4">42 - 44</td>
                <td className="py-3 px-4">96 - 102 cm</td>
                <td className="py-3 px-4">78 - 84 cm</td>
                <td className="py-3 px-4">104 - 110 cm</td>
              </tr>
              <tr className="bg-[#FAF8F5] font-semibold text-[#1A1918]">
                <td className="py-3 px-4 text-[#C5A059]">Tamanho Único</td>
                <td className="py-3 px-4">38 ao 44</td>
                <td className="py-3 px-4" colSpan={3}>
                  Modelagem inteligente com elasticidade e caimento adaptável
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dicas de Como Medir */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#57534E]">
          <div className="p-3 bg-white rounded-xl border border-[#C5A059]/20">
            <h5 className="font-bold text-[#1A1918] mb-1">1. Busto</h5>
            <p className="text-[11px] leading-relaxed">Passe a fita métrica sobre a parte mais saliente do busto, mantendo-a na horizontal.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#C5A059]/20">
            <h5 className="font-bold text-[#1A1918] mb-1">2. Cintura</h5>
            <p className="text-[11px] leading-relaxed">Meça a circunferência na parte mais fina da cintura, cerca de 2 dedos acima do umbigo.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#C5A059]/20">
            <h5 className="font-bold text-[#1A1918] mb-1">3. Quadril</h5>
            <p className="text-[11px] leading-relaxed">Contorne a parte mais larga dos quadris, garantindo que a fita não fique apertada.</p>
          </div>
        </div>

        {/* Suporte Direto no WhatsApp */}
        <div className="mt-6 p-4 rounded-2xl bg-[#F7F3EB] border border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <HelpCircle className="w-5 h-5 text-[#C5A059] shrink-0" />
            <p className="text-xs text-[#57534E]">
              Ainda tem dúvidas sobre como a peça vai vestir no seu corpo? Fale com a Leidy!
            </p>
          </div>
          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Ol%C3%A1%20Leidy!%20Fiquei%20com%20d%C3%BAvida%20sobre%20as%20minhas%20medidas%20para%20uma%20pe%C3%A7a.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#1A1918] text-white rounded-full text-xs font-semibold hover:bg-[#25D366] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Consultar Medidas no WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

