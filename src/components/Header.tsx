'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X, Sun, Moon, Search, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export interface NavItem {
  label: string;
  type: 'status' | 'category' | 'fabric';
  value: string;
  isSpecial?: boolean;
}

// Linha 1 de Peças e Coleções (conforme exemplo enviado pelo cliente)
export const MENU_ROW_1: NavItem[] = [
  { label: 'Lançamento 2026', type: 'status', value: 'Lançamento' },
  { label: 'Primavera Verão 2026', type: 'status', value: 'Mais Vendidos' },
  { label: 'Acessórios', type: 'category', value: 'Acessórios' },
  { label: 'Tricots', type: 'category', value: 'Tricots' },
  { label: 'Linho Nobre', type: 'fabric', value: 'Linho Puro' },
  { label: 'Blusas', type: 'category', value: 'Blusas' },
  { label: 'Calças', type: 'category', value: 'Calças' },
];

// Linha 2 de Peças e Coleções (conforme exemplo enviado pelo cliente)
export const MENU_ROW_2: NavItem[] = [
  { label: 'Alfaiataria', type: 'category', value: 'Alfaiataria' },
  { label: 'Vestidos', type: 'category', value: 'Vestidos' },
  { label: 'Jaquetas E Casacos', type: 'category', value: 'Jaquetas E Casacos' },
  { label: 'Shorts E Saias', type: 'category', value: 'Shorts E Saias' },
  { label: 'Vestidos E Macacões', type: 'category', value: 'Vestidos E Macacões' },
  { label: 'BAZAR', type: 'status', value: 'OUTLET', isSpecial: true },
  { label: 'Últimas Peças', type: 'status', value: 'Últimas Peças', isSpecial: true },
];

