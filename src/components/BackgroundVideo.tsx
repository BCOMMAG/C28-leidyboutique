'use client';

import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none bg-[#121110]"
    >
      {/* Imagem de Fundo Estática, Parada e sem Movimentação */}
      <picture className="w-full h-full">
        <source srcSet="/images/plano-de-fundo.webp" type="image/webp" />
        <img
          src="/images/plano-de-fundo.jpg"
          alt=""
          role="presentation"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Camada de Filtro Atmosférico e Contraste Nobre (Consistente no modo claro e escuro) */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px]" />
    </div>
  );
};
