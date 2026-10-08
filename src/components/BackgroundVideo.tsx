'use client';

import React, { useRef, useEffect, useState } from 'react';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reprodução suave e otimizada (sem travar a inicialização da thread)
    const startPlayback = () => {
      video
        .play()
        .then(() => setIsReady(true))
        .catch(() => {
          // Fallback para navegadores móveis com restrições rígidas de autoplay:
          // Inicia suavemente no primeiro toque ou rolagem
          const onInteraction = () => {
            video.play().then(() => setIsReady(true)).catch(() => {});
            window.removeEventListener('touchstart', onInteraction);
            window.removeEventListener('scroll', onInteraction);
            window.removeEventListener('click', onInteraction);
          };
          window.addEventListener('touchstart', onInteraction, { passive: true });
          window.addEventListener('scroll', onInteraction, { passive: true });
          window.addEventListener('click', onInteraction, { passive: true });
        });
    };

    startPlayback();

    // Otimização de Performance Extrema:
    // Pausa o vídeo se a aba for minimizada ou estiver em segundo plano (Page Visibility API)
    // Reduz o consumo de CPU e GPU para 0% quando o usuário não estiver na aba!
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none bg-[#121110]"
    >
      {/* Vídeo em Loop Fixo com Aceleração de Hardware GPU */}
      <video
        ref={videoRef}
        src="/video/plano-de-fundo.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsReady(true)}
        className={`w-full h-full object-cover object-center will-change-transform transform-gpu transition-opacity duration-1000 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <source src="/video/plano-de-fundo.mp4" type="video/mp4" />
        <source src="/video/plano%20de%20fundo.mp4" type="video/mp4" />
      </video>

      {/* Camada de Filtro Atmosférico e Contraste Nobre:
          Garante leitura nítida e contraste requintado para textos, cartões e fotos,
          mantendo o mesmo plano de fundo contínuo e sem emendas ao rolar a página! */}
      <div className="absolute inset-0 bg-[#FAF8F5]/80 dark:bg-black/65 backdrop-blur-[0.5px] transition-colors duration-500" />
    </div>
  );
};
