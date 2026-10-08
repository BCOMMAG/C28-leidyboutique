'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X, Sun, Moon, ChevronDown, Tag, Search } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { CATEGORIES_ROUPAS, CATEGORIES_ACESSORIOS, FAIXAS_PRECO } from '@/data/products';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Estados dos dropdowns desktop
  const [activeDropdown, setActiveDropdown] = useState<'roupas' | 'acessorios' | 'precos' | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Estados dos acordions mobile
  const [mobileRoupasOpen, setMobileRoupasOpen] = useState(false);
  const [mobileAcessoriosOpen, setMobileAcessoriosOpen] = useState(false);
  const [mobilePrecosOpen, setMobilePrecosOpen] = useState(false);

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

  const handleMouseEnter = (menu: 'roupas' | 'acessorios' | 'precos') => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleCategoryNavigation = (cat: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (onSelectCategory && window.location.pathname.includes('/catalogo')) {
      onSelectCategory(cat);
    } else {
      router.push(`/catalogo?categoria=${encodeURIComponent(cat)}`);
    }
  };

  const handlePriceNavigation = (min: number, max: number) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    router.push(`/catalogo?precoMin=${min}&precoMax=${max}`);
  };

  const handleStatusNavigation = (statusName: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    router.push(`/catalogo?status=${encodeURIComponent(statusName)}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#141312]/95 backdrop-blur-md border-b border-[#C5A059]/20 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 transition-all duration-300">
          
          {/* Botão Menu Mobile */}
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

          {/* Links de Navegação Desktop com Mega-Menus / Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            
            {/* 1. Roupas (Dropdown de Categorias Femininas) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('roupas')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm tracking-wide transition-all py-2 cursor-pointer font-medium ${
                  isScrolled
                    ? 'text-[#1A1918]/90 dark:text-[#FAF8F5]/90 hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                    : 'text-white/95 hover:text-[#DFBE76] drop-shadow-sm'
                }`}
              >
                <span>Roupas</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'roupas' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'roupas' && (
                <div className="absolute top-full left-0 w-80 bg-white dark:bg-[#1A1918] rounded-none shadow-2xl border border-[#C5A059]/30 p-4 grid grid-cols-2 gap-1.5 animate-fadeIn z-50">
                  <div className="col-span-2 pb-2 mb-1 border-b border-[#C5A059]/15 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                      Categorias de Roupas
                    </span>
                    <button
                      onClick={() => handleCategoryNavigation('Todas as Peças')}
                      className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:text-[#C5A059] underline cursor-pointer"
                    >
                      Ver Tudo
                    </button>
                  </div>
                  {CATEGORIES_ROUPAS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryNavigation(cat)}
                      className="text-left text-xs py-2 px-2.5 rounded-none text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#FAF8F5] dark:hover:bg-[#252220] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer truncate"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Acessórios (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('acessorios')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm tracking-wide transition-all py-2 cursor-pointer font-medium ${
                  isScrolled
                    ? 'text-[#1A1918]/90 dark:text-[#FAF8F5]/90 hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                    : 'text-white/95 hover:text-[#DFBE76] drop-shadow-sm'
                }`}
              >
                <span>Acessórios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'acessorios' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'acessorios' && (
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-[#1A1918] rounded-none shadow-2xl border border-[#C5A059]/30 p-3 flex flex-col gap-1 animate-fadeIn z-50">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold px-2 py-1 border-b border-[#C5A059]/15 mb-1">
                    Acessórios Nobres
                  </span>
                  {CATEGORIES_ACESSORIOS.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleCategoryNavigation(item)}
                      className="text-left text-xs py-2 px-2.5 rounded-none text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#FAF8F5] dark:hover:bg-[#252220] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Por Preço (Dropdown de Faixas de Preço) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('precos')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm tracking-wide transition-all py-2 cursor-pointer font-medium ${
                  isScrolled
                    ? 'text-[#1A1918]/90 dark:text-[#FAF8F5]/90 hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                    : 'text-white/95 hover:text-[#DFBE76] drop-shadow-sm'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Por Preço</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'precos' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'precos' && (
                <div className="absolute top-full left-0 w-52 bg-white dark:bg-[#1A1918] rounded-none shadow-2xl border border-[#C5A059]/30 p-3 flex flex-col gap-1 animate-fadeIn z-50">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold px-2 py-1 border-b border-[#C5A059]/15 mb-1">
                    Faixas de Preço
                  </span>
                  {FAIXAS_PRECO.map((faixa) => (
                    <button
                      key={faixa.label}
                      onClick={() => handlePriceNavigation(faixa.min, faixa.max)}
                      className="text-left text-xs py-2 px-2.5 rounded-none text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#FAF8F5] dark:hover:bg-[#252220] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors cursor-pointer font-medium"
                    >
                      {faixa.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Mais Vendidos */}
            <button
              onClick={() => handleStatusNavigation('Mais Vendidos')}
              className={`text-sm tracking-wide transition-all py-2 cursor-pointer font-medium ${
                isScrolled
                  ? 'text-[#1A1918]/90 dark:text-[#FAF8F5]/90 hover:text-[#C5A059] dark:hover:text-[#DFBE76]'
                  : 'text-white/95 hover:text-[#DFBE76] drop-shadow-sm'
              }`}
            >
              Mais Vendidos
            </button>

            {/* 5. OUTLET */}
            <button
              onClick={() => handleStatusNavigation('OUTLET')}
              className={`text-sm tracking-wide transition-all py-1.5 px-3 rounded-none cursor-pointer font-semibold ${
                isScrolled
                  ? 'bg-[#C5A059]/10 text-[#C5A059] dark:text-[#DFBE76] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-white'
                  : 'bg-black/30 text-[#DFBE76] border border-[#DFBE76]/60 hover:bg-[#DFBE76] hover:text-[#1A1918] drop-shadow-sm'
              }`}
            >
              OUTLET
            </button>

          </nav>

          {/* Logo Marca Leidy Boutique (Reduzida em 20% no desktop) */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <Link
              href="/"
              className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div
                className="relative w-32 sm:w-36 md:w-40 lg:w-42 h-9 sm:h-10 md:h-11 shrink-0 overflow-hidden flex items-center justify-center"
                style={{ width: '168px', height: '42px', maxWidth: '100%' }}
              >
                <Image
                  src="/images/Logo sem fundo.png"
                  alt="Leidy Boutique"
                  width={168}
                  height={42}
                  style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Ações da Direita: Barra de Pesquisa, Modo Escuro, Wishlist, Sacola */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Barra de Pesquisa no Topo (Conforme indicado no print) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (typeof window !== 'undefined' && !window.location.pathname.includes('/catalogo') && e.target.value.trim().length > 0) {
                    router.push(`/catalogo?q=${encodeURIComponent(e.target.value)}`);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className={`w-32 lg:w-44 xl:w-56 pl-8 pr-7 py-1.5 text-xs rounded-none border transition-all duration-300 focus:w-44 lg:focus:w-56 xl:focus:w-64 focus:outline-none ${
                  isScrolled
                    ? 'bg-[#FAF8F5] dark:bg-[#201D1B] text-[#1A1918] dark:text-[#FAF8F5] border-[#C5A059]/30 focus:border-[#C5A059]'
                    : 'bg-black/25 text-white placeholder-white/70 border-white/30 focus:border-white focus:bg-black/40'
                }`}
              />
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${isScrolled ? 'text-[#78716C] dark:text-[#A8A29E]' : 'text-white/80'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer ${isScrolled ? 'text-[#78716C]' : 'text-white/80'}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Botão de Pesquisa no Mobile (Abre barra retrátil no topo) */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className={`p-2 md:hidden transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059]'
                  : 'text-white hover:text-[#DFBE76] drop-shadow-sm'
              }`}
              aria-label="Pesquisar"
              title="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Toggle Modo Escuro / Claro */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-none transition-colors cursor-pointer ${
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

            {/* Favoritos */}
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
                <span className="absolute top-1 right-1 bg-[#C5A059] text-white text-[10px] w-4 h-4 rounded-none flex items-center justify-center font-bold">
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
                  <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[11px] w-5 h-5 rounded-none flex items-center justify-center font-bold border-2 border-white dark:border-[#141312] animate-scale shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Barra de Pesquisa Retrátil no Mobile (Topo da tela) */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white/98 dark:bg-[#141312]/98 border-t border-b border-[#C5A059]/20 px-4 py-2.5 shadow-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar por modelo, tecido ou cor..."
              value={searchQuery}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/catalogo') && e.target.value.trim().length > 0) {
                  router.push(`/catalogo?q=${encodeURIComponent(e.target.value)}`);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
                  setMobileSearchOpen(false);
                }
              }}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-none border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#201D1B] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
            />
            <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              onClick={() => {
                if (searchQuery) setSearchQuery('');
                else setMobileSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1A1918] dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Menu Gaveta Mobile com Acordeões & Pesquisa */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#181615] border-b border-[#C5A059]/20 px-6 py-5 space-y-4 animate-fade-in-down shadow-xl text-[#1A1918] dark:text-[#FAF8F5] max-h-[85vh] overflow-y-auto">
          
          {/* Pesquisa no Mobile */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Pesquisar no catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setMobileMenuOpen(false);
                  router.push(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-none border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#201D1B] focus:outline-none focus:border-[#C5A059]"
            />
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Seção 1: Roupas */}
          <div className="border-b border-[#C5A059]/15 pb-3">
            <button
              onClick={() => setMobileRoupasOpen(!mobileRoupasOpen)}
              className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1A1918] dark:text-[#FAF8F5]"
            >
              <span>Roupas Femininas</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileRoupasOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
            </button>
            {mobileRoupasOpen && (
              <div className="pl-3 pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCategoryNavigation('Todas as Peças')}
                  className="col-span-2 text-left text-xs py-1.5 text-[#C5A059] font-bold"
                >
                  Ver Todas as Roupas →
                </button>
                {CATEGORIES_ROUPAS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryNavigation(cat)}
                    className="text-left text-xs py-1.5 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#C5A059] truncate"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seção 2: Acessórios */}
          <div className="border-b border-[#C5A059]/15 pb-3">
            <button
              onClick={() => setMobileAcessoriosOpen(!mobileAcessoriosOpen)}
              className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1A1918] dark:text-[#FAF8F5]"
            >
              <span>Acessórios</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAcessoriosOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
            </button>
            {mobileAcessoriosOpen && (
              <div className="pl-3 pt-2 flex flex-col gap-2">
                {CATEGORIES_ACESSORIOS.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleCategoryNavigation(item)}
                    className="text-left text-xs py-1.5 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#C5A059]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seção 3: Faixas de Preço */}
          <div className="border-b border-[#C5A059]/15 pb-3">
            <button
              onClick={() => setMobilePrecosOpen(!mobilePrecosOpen)}
              className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1A1918] dark:text-[#FAF8F5]"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#C5A059]" />
                <span>Comprar por Preço</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobilePrecosOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
            </button>
            {mobilePrecosOpen && (
              <div className="pl-3 pt-2 flex flex-col gap-2">
                {FAIXAS_PRECO.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => handlePriceNavigation(f.min, f.max)}
                    className="text-left text-xs py-1.5 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#C5A059] font-medium"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Links Rápidos: Mais Vendidos & OUTLET */}
          <div className="flex flex-col space-y-2 pt-1">
            <button
              onClick={() => handleStatusNavigation('Mais Vendidos')}
              className="text-left text-base text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] py-1 font-semibold"
            >
              Mais Vendidos
            </button>
            <button
              onClick={() => handleStatusNavigation('OUTLET')}
              className="text-left text-base text-[#C5A059] font-bold py-1"
            >
              OUTLET & Promoções
            </button>
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-base text-[#1A1918] dark:text-[#FAF8F5] hover:text-[#C5A059] py-1 flex items-center justify-between"
            >
              <span>Meus Favoritos</span>
              <span className="text-xs bg-[#C5A059] text-white px-2 py-0.5 rounded-none font-bold">
                {wishlistCount}
              </span>
            </Link>
          </div>

          {/* Alternador de Tema no Mobile */}
          <div className="pt-4 border-t border-[#C5A059]/20 flex items-center justify-between">
            <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">Tema Visual</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-[#C5A059]/40 text-xs font-semibold cursor-pointer"
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
