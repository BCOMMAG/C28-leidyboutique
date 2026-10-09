'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ArrowRight,
  User,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { STORE_INFO } from '@/data/products';

export interface NavItem {
  label: string;
  type: 'status' | 'category' | 'fabric';
  value: string;
  isSpecial?: boolean;
  hasChevron?: boolean;
}

// Linha 1 de Peças e Coleções no Menu Superior Desktop (conforme exemplo enviado pelo cliente)
export const MENU_ROW_1: NavItem[] = [
  { label: 'Lançamento 2026', type: 'status', value: 'Lançamento' },
  { label: 'Primavera Verão 2026', type: 'status', value: 'Mais Vendidos' },
  { label: 'Acessórios', type: 'category', value: 'Acessórios' },
  { label: 'Tricots', type: 'category', value: 'Tricots' },
  { label: 'Linho Nobre', type: 'fabric', value: 'Linho Puro' },
  { label: 'Blusas', type: 'category', value: 'Blusas' },
  { label: 'Calças', type: 'category', value: 'Calças' },
];

// Linha 2 de Peças e Coleções no Menu Superior Desktop (conforme exemplo enviado pelo cliente)
export const MENU_ROW_2: NavItem[] = [
  { label: 'Alfaiataria', type: 'category', value: 'Alfaiataria' },
  { label: 'Vestidos', type: 'category', value: 'Vestidos' },
  { label: 'Jaquetas E Casacos', type: 'category', value: 'Jaquetas E Casacos' },
  { label: 'Shorts E Saias', type: 'category', value: 'Shorts E Saias' },
  { label: 'Vestidos E Macacões', type: 'category', value: 'Vestidos E Macacões' },
  { label: 'BAZAR', type: 'status', value: 'OUTLET', isSpecial: true },
  { label: 'Últimas Peças', type: 'status', value: 'Últimas Peças', isSpecial: true },
];

