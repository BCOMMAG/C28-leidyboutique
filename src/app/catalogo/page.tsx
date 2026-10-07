'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { Footer } from '@/components/Footer';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { Search, SlidersHorizontal, ArrowLeft, RotateCcw } from 'lucide-react';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'Todos os Modelos';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('Todos');
  const [selectedColor, setSelectedColor] = useState('Todas');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

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
    isCartOpen
  } = useStore();

  const allSizes = ['Todos', 'P', 'M', 'G', 'Tamanho Único'];
  const allColors = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Marrom Caramelo', value: 'Marrom Caramelo' },
    { label: 'Branco Off-White', value: 'Branco Off-White' },
    { label: 'Rosa Quartz', value: 'Rosa Quartz' },
    { label: 'Prata Acetinado', value: 'Prata Acetinado' },
    { label: 'Bege Areia Nobre', value: 'Bege Areia Nobre' }
  ];

  // Filtragem e Ordenação
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Busca textual
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Categoria
    if (selectedCategory === 'Mais Vendidos') {
      result = result.filter((p) => p.isBestSeller);
    } else if (selectedCategory === 'OUTLET') {
      result = result.filter((p) => p.isOutlet);
    } else if (selectedCategory !== 'Todos os Modelos') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Tamanho
    if (selectedSize !== 'Todos') {
      result = result.filter((p) =>
        p.sizes.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()))
      );
    }

    // Cor
    if (selectedColor !== 'Todas') {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    // Ordenação
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSize, selectedColor, sortBy]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'Todos os Modelos' ||
    selectedSize !== 'Todos' ||
    selectedColor !== 'Todas' ||
    sortBy !== 'relevance';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos os Modelos');
    setSelectedSize('Todos');
    setSelectedColor('Todas');
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121110] text-[#1A1918] dark:text-[#FAF8F5] transition-colors duration-300">
      {/* Header */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
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
          <div className="border-b border-[#C5A059]/20 pb-8 mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#DFBE76] font-bold block mb-1.5">
              Curadoria Exclusiva
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
              Catálogo de Produtos
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] mt-2">
              Todas as peças com modelagem nobre e provador em vídeo disponível.
            </p>
          </div>

          {/* BARRA DE FILTROS COMPLETA */}
          <div className="bg-white dark:bg-[#1A1918] p-4 sm:p-6 rounded-2xl border border-[#C5A059]/25 shadow-xs mb-8 space-y-4">
            
            {/* Linha 1: Campo de Busca e Ordenação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Campo de Busca */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#78716C] dark:text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar peça por nome ou tecido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#252220] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Ordenar por Preço */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#78716C] dark:text-[#A8A29E] whitespace-nowrap">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#C5A059]/30 bg-[#FAF8F5] dark:bg-[#252220] focus:outline-none focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5]"
                >
                  <option value="relevance">Destaques da Curadoria</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
              </div>
            </div>

            {/* Linha 2: Categorias */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] font-semibold block mb-2">
                Categoria:
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const isOutlet = cat === 'OUTLET';
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1918] dark:bg-[#C5A059] text-[#FAF8F5] shadow-xs'
                          : isOutlet
                          ? 'bg-[#FAF8F5] dark:bg-[#252220] text-[#C5A059] border border-[#C5A059] hover:bg-[#C5A059] hover:text-white'
                          : 'bg-[#FAF8F5] dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] border border-black/10 dark:border-white/10 hover:border-[#C5A059]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Linha 3: Tamanhos & Cores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/5 dark:border-white/5">
              {/* Filtro de Tamanho */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] font-semibold block mb-2">
                  Tamanho:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#1A1918] dark:bg-[#C5A059] text-white border-[#1A1918] dark:border-[#C5A059]'
                          : 'bg-[#FAF8F5] dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] border-black/10 dark:border-white/10 hover:border-[#C5A059]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de Cor */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] font-semibold block mb-2">
                  Cor:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allColors.map((col) => (
                    <button
                      key={col.value}
                      onClick={() => setSelectedColor(col.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedColor === col.value
                          ? 'bg-[#1A1918] dark:bg-[#C5A059] text-white border-[#1A1918] dark:border-[#C5A059]'
                          : 'bg-[#FAF8F5] dark:bg-[#252220] text-[#57534E] dark:text-[#D6D3D1] border-black/10 dark:border-white/10 hover:border-[#C5A059]'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Linha 4: Limpar Filtros */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  Mostrando <strong>{filteredProducts.length}</strong> de {PRODUCTS.length} peças
                </span>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] dark:text-[#DFBE76] hover:underline font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar todos os filtros</span>
                </button>
              </div>
            )}
          </div>

          {/* GRID DE PRODUTOS: 2 por linha no mobile, 4 no desktop */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  isOutletSection={selectedCategory === 'OUTLET' || product.isOutlet}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A1918] rounded-3xl p-12 text-center border border-[#C5A059]/20 space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] dark:bg-[#252220] border border-[#C5A059]/30 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1A1918] dark:text-[#FAF8F5] font-medium">
                Nenhuma peça encontrada com esses filtros
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-md mx-auto">
                Tente ajustar os critérios de busca, tamanho ou cor para visualizar outros modelos da nossa coleção.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#1A1918] dark:bg-[#C5A059] text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-all cursor-pointer"
              >
                Limpar Filtros e Ver Tudo
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />

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
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121110] flex items-center justify-center text-xs text-[#78716C]">Carregando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
