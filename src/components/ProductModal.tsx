'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Ruler,
  Truck,
  Heart,
  ShoppingBag,
  MessageCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  LayoutGrid,
  ArrowRight
} from 'lucide-react';
import { Product } from '@/types';
import { PRODUCTS, STORE_INFO } from '@/data/products';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: {
    product: Product;
    size: string;
    color: string;
    quantity: number;
  }) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenSizeGuide: () => void;
  onSelectPairedProduct: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenSizeGuide,
  onSelectPairedProduct
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [cepInput, setCepInput] = useState<string>('');
  const [shippingResult, setShippingResult] = useState<boolean>(false);
  const [shippingLoading, setShippingLoading] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (product) {
      setActiveMediaIndex(0); // O VÍDEO É SEMPRE O PRIMEIRO SLIDE
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
      setIsPlaying(true);
      setIsMuted(true);
      setShippingResult(false);
      setCepInput('');
    }
  }, [product]);

  // Controle de reprodução do vídeo
  useEffect(() => {
    if (videoRef.current && product?.media[activeMediaIndex]?.type === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeMediaIndex, product]);

  if (!isOpen || !product) return null;

  const currentMedia = product.media[activeMediaIndex];
  const pairedProduct = PRODUCTS.find((p) => p.id === product.pairedWithId);

  const goToPrevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : product.media.length - 1));
    setIsPlaying(true);
  };

  const goToNextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMediaIndex((prev) => (prev < product.media.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  // Suporte a deslizar (Swipe) para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      goToNextMedia();
    } else if (diff < -45) {
      goToPrevMedia();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAdd = () => {
    onAddToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleCalculateShipping = () => {
    if (cepInput.trim().length >= 8) {
      setShippingLoading(true);
      setTimeout(() => {
        setShippingLoading(false);
        setShippingResult(true);
      }, 600);
    }
  };

  const generateWhatsAppDirectLink = () => {
    const text = `Olá Leidy! Tenho interesse no *${product.name}*.\n- Cor: *${selectedColor}*\n- Tamanho: *${selectedSize}*\n- Quantidade: *${quantity}*\n- Valor da peça: *${product.formattedPrice}*\n\nPoderia me confirmar a disponibilidade?`;
    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      {/* Container Principal do Modal */}
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] dark:bg-[#1A1918] rounded-3xl shadow-2xl overflow-hidden border border-[#C5A059]/40 my-auto text-[#1A1918] dark:text-[#FAF8F5]">
        
        {/* Botão Superior: Ir para o Catálogo / Ver Mais Produtos */}
        <Link
          href="/catalogo"
          onClick={onClose}
          className="absolute top-3.5 left-3.5 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#252220]/95 text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md border border-[#C5A059]/30 backdrop-blur-xs cursor-pointer group"
          title="Ver mais produtos no catálogo completo"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-colors" />
          <span>Ir para o Catálogo</span>
          <ArrowRight className="w-3 h-3 text-[#C5A059] group-hover:text-white transition-colors hidden sm:inline" />
        </Link>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-[#252220]/90 text-[#1A1918] dark:text-white hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] transition-all shadow-md cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[92vh] overflow-y-auto lg:overflow-visible">
          
          {/* COLUNA ESQUERDA: GALERIA E VÍDEO (Espaço reduzido em 30% no mobile) */}
          <div className="lg:col-span-5 p-3.5 sm:p-6 bg-[#F4EFE6]/60 dark:bg-[#141312]/60 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#C5A059]/20">
            
            {/* Visualizador Principal com Navegação por Setas e Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[290px] sm:max-w-[360px] lg:max-w-none h-[260px] sm:h-[340px] lg:h-[480px] rounded-2xl overflow-hidden bg-black shadow-lg mx-auto select-none touch-pan-y"
            >
              {currentMedia.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={currentMedia.src}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover object-top"
                  />
                  
                  {/* Badge de Provador em Vídeo */}
                  <div className="absolute top-3 left-3 bg-[#1A1918]/85 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm border border-[#C5A059]/40 z-10">
                    <span>Provador da Leidy</span>
                  </div>

                  {/* Controles de Som e Play */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-all cursor-pointer"
                      title={isMuted ? 'Ativar Som' : 'Silenciar'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#DFBE76]" />}
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-all cursor-pointer"
                      title={isPlaying ? 'Pausar' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={currentMedia.src}
                    alt={product.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              )}

              {/* Botão de Navegação: Anterior (<) */}
              {product.media.length > 1 && (
                <button
                  onClick={goToPrevMedia}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/55 text-white hover:bg-black/85 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Botão de Navegação: Próximo (>) */}
              {product.media.length > 1 && (
                <button
                  onClick={goToNextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/55 text-white hover:bg-black/85 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Indicador de Slide (Bolinhas) */}
              {product.media.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
                  {product.media.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        activeMediaIndex === idx ? 'w-4 bg-[#DFBE76]' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Carrossel de Miniaturas */}
            <div className="w-full mt-3 flex items-center justify-center gap-2.5 overflow-x-auto py-1">
              {product.media.map((item, index) => {
                const isSelected = activeMediaIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveMediaIndex(index);
                      if (item.type === 'video') setIsPlaying(true);
                    }}
                    className={`relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/40 scale-105'
                        : 'border-white/80 dark:border-white/20 opacity-70 hover:opacity-100 hover:border-[#C5A059]/50'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-[#1A1918] flex flex-col items-center justify-center text-white p-1">
                        <div className="w-6 h-6 rounded-full bg-[#C5A059] flex items-center justify-center mb-0.5">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                        <span className="text-[8px] uppercase font-bold tracking-tight text-[#DFBE76]">
                          Vídeo
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover object-top"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] text-center mt-1 flex items-center justify-center gap-1.5">
              <span>Deslize para o lado para ver fotos e detalhes da peça.</span>
            </p>

          </div>

          {/* COLUNA DIREITA: INFORMAÇÕES & PEDIDO */}
          <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {/* Header de Categoria e Favorito */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#C5A059] dark:text-[#DFBE76] font-semibold">
                  {product.category}
                </span>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#C5A059] text-white border-[#C5A059]'
                      : 'border-[#C5A059]/30 text-[#1A1918] dark:text-[#FAF8F5] hover:border-[#C5A059]'
                  }`}
                  title="Favoritar"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Título */}
              <h2 className="font-serif-luxury text-xl sm:text-3xl font-medium text-[#1A1918] dark:text-[#FAF8F5] mt-1.5">
                {product.name}
              </h2>

              {/* Preço Limpo */}
              <div className="mt-2.5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#1A1918] dark:text-[#FAF8F5] tracking-tight">
                  {product.formattedPrice}
                </span>
                <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  Peça Exclusiva Sob Consulta
                </span>
              </div>

              {/* Descrição */}
              <p className="mt-3 text-sm text-[#57534E] dark:text-[#D6D3D1] leading-relaxed">
                {product.description}
              </p>

              {/* Seletor de Cores */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1918] dark:text-[#FAF8F5]">
                    Cor Escolhida: <span className="text-[#C5A059] dark:text-[#DFBE76] font-bold">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.colors.map((color, idx) => {
                    const isColorSelected = selectedColor === color.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedColor(color.name);
                          if (color.imageSrc) {
                            const mediaIdx = product.media.findIndex((m) => m.src === color.imageSrc);
                            if (mediaIdx !== -1) setActiveMediaIndex(mediaIdx);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                          isColorSelected
                            ? 'border-[#C5A059] bg-[#C5A059]/10 font-semibold text-[#1A1918] dark:text-white ring-1 ring-[#C5A059]'
                            : 'border-black/15 dark:border-white/20 bg-white dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] hover:border-[#C5A059]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Tamanhos com Guia de Medidas */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1918] dark:text-[#FAF8F5]">
                    Tamanho: <span className="text-[#C5A059] dark:text-[#DFBE76] font-bold">{selectedSize}</span>
                  </span>

                  <button
                    onClick={onOpenSizeGuide}
                    className="text-xs text-[#C5A059] dark:text-[#DFBE76] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Guia de Medidas</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size, idx) => {
                    const isSizeSelected = selectedSize === size;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          isSizeSelected
                            ? 'bg-[#1A1918] dark:bg-[#C5A059] text-white border-[#1A1918] dark:border-[#C5A059] shadow-sm'
                            : 'bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] border-[#C5A059]/30 hover:border-[#C5A059]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Quantidade & Ações Principais */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Contador de Quantidade */}
                  <div className="flex items-center border border-[#C5A059]/40 rounded-full bg-white dark:bg-[#252220] px-3 py-1.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-sm font-bold text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] px-2 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5] px-2 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-sm font-bold text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] px-2 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Botão Adicionar à Sacola */}
                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer ${
                      addedAnimation
                        ? 'bg-[#25D366] text-white'
                        : 'bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] active:scale-95'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Adicionado à Sacola!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Adicionar à Sacola</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Botão Direto de WhatsApp */}
                <a
                  href={generateWhatsAppDirectLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 border border-[#C5A059] bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#FBF7EE] dark:hover:bg-[#2E2A27] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Pedir Esta Peça no WhatsApp da Leidy</span>
                </a>
              </div>

              {/* Simulador de Envio e Frete */}
              <div className="mt-6 pt-4 border-t border-[#C5A059]/20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1918] dark:text-[#FAF8F5] mb-2">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Calcular Prazo de Entrega</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu CEP (Ex: 01310-100)"
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#C5A059]/30 bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    onClick={handleCalculateShipping}
                    disabled={shippingLoading}
                    className="px-4 py-2 bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {shippingLoading ? 'Calculando...' : 'Calcular'}
                  </button>
                </div>

                {shippingResult && (
                  <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#252220] border border-[#C5A059]/30 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>📦 <strong>Sedex Express / Correios</strong> (1 a 3 dias úteis)</span>
                      <span className="font-bold text-[#C5A059]">R$ 18,90</span>
                    </div>
                    <div className="flex justify-between items-center text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>🚚 <strong>PAC Padrão</strong> (4 a 7 dias úteis)</span>
                      <span className="font-bold text-[#C5A059]">R$ 14,50</span>
                    </div>
                    <div className="flex justify-between items-center text-[#1A1918] dark:text-[#FAF8F5] border-t border-dashed pt-1 mt-1 border-[#C5A059]/20">
                      <span><strong>Retirada VIP na Boutique</strong></span>
                      <span className="font-bold text-[#25D366]">Grátis</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detalhes Técnicos e Cuidados */}
              <div className="mt-5 pt-4 border-t border-[#C5A059]/20">
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#1A1918] dark:text-[#FAF8F5] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Destaques & Composição do Tecido</span>
                </h4>
                <ul className="text-xs text-[#57534E] dark:text-[#D6D3D1] space-y-1.5">
                  {product.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upsell / Combine com seu Look */}
              {pairedProduct && (
                <div className="mt-5 pt-4 border-t border-[#C5A059]/20">
                  <span className="text-[11px] uppercase tracking-widest text-[#C5A059] dark:text-[#DFBE76] font-bold block mb-2">
                    Combine com seu look:
                  </span>
                  <div
                    onClick={() => onSelectPairedProduct(pairedProduct)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#252220] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#F4F2EE] shrink-0">
                      <Image
                        src={pairedProduct.thumbnail}
                        alt={pairedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] group-hover:text-[#C5A059] truncate transition-colors">
                        {pairedProduct.name}
                      </h5>
                      <p className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5] mt-0.5">
                        {pairedProduct.formattedPrice}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
