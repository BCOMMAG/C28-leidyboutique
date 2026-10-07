'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, MessageCircle, Menu, X } from 'lucide-react';
import { STORE_INFO } from '@/data/products';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
  isSubpage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSelectCategory,
  activeCategory = 'Todos os Modelos',
  isSubpage = false
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isSubpage) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSubpage]);

  const navCategories = [
    { label: 'Todos os Modelos', value: 'Todos os Modelos' },
    { label: 'Mais Vendidos', value: 'Mais Vendidos' },
    { label: 'Casacos & Tricots', value: 'Casacos & Tricots' },
    { label: 'Conjuntos', value: 'Conjuntos Exclusivos' },
    { label: 'Alfaiataria', value: 'Alfaiataria Nobre' },
    { label: 'Blusas & Tops', value: 'Blusas & Tops' },
    { label: 'OUTLET', value: 'OUTLET', isHighlight: true }
  ];

  const handleNavClick = (catValue: string) => {
    if (isSubpage) {
      if (onSelectCategory && window.location.pathname === '/catalogo') {
        onSelectCategory(catValue);
      } else {
        router.push(`/catalogo?categoria=${encodeURIComponent(catValue)}`);
      }
    } else {
      if (onSelectCategory) {
        onSelectCategory(catValue);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#C5A059]/20 shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 transition-all duration-300">
          
          {/* Menu Mobile Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors ${
                isScrolled
                  ? 'text-[#1A1918] hover:text-[#C5A059]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Links de Navegação Desktop (Esquerda) */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleNavClick(cat.value)}
                  className={`text-sm tracking-wide transition-all relative py-1 cursor-pointer ${
                    isScrolled
                      ? isActive
                        ? 'text-[#C5A059] font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059]'
                        : 'text-[#1A1918]/80 hover:text-[#C5A059]'
                      : isActive
                      ? 'text-[#DFBE76] font-semibold drop-shadow-sm after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#DFBE76]'
                      : 'text-white/90 hover:text-[#DFBE76] drop-shadow-sm font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Logo Limpa e Sem Fundo (Marca Leidy Boutique) */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <Link
              href="/"
              className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-36 sm:w-44 md:w-52 h-10 sm:h-12 md:h-14">
                <Image
                  src="/images/logo-transparente.png"
                  alt="Leidy Boutique"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Ações da Direita (Wishlist, Atendimento, Sacola) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Botão de Contato WhatsApp Direto */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Ol%C3%A1%20Leidy!%20Estou%20vendo%20as%20pe%C3%A7as%20no%20seu%20site%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium px-3.5 py-2 rounded-full border transition-all ${
                isScrolled
                  ? 'text-[#1A1918] hover:text-[#C5A059] border-[#C5A059]/30 hover:border-[#C5A059] bg-[#FAF8F5]'
                  : 'text-white border-white/40 hover:border-white bg-black/20 hover:bg-black/35 backdrop-blur-xs drop-shadow-sm'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Falar com Leidy</span>
            </a>

            {/* Favoritos: Leva para a Nova Página de Favoritos */}
            <Link
              href="/favoritos"
              className={`relative p-2 transition-colors ${
                isScrolled
                  ? 'text-[#1A1918] hover:text-[#C5A059]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label="Ver coleção de favoritos"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C5A059] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Sacola de Compras com Contador */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 transition-transform active:scale-95 cursor-pointer ${
                isScrolled
                  ? 'text-[#1A1918] hover:text-[#C5A059]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label="Abrir sacola de compras"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.7]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-scale shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#C5A059]/20 px-6 py-5 space-y-4 animate-fade-in-down shadow-xl text-[#1A1918]">
          <p className="text-[11px] uppercase tracking-widest text-[#C5A059] font-semibold">
            Categorias da Coleção
          </p>
          <div className="flex flex-col space-y-3">
            {navCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleNavClick(cat.value)}
                className={`text-left text-base transition-colors py-1 ${
                  activeCategory === cat.value
                    ? 'text-[#C5A059] font-medium'
                    : 'text-[#1A1918] hover:text-[#C5A059]'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-base text-[#1A1918] hover:text-[#C5A059] py-1 flex items-center justify-between"
            >
              <span>Ver Meus Favoritos</span>
              <span className="text-xs bg-[#C5A059] text-white px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            </Link>
          </div>
          <div className="pt-4 border-t border-[#C5A059]/20 flex flex-col gap-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Ol%C3%A1%20Leidy!%20Gostaria%20de%20um%20atendimento%20personalizado.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#1A1918] text-white rounded-lg text-xs uppercase tracking-wider font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Falar com a Leidy no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
