'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X, Sun, Moon } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

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
  onSelectCategory,
  activeCategory = 'Todos os Modelos',
  isSubpage = false
}) => {
  const router = useRouter();
  const { theme, toggleTheme } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isSubpage) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      setIsScrolled(top > 15);
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
          ? 'bg-white/95 dark:bg-[#141312]/95 backdrop-blur-md border-b border-[#C5A059]/20 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 transition-all duration-300">
          
          {/* Menu Mobile Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059]'
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
                        ? 'text-[#C5A059] dark:text-[#DFBE76] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059] dark:after:bg-[#DFBE76]'
                        : 'text-[#1A1918]/85 dark:text-[#FAF8F5]/85 hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
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

          {/* Logo Marca Leidy Boutique (Reduzida em 20% no desktop) */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <Link
              href="/"
              className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Dimensões reduzidas em 20% no desktop: md:w-40 lg:w-42 md:h-11 */}
              <div className="relative w-32 sm:w-36 md:w-40 lg:w-42 h-9 sm:h-10 md:h-11">
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

          {/* Ações da Direita: Modo Escuro, Wishlist, Sacola */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Toggle Modo Escuro / Claro */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#DFBE76] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Favoritos: Leva para a Página de Favoritos */}
            <Link
              href="/favoritos"
              className={`relative p-2 transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label="Ver coleção de favoritos"
              title="Meus Favoritos"
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
                  ? 'text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label="Abrir sacola de compras"
              title="Sacola de Compras"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.7]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-[#141312] animate-scale shadow-sm">
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
        <div className="lg:hidden bg-white dark:bg-[#181615] border-b border-[#C5A059]/20 px-6 py-5 space-y-4 animate-fade-in-down shadow-xl text-[#1A1918] dark:text-[#FAF8F5]">
          <p className="text-[11px] uppercase tracking-widest text-[#C5A059] font-semibold">
            Categorias da Coleção
          </p>
          <div className="flex flex-col space-y-3">
            {navCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleNavClick(cat.value)}
                className={`text-left text-base transition-colors py-1 cursor-pointer ${
                  activeCategory === cat.value
                    ? 'text-[#C5A059] dark:text-[#DFBE76] font-semibold'
                    : 'text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059]'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-base text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] py-1 flex items-center justify-between"
            >
              <span>Ver Meus Favoritos</span>
              <span className="text-xs bg-[#C5A059] text-white px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[#C5A059]/20 flex items-center justify-between">
            <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">Tema Visual</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C5A059]/40 text-xs font-semibold"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#DFBE76]" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#1A1918]" />
                  <span>Modo Escuro</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
