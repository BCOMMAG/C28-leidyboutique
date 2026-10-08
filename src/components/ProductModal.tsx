'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const isAlreadyInCatalog = pathname?.includes('/catalogo');

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
  const [isVideoBuffering, setIsVideoBuffering] = useState<boolean>(true);
  const [pairedAddedId, setPairedAddedId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Produtos que combinam para "Compre o Look"
  const matchingProducts = useMemo(() => {
    if (!product) return [];
    const matches: Product[] = [];

    // 1. Sugestão emparelhada direta da peça
    if (product.pairedWithId) {
      const directPair = PRODUCTS.find((p) => p.id === product.pairedWithId && p.id !== product.id);
      if (directPair) matches.push(directPair);
    }

    // 2. Se houver menos de 2 sugestões, complementar com produtos de categorias distintas
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && !matches.some((m) => m.id === p.id)
    );

    const complementary = others.filter((p) => p.category !== product.category);
    const candidates = complementary.length > 0 ? complementary : others;

    for (const cand of candidates) {
      if (matches.length >= 2) break;
      matches.push(cand);
    }

    return matches;
  }, [product]);

  const handleAddPaired = (item: Product) => {
    onAddToCart({
      product: item,
      size: item.sizes[0] || 'Tamanho Único',
      color: item.colors[0]?.name || 'Padrão',
      quantity: 1
    });
    setPairedAddedId(item.id);
    setTimeout(() => setPairedAddedId(null), 1800);
  };

  useEffect(() => {
    if (product) {
      setActiveMediaIndex(0); // O VÍDEO É SEMPRE O PRIMEIRO SLIDE
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
      setIsPlaying(true);
      setIsMuted(true);
      setIsVideoBuffering(true);
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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Container Principal do Modal Centralizado */}
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] dark:bg-[#1A1918] rounded-none shadow-2xl overflow-hidden border border-[#C5A059]/40 text-[#1A1918] dark:text-[#FAF8F5] my-auto">
        
        {/* Botão Fechar Isolado no Topo */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-40 p-2 sm:p-2.5 rounded-none bg-[#1A1918]/85 dark:bg-black/85 text-white hover:bg-[#C5A059] transition-all shadow-xl cursor-pointer border border-[#C5A059]/40"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[92vh] overflow-y-auto lg:overflow-visible">
          
          {/* COLUNA ESQUERDA: GALERIA E VÍDEO (Aparece em destaque no mobile sem cortes) */}
          <div className="lg:col-span-5 p-2.5 sm:p-5 lg:p-6 bg-[#F4EFE6]/60 dark:bg-[#141312]/60 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#C5A059]/20">
            
            {/* Visualizador Principal com Navegação por Setas e Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-[3/4] sm:aspect-auto sm:h-[380px] lg:h-[500px] rounded-none overflow-hidden bg-black shadow-lg mx-auto select-none touch-pan-y"
            >
              {currentMedia.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={currentMedia.src}
                    poster={product.thumbnail}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    onPlaying={() => setIsVideoBuffering(false)}
                    onWaiting={() => setIsVideoBuffering(true)}
                    onCanPlay={() => setIsVideoBuffering(false)}
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Indicador Suave de Carregamento Inicial do Vídeo */}
                  {isVideoBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none transition-opacity duration-300">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/75 text-white text-[11px] border border-[#C5A059]/40 shadow-xl backdrop-blur-xs">
                        <span className="w-2.5 h-2.5 rounded-none border-2 border-[#C5A059] border-t-transparent animate-spin" />
                        <span>Carregando vídeo...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Badge de Provador em Vídeo */}
                  <div className="absolute top-3 left-3 bg-[#1A1918]/85 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-none flex items-center gap-1.5 backdrop-blur-sm border border-[#C5A059]/40 z-10">
                    <span>Provador da Leidy</span>
                  </div>

                  {/* Controles de Som e Play */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-none bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-all cursor-pointer"
                      title={isMuted ? 'Ativar Som' : 'Silenciar'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#DFBE76]" />}
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-none bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-all cursor-pointer"
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-none bg-black/55 text-white hover:bg-black/85 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Botão de Navegação: Próximo (>) */}
              {product.media.length > 1 && (
                <button
                  onClick={goToNextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-none bg-black/55 text-white hover:bg-black/85 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Indicador de Slide */}
              {product.media.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-none">
                  {product.media.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-none transition-all ${
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
                    className={`relative w-14 h-16 sm:w-16 sm:h-20 rounded-none overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/40 scale-105'
                        : 'border-white/80 dark:border-white/20 opacity-70 hover:opacity-100 hover:border-[#C5A059]/50'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-[#1A1918] flex flex-col items-center justify-center text-white p-1">
                        <div className="w-6 h-6 rounded-none bg-[#C5A059] flex items-center justify-center mb-0.5">
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
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto max-h-none lg:max-h-[85vh]">
            <div>
              {/* Header de Categoria e Atalho */}
              <div className="flex items-center justify-between pr-10 sm:pr-12">
                <span className="text-xs uppercase tracking-widest text-[#C5A059] dark:text-[#DFBE76] font-semibold">
                  {product.category}
                </span>

                {!isAlreadyInCatalog && (
                  <Link
                    href="/catalogo"
                    onClick={onClose}
                    className="text-[11px] uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] hover:text-[#C5A059] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Catálogo</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Título */}
              <h2 className="font-serif-luxury text-xl sm:text-3xl font-medium text-[#1A1918] dark:text-[#FAF8F5] mt-1.5">
                {product.name}
              </h2>

              {/* Valor do Produto & Favoritar (Logo abaixo do título) */}
              <div className="mt-3.5 pt-3 pb-3 border-y border-[#C5A059]/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] block mb-0.5 font-medium">
                    Valor da Peça
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1A1918] dark:text-[#FAF8F5] tracking-tight">
                      {product.formattedPrice}
                    </span>
                    {product.formattedOriginalPrice && (
                      <span className="text-sm text-[#A8A29E] line-through font-normal">
                        {product.formattedOriginalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#C5A059] dark:text-[#DFBE76] font-medium block mt-0.5">
                    Peça Exclusiva &bull; Em até 3x sem juros
                  </span>
                </div>

                {/* Botão de Salvar nos Favoritos com Coração integrado ao Preço */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-none border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-sm'
                      : 'border-[#C5A059]/40 bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] hover:border-[#C5A059] hover:bg-[#FAF8F5]'
                  }`}
                  title={isWishlisted ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : 'text-[#C5A059]'}`} />
                  <span className="text-xs">
                    {isWishlisted ? 'Salvo' : 'Favoritar'}
                  </span>
                </button>
              </div>

              {/* Seletor de Cores */}
              <div className="mt-4">
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
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-none border text-xs transition-all cursor-pointer ${
                          isColorSelected
                            ? 'border-[#C5A059] bg-[#C5A059]/10 font-semibold text-[#1A1918] dark:text-white ring-1 ring-[#C5A059]'
                            : 'border-black/15 dark:border-white/20 bg-white dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] hover:border-[#C5A059]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-none border border-black/20 dark:border-white/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Tamanhos com Guia de Medidas */}
              <div className="mt-4">
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
                        className={`px-4 py-2 rounded-none text-xs font-semibold transition-all border cursor-pointer ${
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
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3">
                  {/* Contador de Quantidade */}
                  <div className="flex items-center border border-[#C5A059]/40 rounded-none bg-white dark:bg-[#252220] px-3 py-1.5">
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
                    className={`flex-1 py-3 px-6 rounded-none text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer ${
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
                  className="w-full py-3 px-6 rounded-none text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 border border-[#C5A059] bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#FBF7EE] dark:hover:bg-[#2E2A27] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Pedir Esta Peça no WhatsApp da Leidy</span>
                </a>
              </div>

              {/* Simulador de Envio e Frete */}
              <div className="mt-5 pt-4 border-t border-[#C5A059]/20">
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
                    className="flex-1 px-3.5 py-2 text-xs rounded-none border border-[#C5A059]/30 bg-white dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    onClick={handleCalculateShipping}
                    disabled={shippingLoading}
                    className="px-4 py-2 bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white rounded-none text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {shippingLoading ? 'Calculando...' : 'Calcular'}
                  </button>
                </div>

                {shippingResult && (
                  <div className="mt-3 p-3 rounded-none bg-white dark:bg-[#252220] border border-[#C5A059]/30 space-y-2 text-xs">
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

              {/* Descrição & Destaques de Tecido (Agora posicionado após o Frete) */}
              <div className="mt-5 pt-4 border-t border-[#C5A059]/20 space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#1A1918] dark:text-[#FAF8F5] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Sobre a Peça & Detalhes</span>
                </h4>

                <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] leading-relaxed">
                  {product.description}
                </p>

                {product.details && product.details.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] dark:text-[#A8A29E] block mb-2">
                      Composição & Cuidados:
                    </span>
                    <ul className="text-xs text-[#57534E] dark:text-[#D6D3D1] space-y-1.5">
                      {product.details.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-none bg-[#C5A059] mt-1 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Compre o Look - Peças que combinam com adição rápida ao carrinho */}
              {matchingProducts.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[#C5A059]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A059] dark:text-[#DFBE76] font-bold block">
                        Sugestão de Estilo
                      </span>
                      <h4 className="font-serif-luxury text-base font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                        Compre o Look
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                      Combine e monte seu visual
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {matchingProducts.map((item) => {
                      const isItemAdded = pairedAddedId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2.5 sm:p-3 rounded-none bg-white dark:bg-[#252220] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all group shadow-xs"
                        >
                          <div
                            onClick={() => onSelectPairedProduct(item)}
                            className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-none overflow-hidden bg-[#F4F2EE] shrink-0 cursor-pointer"
                          >
                            <Image
                              src={item.thumbnail}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div
                            onClick={() => onSelectPairedProduct(item)}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <span className="text-[10px] uppercase tracking-wider text-[#C5A059] dark:text-[#DFBE76] font-semibold block truncate">
                              {item.category}
                            </span>
                            <h5 className="text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] group-hover:text-[#C5A059] truncate transition-colors">
                              {item.name}
                            </h5>
                            <p className="text-xs font-bold text-[#1A1918] dark:text-[#FAF8F5] mt-0.5">
                              {item.formattedPrice}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddPaired(item)}
                              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 rounded-none cursor-pointer ${
                                isItemAdded
                                  ? 'bg-[#25D366] text-white'
                                  : 'bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76]'
                              }`}
                              title="Adicionar esta peça combinada à sacola"
                            >
                              {isItemAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Adicionado</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>+ Look</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Opção elegante quando visualizado fora do catálogo: Ver catálogo completo */}
              {!isAlreadyInCatalog && (
                <div className="mt-6 pt-4 border-t border-[#C5A059]/20">
                  <Link
                    href="/catalogo"
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-none bg-[#F4EFE6]/70 dark:bg-[#252220] border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-[#1A1918] transition-all flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-[#1A1918] dark:text-[#FAF8F5] group shadow-xs cursor-pointer"
                  >
                    <span className="font-serif font-bold">Ver outras opções no Catálogo Completo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A059] group-hover:text-current" />
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
