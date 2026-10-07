'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { Footer } from '@/components/Footer';
import { ConversionSidebar } from '@/components/ConversionSidebar';
import {
  PRODUCTS,
  ALL_CATEGORIES,
  CATEGORIES_ROUPAS,
  CATEGORIES_ACESSORIOS,
  FAIXAS_PRECO,
  FILTROS_TECIDO,
  FILTROS_MODELAGEM,
  FILTROS_LINHA,
  FILTROS_STATUS
} from '@/data/products';
import { useStore } from '@/context/StoreContext';
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  RotateCcw,
  X,
  Check
} from 'lucide-react';
import { Product } from '@/types';

function CatalogoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Contexto Global
  const {
    wishlistIds,
    toggleWishlist,
    addToCart,
    cartCount,
    wishlistCount,
    openCart,
    closeCart,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    selectedProduct,
    isProductModalOpen,
    openProduct,
    closeProduct,
    isSizeGuideOpen,
    openSizeGuide,
    closeSizeGuide,
    isCartOpen,
    searchQuery,
    setSearchQuery
  } = useStore();

  // Parâmetros de URL iniciais
  const urlCategory = searchParams.get('categoria') || 'Todas as Peças';
  const urlStatus = searchParams.get('status') || '';
  const urlMinPrice = searchParams.get('precoMin') ? Number(searchParams.get('precoMin')) : null;
  const urlMaxPrice = searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : null;
  const urlSearch = searchParams.get('q') || '';

  // Estados dos Filtros da Barra Lateral Esquerda
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedSize, setSelectedSize] = useState('Todos');
  const [selectedColor, setSelectedColor] = useState('Todas');
  const [selectedFabric, setSelectedFabric] = useState('Todos');
  const [selectedFit, setSelectedFit] = useState('Todos');
  const [selectedLine, setSelectedLine] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState(urlStatus || 'Todos');
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number | null>(
    urlMinPrice !== null || urlMaxPrice !== null
      ? FAIXAS_PRECO.findIndex((f) => f.min === (urlMinPrice ?? 0) && f.max === (urlMaxPrice ?? 99999))
      : null
  );
  const [customMinPrice, setCustomMinPrice] = useState<string>(urlMinPrice !== null ? String(urlMinPrice) : '');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>(urlMaxPrice !== null ? String(urlMaxPrice) : '');

  // Estados da Barra Superior
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'newest'>('relevance');
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4 | 5>(4); // Amostragem de produtos por linha no desktop

  // Controle de Gaveta Mobile de Filtros
  const [mobileFilterDrawerOpen, setMobileFilterDrawerOpen] = useState(false);

  // Sincronizar parâmetros de URL quando mudarem
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);

    const cat = searchParams.get('categoria');
    if (cat) setSelectedCategory(cat);

    const st = searchParams.get('status');
    if (st) setSelectedStatus(st);

    const min = searchParams.get('precoMin');
    const max = searchParams.get('precoMax');
    if (min !== null || max !== null) {
      const minVal = min ? Number(min) : 0;
      const maxVal = max ? Number(max) : 99999;
      const idx = FAIXAS_PRECO.findIndex((f) => f.min === minVal && f.max === maxVal);
      setSelectedPriceRangeIndex(idx !== -1 ? idx : null);
      setCustomMinPrice(min || '');
      setCustomMaxPrice(max || '');
    }
  }, [searchParams, setSearchQuery]);

  const allSizes = ['Todos', 'PP', 'P', 'M', 'G', 'GG', 'Tamanho Único'];
  const allColors = [
    { label: 'Todas', value: 'Todas', hex: '#FAF8F5' },
    { label: 'Marrom Caramelo', value: 'Marrom Caramelo', hex: '#8B5A2B' },
    { label: 'Branco Off-White', value: 'Branco Off-White', hex: '#FAF9F6' },
    { label: 'Rosa Quartz', value: 'Rosa Quartz', hex: '#E8A598' },
    { label: 'Prata Acetinado', value: 'Prata Acetinado', hex: '#D1D5DB' },
    { label: 'Bege Areia Nobre', value: 'Bege Areia Nobre', hex: '#E2D3B8' },
    { label: 'Preto Clássico', value: 'Preto Clássico', hex: '#1A1918' },
    { label: 'Dourado Champagne', value: 'Dourado Champagne', hex: '#DFBE76' }
  ];

  // Cálculo da Filtragem e Ordenação
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Busca textual (sincronizada com o header)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    // 2. Categoria
    if (selectedCategory && selectedCategory !== 'Todas as Peças') {
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (p.subcategory && p.subcategory.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // 3. Status (Novidades, Mais Vendidos, OUTLET, Pronta Entrega)
    if (selectedStatus && selectedStatus !== 'Todos') {
      if (selectedStatus === 'Mais Vendidos') {
        result = result.filter((p) => p.isBestSeller);
      } else if (selectedStatus === 'OUTLET' || selectedStatus === 'Peças em OUTLET') {
        result = result.filter((p) => p.isOutlet);
      } else if (selectedStatus === 'Novidades') {
        result = result.filter((p) => p.isNewArrival);
      } else {
        result = result.filter((p) => p.status?.includes(selectedStatus));
      }
    }

    // 4. Faixa de Preço
    if (selectedPriceRangeIndex !== null && FAIXAS_PRECO[selectedPriceRangeIndex]) {
      const range = FAIXAS_PRECO[selectedPriceRangeIndex];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    } else {
      const min = customMinPrice ? parseFloat(customMinPrice) : null;
      const max = customMaxPrice ? parseFloat(customMaxPrice) : null;
      if (min !== null) result = result.filter((p) => p.price >= min);
      if (max !== null) result = result.filter((p) => p.price <= max);
    }

    // 5. Tamanho
    if (selectedSize !== 'Todos') {
      result = result.filter((p) =>
        p.sizes.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()))
      );
    }

    // 6. Cor
    if (selectedColor !== 'Todas') {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    // 7. Tecido
    if (selectedFabric !== 'Todos') {
      result = result.filter((p) => p.fabric === selectedFabric);
    }

    // 8. Modelagem
    if (selectedFit !== 'Todos') {
      result = result.filter((p) => p.fit === selectedFit);
    }

    // 9. Linha
    if (selectedLine !== 'Todas') {
      result = result.filter((p) => p.line === selectedLine);
    }

    // Ordenação
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedPriceRangeIndex,
    customMinPrice,
    customMaxPrice,
    selectedSize,
    selectedColor,
    selectedFabric,
    selectedFit,
    selectedLine,
    sortBy
  ]);

  // Contagem de filtros ativos
  const activeFiltersCount = [
    searchQuery.trim() !== '',
    selectedCategory !== 'Todas as Peças',
    selectedStatus !== 'Todos' && selectedStatus !== '',
    selectedPriceRangeIndex !== null || customMinPrice !== '' || customMaxPrice !== '',
    selectedSize !== 'Todos',
    selectedColor !== 'Todas',
    selectedFabric !== 'Todos',
    selectedFit !== 'Todos',
    selectedLine !== 'Todas'
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas as Peças');
    setSelectedStatus('Todos');
    setSelectedPriceRangeIndex(null);
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setSelectedSize('Todos');
    setSelectedColor('Todas');
    setSelectedFabric('Todos');
    setSelectedFit('Todos');
    setSelectedLine('Todas');
    setSortBy('relevance');
  };

  // Componente Reutilizável da Barra Lateral de Filtros (Esquerda)
  const FiltersSidebarContent = () => (
    <div className="space-y-6 text-[#1A1918] dark:text-[#FAF8F5]">
      
      {/* 1. Categorias */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Categorias
          </h3>
          {selectedCategory !== 'Todas as Peças' && (
            <button
              onClick={() => setSelectedCategory('Todas as Peças')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="max-h-56 overflow-y-auto pr-1 space-y-1 text-xs">
          <button
            onClick={() => setSelectedCategory('Todas as Peças')}
            className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
              selectedCategory === 'Todas as Peças'
                ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-semibold'
                : 'hover:bg-[#FAF8F5] dark:hover:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1]'
            }`}
          >
            <span>Todas as Peças</span>
            <span className="text-[10px] opacity-70">({PRODUCTS.length})</span>
          </button>
          
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#A8A29E] pt-2 pb-1 px-2">
            Roupas Femininas
          </p>
          {CATEGORIES_ROUPAS.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat || p.subcategory === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-semibold'
                    : 'hover:bg-[#FAF8F5] dark:hover:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1]'
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}

          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#A8A29E] pt-2 pb-1 px-2">
            Acessórios
          </p>
          {CATEGORIES_ACESSORIOS.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat || p.subcategory === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-semibold'
                    : 'hover:bg-[#FAF8F5] dark:hover:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1]'
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Faixa de Preço */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Faixa de Preço
          </h3>
          {(selectedPriceRangeIndex !== null || customMinPrice || customMaxPrice) && (
            <button
              onClick={() => {
                setSelectedPriceRangeIndex(null);
                setCustomMinPrice('');
                setCustomMaxPrice('');
              }}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1 text-xs">
          {FAIXAS_PRECO.map((faixa, idx) => {
            const isSelected = selectedPriceRangeIndex === idx;
            return (
              <button
                key={faixa.label}
                onClick={() => {
                  if (isSelected) {
                    setSelectedPriceRangeIndex(null);
                  } else {
                    setSelectedPriceRangeIndex(idx);
                    setCustomMinPrice('');
                    setCustomMaxPrice('');
                  }
                }}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#1A1918] dark:text-[#FAF8F5] font-semibold'
                    : 'border-transparent text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
                }`}
              >
                <span>{faixa.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
              </button>
            );
          })}
        </div>

        {/* Inputs de Preço Manual */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1">
            <span className="text-[10px] text-[#78716C] block mb-0.5">Mín (R$)</span>
            <input
              type="number"
              placeholder="0"
              value={customMinPrice}
              onChange={(e) => {
                setSelectedPriceRangeIndex(null);
                setCustomMinPrice(e.target.value);
              }}
              className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#252220] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
          <span className="text-xs text-[#78716C] pt-3">-</span>
          <div className="flex-1">
            <span className="text-[10px] text-[#78716C] block mb-0.5">Máx (R$)</span>
            <input
              type="number"
              placeholder="700"
              value={customMaxPrice}
              onChange={(e) => {
                setSelectedPriceRangeIndex(null);
                setCustomMaxPrice(e.target.value);
              }}
              className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#252220] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* 3. Tamanhos */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Tamanho
          </h3>
          {selectedSize !== 'Todos' && (
            <button
              onClick={() => setSelectedSize('Todos')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allSizes.map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                selectedSize === sz
                  ? 'bg-[#1A1918] dark:bg-[#C5A059] text-white border-[#1A1918] dark:border-[#C5A059] shadow-xs'
                  : 'bg-white dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] border-black/10 dark:border-white/10 hover:border-[#C5A059]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Cores */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Cor
          </h3>
          {selectedColor !== 'Todas' && (
            <button
              onClick={() => setSelectedColor('Todas')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1">
          {allColors.map((col) => {
            const isSelected = selectedColor === col.value;
            return (
              <button
                key={col.value}
                onClick={() => setSelectedColor(col.value)}
                className={`w-full text-left py-1 px-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1918]/10 dark:bg-[#C5A059]/20 font-semibold text-[#1A1918] dark:text-white'
                    : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/25 dark:border-white/25 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Tecidos */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Tecido
          </h3>
          {selectedFabric !== 'Todos' && (
            <button
              onClick={() => setSelectedFabric('Todos')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => setSelectedFabric('Todos')}
            className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              selectedFabric === 'Todos'
                ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-medium'
                : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
            }`}
          >
            Todos os Tecidos
          </button>
          {FILTROS_TECIDO.map((tec) => (
            <button
              key={tec}
              onClick={() => setSelectedFabric(tec)}
              className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                selectedFabric === tec
                  ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-medium'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
              }`}
            >
              {tec}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Modelagem */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Modelagem
          </h3>
          {selectedFit !== 'Todos' && (
            <button
              onClick={() => setSelectedFit('Todos')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => setSelectedFit('Todos')}
            className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              selectedFit === 'Todos'
                ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-medium'
                : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
            }`}
          >
            Todas as Modelagens
          </button>
          {FILTROS_MODELAGEM.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedFit(mod)}
              className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                selectedFit === mod
                  ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-medium'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Linha de Estilo */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Linha
          </h3>
          {selectedLine !== 'Todas' && (
            <button
              onClick={() => setSelectedLine('Todas')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => setSelectedLine('Todas')}
            className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              selectedLine === 'Todas'
                ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-medium'
                : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
            }`}
          >
            Todas as Linhas
          </button>
          {FILTROS_LINHA.map((lin) => (
            <button
              key={lin}
              onClick={() => setSelectedLine(lin)}
              className={`w-full text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                selectedLine === lin
                  ? 'bg-[#1A1918] text-white dark:bg-[#C5A059] font-medium'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF8F5] dark:hover:bg-[#252220]'
              }`}
            >
              {lin}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Status */}
      <div className="pt-4 border-t border-[#C5A059]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#C5A059] dark:text-[#DFBE76]">
            Status & Destaque
          </h3>
          {selectedStatus !== 'Todos' && selectedStatus !== '' && (
            <button
              onClick={() => setSelectedStatus('Todos')}
              className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hover:underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTROS_STATUS.map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(isSelected ? 'Todos' : st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1918] dark:bg-[#C5A059] text-white border-[#1A1918] dark:border-[#C5A059]'
                    : 'bg-white dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] border-black/10 dark:border-white/10 hover:border-[#C5A059]'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão de Limpar Tudo */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t border-[#C5A059]/20">
          <button
            onClick={resetAllFilters}
            className="w-full py-2.5 rounded-xl border border-[#C5A059] text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] hover:bg-[#1A1918] hover:text-white dark:hover:bg-[#C5A059] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Todos os Filtros ({activeFiltersCount})</span>
          </button>
        </div>
      )}

    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121110] text-[#1A1918] dark:text-[#FAF8F5] transition-colors duration-300">
      {/* Header Fixo com Barra de Pesquisa */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={openCart}
        onOpenWishlist={() => {}}
        onSelectCategory={setSelectedCategory}
        activeCategory={selectedCategory}
        isSubpage={true}
      />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        {/* CONTAINER EM LARGURA TOTAL PARA PREENCHER MONITORES LARGOS (Conforme solicitado no print) */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          
          {/* Navegação / Breadcrumb */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] hover:text-[#C5A059] font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Página Inicial</span>
            </Link>

            <Link
              href="/favoritos"
              className="text-xs uppercase tracking-wider text-[#C5A059] dark:text-[#DFBE76] hover:underline font-semibold"
            >
              Ver Favoritos ({wishlistCount}) →
            </Link>
          </div>

          {/* Cabeçalho do Catálogo */}
          <div className="border-b border-[#C5A059]/20 pb-4 mb-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#DFBE76] font-bold block mb-1">
              Curadoria & Provador Exclusivo
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="font-serif-luxury text-2xl sm:text-4xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
                {selectedCategory === 'Todas as Peças' ? 'Catálogo Completo' : selectedCategory}
              </h1>
              <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                Mostrando <strong>{filteredProducts.length}</strong> de {PRODUCTS.length} modelos
              </span>
            </div>
          </div>

          {/* LAYOUT PRINCIPAL DE 3 COLUNAS: FILTROS À ESQUERDA + PRODUTOS AO CENTRO + ALTA CONVERSÃO À DIREITA */}
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
            
            {/* ============================================================ */}
            {/* 1. COLUNA ESQUERDA: FILTROS DA BOUTIQUE (Deslocado para a margem) */}
            {/* ============================================================ */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white dark:bg-[#1A1918] p-4 xl:p-5 rounded-3xl border border-[#C5A059]/25 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#C5A059]/20">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-serif-luxury text-base font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                    Filtros da Boutique
                  </span>
                </div>
                {activeFiltersCount > 0 && (
                  <span className="text-[11px] bg-[#C5A059] text-white px-2 py-0.5 rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              <FiltersSidebarContent />
            </aside>

            {/* ============================================================ */}
            {/* 2. COLUNA CENTRAL: BARRA SUPERIOR + GRID DE PRODUTOS         */}
            {/* ============================================================ */}
            <div className="flex-1 min-w-0 space-y-5">
              
              {/* BARRA SUPERIOR DO CATÁLOGO: ORDENAÇÃO, AMOSTRAGEM E FILTRO MOBILE */}
              <div className="bg-white dark:bg-[#1A1918] p-3.5 sm:p-4 rounded-2xl border border-[#C5A059]/25 shadow-xs flex flex-wrap items-center justify-between gap-3">
                
                {/* Botão Mobile para Abrir Gaveta de Filtros */}
                <button
                  onClick={() => setMobileFilterDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059]/40 text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#C5A059] text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Dropdown de Ordenação */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716C] dark:text-[#A8A29E] hidden sm:inline whitespace-nowrap">
                    Ordenar:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#252220] focus:outline-none focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] font-medium cursor-pointer"
                  >
                    <option value="relevance">Destaques da Boutique</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="newest">Mais Recentes</option>
                  </select>
                </div>

                {/* SELETOR DE AMOSTRAGEM / GRADE (Colunas por Linha no Desktop) */}
                <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#C5A059]/20 ml-auto">
                  <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                    Produtos por linha:
                  </span>
                  {[2, 3, 4, 5].map((cols) => {
                    const isActive = gridColumns === cols;
                    return (
                      <button
                        key={cols}
                        onClick={() => setGridColumns(cols as 2 | 3 | 4 | 5)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isActive
                            ? 'bg-[#1A1918] dark:bg-[#C5A059] text-white shadow-xs'
                            : 'bg-[#FAF8F5] dark:bg-[#252220] text-[#57534E] dark:text-[#A8A29E] hover:border-[#C5A059] border border-transparent'
                        }`}
                        title={`Mostrar ${cols} produtos por linha`}
                      >
                        {cols}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* CHIPS DE FILTROS ATIVOS (Remoção Rápida com 'X') */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E] font-medium mr-1">
                    Filtros ativos:
                  </span>

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>Busca: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategory !== 'Todas as Peças' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('Todas as Peças')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedStatus !== 'Todos' && selectedStatus !== '' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>{selectedStatus}</span>
                      <button onClick={() => setSelectedStatus('Todos')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedPriceRangeIndex !== null && FAIXAS_PRECO[selectedPriceRangeIndex] && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>{FAIXAS_PRECO[selectedPriceRangeIndex].label}</span>
                      <button onClick={() => setSelectedPriceRangeIndex(null)} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {(customMinPrice || customMaxPrice) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>R$ {customMinPrice || 0} - R$ {customMaxPrice || 'Max'}</span>
                      <button onClick={() => { setCustomMinPrice(''); setCustomMaxPrice(''); }} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedSize !== 'Todos' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>Tam: {selectedSize}</span>
                      <button onClick={() => setSelectedSize('Todos')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedColor !== 'Todas' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>Cor: {selectedColor}</span>
                      <button onClick={() => setSelectedColor('Todas')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedFabric !== 'Todos' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>Tecido: {selectedFabric}</span>
                      <button onClick={() => setSelectedFabric('Todos')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedFit !== 'Todos' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>Modelagem: {selectedFit}</span>
                      <button onClick={() => setSelectedFit('Todos')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedLine !== 'Todas' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5]">
                      <span>Linha: {selectedLine}</span>
                      <button onClick={() => setSelectedLine('Todas')} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={resetAllFilters}
                    className="text-xs text-[#C5A059] dark:text-[#DFBE76] hover:underline font-semibold ml-auto cursor-pointer"
                  >
                    Limpar tudo
                  </button>
                </div>
              )}

              {/* GRID DE PRODUTOS DINÂMICO CONFORME AMOSTRAGEM ESCOLHIDA */}
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid grid-cols-2 ${
                    gridColumns === 2
                      ? 'lg:grid-cols-2'
                      : gridColumns === 3
                      ? 'lg:grid-cols-3'
                      : gridColumns === 5
                      ? 'lg:grid-cols-5'
                      : 'lg:grid-cols-4'
                  } gap-3 sm:gap-4`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={openProduct}
                      onQuickAdd={(p) => {
                        addToCart({
                          product: p,
                          size: p.sizes[0],
                          color: p.colors[0].name,
                          quantity: 1
                        });
                      }}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                      isOutletSection={product.isOutlet}
                      columnsCount={gridColumns}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1A1918] rounded-3xl p-12 text-center border border-[#C5A059]/20 space-y-4 my-8">
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059]/30 flex items-center justify-center mx-auto text-[#C5A059]">
                    <SlidersHorizontal className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
                    Nenhuma peça encontrada com essa combinação
                  </h3>
                  <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-md mx-auto">
                    Tente ajustar o tamanho, a faixa de preço ou a categoria para visualizar outros modelos da nossa boutique.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 bg-[#1A1918] dark:bg-[#C5A059] text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-all cursor-pointer"
                  >
                    Ver Todas as Peças ({PRODUCTS.length})
                  </button>
                </div>
              )}

            </div>

            {/* ============================================================ */}
            {/* 3. COLUNA DIREITA: ALTA CONVERSÃO & DESTAQUES ROTATIVOS      */}
            {/* ============================================================ */}
            <div className="hidden xl:block w-64 xl:w-72 2xl:w-80 shrink-0">
              <ConversionSidebar onOpenProduct={openProduct} />
            </div>

          </div>

        </div>
      </main>

      <Footer />

      {/* GAVETA / MODAL DE FILTROS PARA DISPOSITIVOS MÓVEIS */}
      {mobileFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setMobileFilterDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-white dark:bg-[#1A1918] shadow-2xl flex flex-col border-r border-[#C5A059]/30">
              <div className="p-4 border-b border-[#C5A059]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-serif-luxury text-base font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                    Filtros da Boutique
                  </span>
                </div>
                <button
                  onClick={() => setMobileFilterDrawerOpen(false)}
                  className="p-1.5 text-[#57534E] dark:text-[#A8A29E] hover:text-[#1A1918] rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <FiltersSidebarContent />
              </div>

              <div className="p-4 border-t border-[#C5A059]/20 bg-[#FAF8F5] dark:bg-[#141312]">
                <button
                  onClick={() => setMobileFilterDrawerOpen(false)}
                  className="w-full py-3 bg-[#1A1918] dark:bg-[#C5A059] text-white rounded-full text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Ver {filteredProducts.length} Peças
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Produto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProduct}
        onAddToCart={addToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        onOpenSizeGuide={openSizeGuide}
        onSelectPairedProduct={openProduct}
      />

      {/* Sacola Lateral */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onQuickAddItem={openProduct}
      />

      {/* Modal Guia de Medidas */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={closeSizeGuide}
      />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121110] flex items-center justify-center text-xs text-[#78716C]">Carregando catálogo da Leidy Boutique...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