// Itens da Gaveta Lateral Esquerda (Desktop e Mobile - exatamente no estilo do print de inspiração)
export const SIDE_DRAWER_ITEMS: NavItem[] = [
  { label: 'Lançamento 2026', type: 'status', value: 'Lançamento', hasChevron: true },
  { label: 'Primavera Verão 2026', type: 'status', value: 'Mais Vendidos', hasChevron: true },
  { label: 'Acessórios', type: 'category', value: 'Acessórios', hasChevron: true },
  { label: 'Tricots', type: 'category', value: 'Tricots', hasChevron: true },
  { label: 'Linho Nobre', type: 'fabric', value: 'Linho Puro', hasChevron: true },
  { label: 'Blusas', type: 'category', value: 'Blusas' },
  { label: 'Calças', type: 'category', value: 'Calças' },
  { label: 'Alfaiataria', type: 'category', value: 'Alfaiataria' },
  { label: 'Vestidos', type: 'category', value: 'Vestidos' },
  { label: 'Jaquetas E Casacos', type: 'category', value: 'Jaquetas E Casacos' },
  { label: 'Shorts E Saias', type: 'category', value: 'Shorts E Saias' },
  { label: 'Vestidos E Macacões', type: 'category', value: 'Vestidos E Macacões' },
  { label: 'BAZAR', type: 'status', value: 'OUTLET', isSpecial: true },
  { label: 'Últimas Peças', type: 'status', value: 'Últimas Peças', isSpecial: true },
];

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
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
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

  // Trava scroll do body quando o menu lateral estiver aberto
  useEffect(() => {
    if (sideDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [sideDrawerOpen]);

  // Executa busca textual no catálogo
  const executeHeaderSearch = (textToSearch?: string) => {
    const term = (textToSearch !== undefined ? textToSearch : headerSearchInput).trim();
    if (!term) return;
    setSearchQuery(term);
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
    setSideDrawerOpen(false);
    router.push(`/catalogo?q=${encodeURIComponent(term)}`);
  };

  // Navegação direta das opções de peças do menu (sem submenus)
  const handleNavClick = (item: NavItem) => {
    setSideDrawerOpen(false);
    setMobileSearchOpen(false);
    setDesktopSearchOpen(false);

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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#FAF8F5]/98 dark:bg-[#141312]/98 backdrop-blur-md border-b border-[#C5A059]/25 shadow-xs`}
      >
        <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="relative flex items-center justify-between h-16 sm:h-20 lg:h-[84px] transition-all duration-300">
            
            {/* 1. LADO ESQUERDO: Botão Menu Lateral (Desktop & Mobile) + Logo "LEIDY" Perfeitamente Configurada */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 z-20">
              {/* Botão Menu Lateral Esquerdo (Disponível em Desktop e Mobile conforme solicitado) */}
              <button
                onClick={() => setSideDrawerOpen(true)}
                className="p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-1.5 group"
                title="Abrir menu lateral"
                aria-label="Abrir menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />
                <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider text-[#1A1918] dark:text-[#FAF8F5] group-hover:text-[#C5A059]">
                  Menu
                </span>
              </button>

              {/* Logo Marca Leidy Boutique (Configuração visual perfeita sem cortes) */}
              <Link
                href="/"
                className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 shrink-0"
                title="Leidy Boutique - Início"
              >
                <div className="relative w-32 sm:w-40 md:w-48 lg:w-52 h-10 sm:h-12 lg:h-14 flex items-center shrink-0">
                  <Image
                    src="/images/Logo sem fundo.png"
                    alt="Leidy Boutique"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* 2. CENTRO: Links de Navegação Desktop em 2 Linhas Elegantes com Opções de Peças */}
            <nav className="hidden lg:flex flex-col justify-center items-center gap-1 px-2 xl:px-4 flex-1 min-w-0">
              {/* Linha 1 */}
              <div className="flex items-center justify-center gap-x-3 xl:gap-x-5 2xl:gap-x-6 text-[11px] xl:text-xs 2xl:text-[13px] font-medium tracking-normal text-[#1A1918] dark:text-[#FAF8F5]">
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

              {/* Linha 2 */}
              <div className="flex items-center justify-center gap-x-3 xl:gap-x-5 2xl:gap-x-6 text-[11px] xl:text-xs 2xl:text-[13px] font-medium tracking-normal text-[#1A1918] dark:text-[#FAF8F5]">
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

            {/* 3. LADO DIREITO: Ações do Header */}
            {/* Desktop: Busca Expansível, Tema, Favoritos e Sacola */}
            {/* Mobile: EXCLUSIVAMENTE Pesquisar, Favoritos e Sacola (Modo Noturno trocado por Pesquisar conforme solicitado) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0 z-20">
              
              {/* DESKTOP: Busca Expansível */}
              <div className="relative hidden lg:flex items-center">
                {desktopSearchOpen ? (
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
                          setDesktopSearchOpen(false);
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
                      onClick={() => setDesktopSearchOpen(false)}
                      className="p-1 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white cursor-pointer"
                      title="Fechar busca"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDesktopSearchOpen(true)}
                    className="p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
                    title="Pesquisar no site"
                    aria-label="Pesquisar"
                  >
                    <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {/* DESKTOP: Alternador de Modo Escuro / Claro (Exibido apenas em Desktop; no Mobile fica na gaveta) */}
              <button
                onClick={toggleTheme}
                className="hidden lg:flex p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
                aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#DFBE76] transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform hover:-rotate-12" />
                )}
              </button>

              {/* MOBILE: Botão PESQUISAR (Substitui o modo noturno no mobile conforme solicitado) */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
                title="Pesquisar peças"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favoritos (Exibido em Mobile e Desktop) */}
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

              {/* Sacola de Compras com Contador (Exibido em Mobile e Desktop) */}
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

        {/* 4. BARRA DE PESQUISA NO MOBILE: Campo de texto com botão "Buscar na Loja" e flexa verde */}
        {mobileSearchOpen && (
          <div className="lg:hidden bg-white/98 dark:bg-[#141312]/98 border-t border-b border-[#C5A059]/30 p-3 sm:p-3.5 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="O que você está procurando? (Ex: vestido, tricot...)"
                  value={headerSearchInput}
                  autoFocus
                  onChange={(e) => setHeaderSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeHeaderSearch();
                    }
                  }}
                  className="w-full pl-8.5 pr-8 py-2 text-xs rounded-none border border-[#C5A059]/40 bg-[#FAF8F5] dark:bg-[#201D1B] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-3.5 h-3.5 text-[#C5A059] absolute left-2.5 top-1/2 -translate-y-1/2" />
                {headerSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeaderSearchInput('');
                      setSearchQuery('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white"
                    title="Limpar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Botão "Buscar na Loja" com Flexa Verde conforme solicitado */}
              <button
                type="button"
                onClick={() => executeHeaderSearch()}
                className="py-2 px-3 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-none shadow-sm cursor-pointer transition-transform active:scale-95 shrink-0"
                title="Buscar na Loja"
              >
                <span>Buscar na Loja</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              {/* Fechar Busca Mobile */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-1.5 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white cursor-pointer shrink-0"
                title="Fechar busca"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 5. GAVETA LATERAL ESQUERDA (DESKTOP E MOBILE - 100% FIEL AO PRINT DO CLIENTE) */}
      {sideDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop escuro com desfoque */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setSideDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-[88vw] max-w-sm sm:max-w-md bg-[#FAF8F5] dark:bg-[#181615] text-[#1A1918] dark:text-[#FAF8F5] shadow-2xl flex flex-col border-r border-[#C5A059]/30 h-full animate-slide-in-left">
              
              {/* Topo da Gaveta: Minha Conta & Fechar (Conforme print) */}
              <div className="p-4 sm:p-5 border-b border-[#C5A059]/20 flex items-center justify-between bg-white dark:bg-[#1E1C1A] shrink-0">
                <div className="flex items-center gap-2.5 text-[#7A3E48] dark:text-[#DFBE76]">
                  <User className="w-5 h-5 text-[#C5A059]" />
                  <span className="font-semibold text-sm sm:text-base text-[#1A1918] dark:text-[#FAF8F5]">
                    Minha Conta & Atendimento
                  </span>
                </div>
                <button
                  onClick={() => setSideDrawerOpen(false)}
                  className="p-1 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white transition-colors cursor-pointer"
                  title="Fechar menu"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Lista Vertical de Peças e Coleções (Conforme print com setas chevrons nas primeiras) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-0.5 custom-scrollbar">
                {SIDE_DRAWER_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className="w-full flex items-center justify-between py-2.5 sm:py-3 px-2 text-left hover:bg-black/5 dark:hover:bg-white/5 rounded-none transition-colors group cursor-pointer"
                  >
                    <span
                      className={`text-sm sm:text-base ${
                        item.isSpecial
                          ? item.label === 'BAZAR'
                            ? 'font-bold text-[#C5A059] dark:text-[#DFBE76]'
                            : 'font-semibold text-rose-700 dark:text-rose-400'
                          : 'font-semibold text-[#2D1B20] dark:text-[#FAF8F5] group-hover:text-[#C5A059] dark:group-hover:text-[#DFBE76]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.hasChevron && (
                      <ChevronRight className="w-4 h-4 text-[#78716C] dark:text-[#A8A29E] group-hover:text-[#C5A059] transition-colors" />
                    )}
                  </button>
                ))}
              </div>

              {/* Rodapé da Gaveta: Meus Favoritos, WhatsApp VIP e Modo Escuro */}
              <div className="p-4 sm:p-5 border-t border-[#C5A059]/20 bg-white dark:bg-[#1E1C1A] space-y-2.5 shrink-0">
                <Link
                  href="/favoritos"
                  onClick={() => setSideDrawerOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] py-1"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#C5A059]" />
                    <span>Meus Favoritos</span>
                  </div>
                  <span className="bg-[#C5A059] text-white px-2 py-0.5 rounded-none font-bold text-xs">
                    {wishlistCount}
                  </span>
                </Link>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Olá Leidy! Gostaria de um atendimento personalizado na boutique.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-[#25D366]/10 hover:bg-[#25D366] text-[#1A1918] dark:text-white hover:text-white border border-[#25D366]/30 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white" />
                  <span>Atendimento VIP no WhatsApp</span>
                </a>

                {/* Alternador de Modo Escuro / Claro */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between py-2 px-3 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] hover:border-[#C5A059] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-[#DFBE76]" /> : <Moon className="w-4 h-4 text-[#C5A059]" />}
                    <span>Modo Visual: {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
                  </div>
                  <span className="text-[11px] text-[#C5A059] underline font-medium">
                    {theme === 'dark' ? 'Mudar para Claro' : 'Mudar para Escuro'}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