export const ALL_MENU_ITEMS: NavItem[] = [...MENU_ROW_1, ...MENU_ROW_2];

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
  activeCategory = 'Todas as Peças',
  isSubpage = false
}) => {
  const router = useRouter();
  const { theme, toggleTheme, searchQuery, setSearchQuery } = useStore();
  const [headerSearchInput, setHeaderSearchInput] = useState(searchQuery || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sincroniza estado de busca se alterado externamente
  useEffect(() => {
    setHeaderSearchInput(searchQuery || '');
  }, [searchQuery]);

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

  // Executa busca textual no catálogo
  const executeHeaderSearch = (textToSearch?: string) => {
    const term = (textToSearch !== undefined ? textToSearch : headerSearchInput).trim();
    if (!term) return;
    setSearchQuery(term);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/catalogo?q=${encodeURIComponent(term)}`);
  };

  // Navegação direta das opções de peças do menu (sem submenus)
  const handleNavClick = (item: NavItem) => {
    setMobileMenuOpen(false);
    setIsSearchOpen(false);

    if (item.type === 'status') {
      router.push(`/catalogo?status=${encodeURIComponent(item.value)}`);
    } else if (item.type === 'category') {
      if (onSelectCategory && typeof window !== 'undefined' && window.location.pathname === '/catalogo') {
        onSelectCategory(item.value);
      } else {
        router.push(`/catalogo?categoria=${encodeURIComponent(item.value)}`);
      }
    } else if (item.type === 'fabric') {
      router.push(`/catalogo?tecido=${encodeURIComponent(item.value)}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#FAF8F5]/98 dark:bg-[#141312]/98 backdrop-blur-md border-b border-[#C5A059]/25 shadow-xs`}
    >
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="relative flex items-center justify-between h-16 sm:h-20 lg:h-[84px] transition-all duration-300">
          
          {/* Botão Menu Mobile (à esquerda no smartphone) */}
          <div className="flex items-center lg:hidden shrink-0 z-20">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Logo Marca Leidy Boutique (À esquerda no desktop, centralizado no mobile) */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none flex items-center shrink-0 z-10">
            <Link
              href="/"
              className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-28 sm:w-36 md:w-40 lg:w-44 h-8 sm:h-10 lg:h-11 shrink-0 overflow-hidden flex items-center">
                <Image
                  src="/images/Logo sem fundo.png"
                  alt="Leidy Boutique"
                  width={2752}
                  height={1536}
                  style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Links de Navegação Desktop em 2 Linhas Elegantes com Opções de Peças (Conforme Print do Cliente) */}
          <nav className="hidden lg:flex flex-col justify-center items-center gap-1.5 px-2 xl:px-6 flex-1 max-w-[1240px]">
            {/* Linha 1 de Peças */}
            <div className="flex items-center justify-center gap-x-4 xl:gap-x-6 2xl:gap-x-7 text-xs xl:text-[13px] 2xl:text-sm font-medium tracking-normal text-[#1A1918] dark:text-[#FAF8F5]">
              {MENU_ROW_1.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="whitespace-nowrap hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer py-0.5"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Linha 2 de Peças */}
            <div className="flex items-center justify-center gap-x-4 xl:gap-x-6 2xl:gap-x-7 text-xs xl:text-[13px] 2xl:text-sm font-medium tracking-normal text-[#1A1918] dark:text-[#FAF8F5]">
              {MENU_ROW_2.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`whitespace-nowrap transition-colors cursor-pointer py-0.5 ${
                    item.isSpecial
                      ? item.label === 'BAZAR'
                        ? 'font-bold text-[#C5A059] dark:text-[#DFBE76] hover:text-[#1A1918] dark:hover:text-white'
                        : 'font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-900'
                      : 'hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Ações da Direita: Busca, Tema, Favoritos e Sacola */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0 z-20">
            
            {/* Busca Expansível Elegante no Desktop (com ícone de lupa igual ao print) */}
            <div className="relative hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-1 bg-white dark:bg-[#201D1B] border border-[#C5A059]/40 px-2 py-1 shadow-md animate-fadeIn">
                  <Search className="w-3.5 h-3.5 text-[#C5A059]" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={headerSearchInput}
                    autoFocus
                    onChange={(e) => setHeaderSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        executeHeaderSearch();
                      }
                      if (e.key === 'Escape') {
                        setIsSearchOpen(false);
                      }
                    }}
                    className="w-32 lg:w-44 px-1.5 py-0.5 text-xs bg-transparent text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none"
                  />
                  {headerSearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeaderSearchInput('');
                        setSearchQuery('');
                      }}
                      className="p-0.5 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white cursor-pointer"
                      title="Limpar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => executeHeaderSearch()}
                    className="p-1 rounded-none bg-[#22C55E] hover:bg-[#16A34A] text-white cursor-pointer transition-transform hover:scale-105"
                    title="Pesquisar no catálogo"
                  >
                    <ArrowRight className="w-3 h-3 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white cursor-pointer"
                    title="Fechar busca"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
                  title="Pesquisar no site"
                  aria-label="Pesquisar"
                >
                  <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Alternador de Modo Escuro / Claro */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#DFBE76] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Favoritos */}
            <Link
              href="/favoritos"
              className="relative p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
              aria-label="Ver coleção de favoritos"
              title="Meus Favoritos"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#C5A059] text-white text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-none flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Sacola de Compras com Contador */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-transform active:scale-95 cursor-pointer"
              aria-label="Abrir sacola de compras"
              title="Sacola de Compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.7]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-none flex items-center justify-center font-bold border-1.5 border-white dark:border-[#141312] animate-scale shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Menu Gaveta Mobile Sem Submenus e Sem Opção "Por Preço" */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#181615] border-b border-[#C5A059]/20 px-5 py-5 space-y-4 animate-fade-in-down shadow-xl text-[#1A1918] dark:text-[#FAF8F5] max-h-[85vh] overflow-y-auto">
          
          {/* Campo de Pesquisa no Mobile */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Pesquisar por modelo, tecido ou peça..."
              value={headerSearchInput}
              onChange={(e) => setHeaderSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeHeaderSearch();
                }
              }}
              className="w-full pl-9 pr-14 py-2.5 text-xs rounded-none border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#201D1B] focus:outline-none focus:border-[#C5A059]"
            />
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              {headerSearchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setHeaderSearchInput('');
                    setSearchQuery('');
                  }}
                  className="text-[#78716C] hover:text-[#1A1918] dark:hover:text-white p-1 cursor-pointer"
                  title="Limpar texto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => executeHeaderSearch()}
                className="p-1 rounded-none bg-[#22C55E] hover:bg-[#16A34A] text-white cursor-pointer flex items-center justify-center shrink-0"
                title="Pesquisar"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Lista Direta de Opções de Peças (Grade Elegante de 2 Colunas, Sem Submenus) */}
          <div className="border-t border-[#C5A059]/15 pt-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block mb-2.5">
              Peças & Coleções
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ALL_MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`text-left text-xs py-2 px-2.5 rounded-none border transition-all cursor-pointer truncate ${
                    item.isSpecial
                      ? item.label === 'BAZAR'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-bold'
                        : 'border-rose-400/40 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold'
                      : 'border-[#C5A059]/20 bg-[#FAF8F5] dark:bg-[#201D1B] text-[#1A1918] dark:text-[#FAF8F5] hover:border-[#C5A059] hover:text-[#C5A059]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Links Rápidos Adicionais */}
          <div className="pt-3 border-t border-[#C5A059]/15 flex flex-col space-y-2 text-xs font-semibold">
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#C5A059] hover:underline"
            >
              Ver Catálogo Completo da Boutique →
            </Link>
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 flex items-center justify-between text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059]"
            >
              <span>Meus Favoritos</span>
              <span className="bg-[#C5A059] text-white px-2 py-0.5 rounded-none font-bold text-[10px]">
                {wishlistCount}
              </span>
            </Link>
          </div>

          {/* Alternador de Tema no Mobile */}
          <div className="pt-3 border-t border-[#C5A059]/20">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between py-2 px-3 rounded-none bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] hover:border-[#C5A059] transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#DFBE76]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#C5A059]" />
                )}
                <span>Modo Visual: {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
              </div>
              <span className="text-[11px] text-[#C5A059] font-medium underline">
                {theme === 'dark' ? 'Mudar para Claro' : 'Mudar para Escuro'}
              </span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
