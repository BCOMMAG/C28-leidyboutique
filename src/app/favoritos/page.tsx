'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { Footer } from '@/components/Footer';
import { PRODUCTS, STORE_INFO } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { Heart, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';

export default function FavoritosPage() {
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

  const favoriteProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const generateWhatsAppWishlistLink = () => {
    let msg = `Olá Leidy! Separei as minhas peças favoritas no site da *Leidy Boutique* e gostaria de consultar a disponibilidade:\n\n`;
    favoriteProducts.forEach((p, idx) => {
      msg += `❤️ *${idx + 1}. ${p.name}* (${p.formattedPrice})\n`;
    });
    msg += `\nPoderia me passar os detalhes de pronta entrega?`;
    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Header com estilo de subpágina */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={openCart}
        onOpenWishlist={() => {}}
        onSelectCategory={() => {}}
        activeCategory="Favoritos"
        isSubpage={true}
      />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navegação / Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#57534E] hover:text-[#C5A059] font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Página Inicial</span>
            </Link>

            <Link
              href="/catalogo"
              className="text-xs uppercase tracking-wider text-[#C5A059] hover:underline font-semibold"
            >
              Ver Todo o Catálogo →
            </Link>
          </div>

          {/* Cabeçalho da Página de Favoritos */}
          <div className="border-b border-[#C5A059]/20 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1.5">
                Sua Seleção Pessoal
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1A1918] font-medium">
                Peças Favoritas
              </h1>
            </div>

            {favoriteProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#78716C] bg-white px-3 py-1.5 rounded-full border border-[#C5A059]/30 font-medium">
                  {favoriteProducts.length} {favoriteProducts.length === 1 ? 'peça salva' : 'peças salvas'}
                </span>

                <a
                  href={generateWhatsAppWishlistLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1A1918] text-white hover:bg-[#25D366] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] hover:text-white" />
                  <span className="hidden sm:inline">Consultar Lista no WhatsApp</span>
                  <span className="sm:hidden">Consultar Lista</span>
                </a>
              </div>
            )}
          </div>

          {/* Estado Vazio ou Grid de Favoritos */}
          {favoriteProducts.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto space-y-5">
              <div className="w-20 h-20 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-2xl font-medium text-[#1A1918]">
                  Sua lista de favoritos está vazia
                </h3>
                <p className="text-xs sm:text-sm text-[#78716C] mt-2 leading-relaxed">
                  Toque no ícone de coração em qualquer peça do catálogo para salvar seus modelos preferidos e vê-los reunidos aqui.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1918] text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explorar Coleção Agora</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Grid com 2 produtos por linha no mobile e 4 no desktop */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={`fav-${product.id}`}
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
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
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
