'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Check,
  Truck,
  CreditCard,
  QrCode,
  MessageCircle,
  Copy,
  ChevronRight,
  AlertCircle,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { STORE_INFO } from '@/data/products';
import { fetchAddressByCep, calculateShippingOptions, formatCep, ShippingOption } from '@/utils/shipping';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    savedCep,
    savedAddress,
    setSavedAddressInfo,
    updateCartQuantity,
    removeFromCart
  } = useStore();

  // Dados do Cliente
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Endereço de Entrega
  const [cepInput, setCepInput] = useState(savedCep ? formatCep(savedCep) : '');
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [street, setStreet] = useState(savedAddress?.logradouro || '');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState(savedAddress?.complemento || '');
  const [neighborhood, setNeighborhood] = useState(savedAddress?.bairro || '');
  const [city, setCity] = useState(savedAddress?.localidade || '');
  const [uf, setUf] = useState(savedAddress?.uf || '');

  // Frete e Pagamento
  const [selectedShipping, setSelectedShipping] = useState<string>('sedex');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'whatsapp'>('pix');
  const [orderNotes, setOrderNotes] = useState('');

  // Estados de Validação e Conclusão
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Sincroniza dados salvos de CEP/Endereço
  useEffect(() => {
    if (savedAddress) {
      if (savedAddress.logradouro) setStreet(savedAddress.logradouro);
      if (savedAddress.bairro) setNeighborhood(savedAddress.bairro);
      if (savedAddress.localidade) setCity(savedAddress.localidade);
      if (savedAddress.uf) setUf(savedAddress.uf);
    }
  }, [savedAddress]);

  // Formatação de telefone brasileiro
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Busca CEP via ViaCEP
  const handleSearchCep = async (targetCep?: string) => {
    const clean = (targetCep || cepInput).replace(/\D/g, '');
    if (clean.length !== 8) {
      setCepError('Digite os 8 dígitos do CEP.');
      return;
    }
    setIsCepLoading(true);
    setCepError('');
    try {
      const data = await fetchAddressByCep(clean);
      if (data) {
        setSavedAddressInfo(clean, data);
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setUf(data.uf || '');
      } else {
        setCepError('CEP não encontrado. Preencha o endereço manualmente.');
      }
    } catch {
      setCepError('Erro ao consultar CEP. Tente novamente.');
    } finally {
      setIsCepLoading(false);
    }
  };

  // Cálculos de Valores
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = STORE_INFO.freeShippingThreshold;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  const shippingOptions: ShippingOption[] = uf ? calculateShippingOptions(uf, subtotal) : [];
  const chosenShippingOption = shippingOptions.find((opt) => opt.id === selectedShipping) || shippingOptions[0];

  const shippingPrice = isFreeShipping
    ? 0
    : chosenShippingOption
    ? chosenShippingOption.price
    : 0;

  // Desconto de 5% no PIX
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const totalAmount = Math.max(0, subtotal + shippingPrice - pixDiscount);

  // Chave PIX Oficial da Boutique
  const PIX_KEY = 'contato@leidyboutique.com.br';

  // Validação do Formulário
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.name = 'Por favor, informe seu nome completo.';
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.phone = 'Informe seu WhatsApp com DDD para contato.';
    }
    if (!street.trim()) {
      errors.street = 'Informe o logradouro / rua.';
    }
    if (!number.trim()) {
      errors.number = 'Informe o número da residência.';
    }
    if (!city.trim()) {
      errors.city = 'Informe a cidade.';
    }
    if (!uf.trim()) {
      errors.uf = 'Informe o estado (UF).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Finalizar Compra
  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Gera ID único do Pedido
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `LB-2026-${randomCode}`;
    setOrderId(newOrderId);
    setOrderSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Monta a mensagem completa formatada do pedido
  const buildOrderSummaryText = () => {
    let msg = `✨ *NOVO PEDIDO NO SITE LEIDY BOUTIQUE* ✨\n`;
    msg += `🔖 *Pedido:* #${orderId || 'LB-2026'}\n\n`;
    msg += `👤 *Cliente:* ${customerName}\n`;
    msg += `📱 *WhatsApp:* ${customerPhone}\n`;
    if (customerEmail) msg += `✉️ *E-mail:* ${customerEmail}\n`;
    msg += `\n📍 *Endereço de Entrega:*\n`;
    msg += `${street}, nº ${number}${complement ? ` (${complement})` : ''}\n`;
    msg += `${neighborhood} - ${city}/${uf}\n`;
    msg += `CEP: ${cepInput}\n\n`;

    msg += `🛍️ *Peças Escolhidas:*\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      msg += `   • Cor: ${item.color} | Tam: ${item.size}\n`;
      msg += `   • Quantidade: ${item.quantity}x (R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')})\n`;
    });

    msg += `\n💳 *Forma de Pagamento:* ${
      paymentMethod === 'pix'
        ? 'PIX (com 5% de desconto à vista)'
        : paymentMethod === 'credit_card'
        ? 'Cartão de Crédito (Link Seguro / até 6x)'
        : 'Atendimento VIP / WhatsApp'
    }\n`;

    msg += `🚚 *Envio:* ${isFreeShipping ? 'Frete VIP Grátis' : `${chosenShippingOption?.name || 'Padrão'} (R$ ${shippingPrice.toFixed(2).replace('.', ',')})`}\n`;

    if (pixDiscount > 0) {
      msg += `🏷️ *Desconto PIX (5%):* -R$ ${pixDiscount.toFixed(2).replace('.', ',')}\n`;
    }

    msg += `💰 *VALOR TOTAL:* R$ ${totalAmount.toFixed(2).replace('.', ',')}\n`;
    if (orderNotes) {
      msg += `\n📝 *Observações:* ${orderNotes}\n`;
    }
    msg += `\nOlá Leidy! Acabei de registrar meu pedido no site da boutique e gostaria de confirmar o envio e os dados de pagamento!`;

    return msg;
  };

  // Abre WhatsApp com segurança
  const handleOpenWhatsApp = () => {
    const text = buildOrderSummaryText();
    const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      try {
        window.open(url, '_blank');
      } catch {
        handleCopyOrderText();
      }
    }
  };

  // Copia o resumo completo do pedido
  const handleCopyOrderText = () => {
    const text = buildOrderSummaryText();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 3000);
    }
  };

  // Copia a Chave PIX
  const handleCopyPixKey = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(PIX_KEY);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121110] text-[#1A1918] dark:text-[#FAF8F5] transition-colors duration-300">
      
      {/* 1. Header do Checkout: Limpo, Seguro e com Logo */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1A1918]/95 backdrop-blur-md border-b border-[#C5A059]/30 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/catalogo"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#C5A059] dark:hover:text-[#DFBE76] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar à Boutique</span>
          </Link>

          <Link href="/" className="flex items-center justify-center">
            <div className="relative w-32 sm:w-40 h-10 sm:h-12 flex items-center justify-center">
              <Image
                src="/images/Logo sem fundo.png"
                alt="Leidy Boutique"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#22C55E] font-bold bg-[#22C55E]/10 px-2.5 py-1 rounded-none border border-[#22C55E]/20">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ambiente Seguro</span>
            <span className="sm:hidden">Seguro</span>
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Principal */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Caso a Sacola esteja vazia e nenhum pedido tenha sido enviado */}
        {cartCount === 0 && !orderSubmitted ? (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-white dark:bg-[#1A1918] border border-[#C5A059]/30 shadow-sm p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF8F5] dark:bg-[#201D1B] rounded-none flex items-center justify-center text-[#C5A059]">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold mb-2 text-[#1A1918] dark:text-[#FAF8F5]">
              Sua sacola está vazia
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mb-6 leading-relaxed">
              Você ainda não adicionou nenhuma peça na sua sacola de compras.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] dark:hover:text-[#1A1918] transition-all text-xs uppercase tracking-widest font-semibold rounded-none shadow-md"
            >
              <span>Explorar Catálogo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : orderSubmitted ? (
          
          /* 3. TELA DE SUCESSO: Pedido Registrado com Sucesso */
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#1A1918] border border-[#C5A059]/40 shadow-xl p-6 sm:p-10 animate-fadeIn">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center rounded-none shadow-sm">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#C5A059] dark:text-[#DFBE76] block mb-1">
                Reserva Realizada com Sucesso!
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1918] dark:text-[#FAF8F5] mb-2">
                Obrigada, {customerName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">
                Número do Pedido: <strong className="text-[#1A1918] dark:text-white font-mono">{orderId}</strong>
              </p>
            </div>

            {/* Caixa Informativa de Pagamento */}
            {paymentMethod === 'pix' && (
              <div className="mb-6 p-4 sm:p-5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" /> Chave PIX da Boutique (5% OFF Aplicado)
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={PIX_KEY}
                    className="flex-1 bg-white dark:bg-[#141312] border border-[#C5A059]/30 px-3 py-2 text-xs font-mono text-[#1A1918] dark:text-[#FAF8F5] select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPixKey}
                    className="px-3.5 py-2 bg-[#1A1918] dark:bg-[#C5A059] text-white hover:bg-[#C5A059] transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPix ? 'Copiada!' : 'Copiar Chave'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                  Envie o comprovante do PIX para a consultora Leidy no WhatsApp para liberação imediata do envio.
                </p>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="mb-6 p-4 sm:p-5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/40 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#C5A059]">
                  <CreditCard className="w-4 h-4" /> Cartão de Crédito em até 6x Sem Juros
                </div>
                <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] leading-relaxed">
                  A Leidy enviará o link de pagamento 100% seguro da InfinitePay/Mercado Pago diretamente no seu WhatsApp para parcelamento em até 6x de R$ {(totalAmount / 6).toFixed(2).replace('.', ',')} sem juros.
                </p>
              </div>
            )}

            {/* Botões Principais de Ação */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-[#25D366]" />
                <span>Enviar Pedido para a Leidy no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyOrderText}
                className="w-full py-3 px-6 bg-[#FAF8F5] dark:bg-[#201D1B] hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1918] dark:text-[#FAF8F5] border border-[#C5A059]/40 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#C5A059]" />
                <span>{copiedOrder ? '✓ Resumo do Pedido Copiado!' : 'Copiar Detalhes do Pedido'}</span>
              </button>

              <Link
                href="/catalogo"
                className="w-full py-3 text-center block text-xs text-[#78716C] dark:text-[#A8A29E] hover:text-[#C5A059] font-medium transition-colors"
              >
                Voltar para a Página Inicial da Loja
              </Link>
            </div>

          </div>
        ) : (

          /* 4. FORMULÁRIO DO CHECKOUT: 2 COLUNAS */
          <form onSubmit={handleFinalizeOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUNA ESQUERDA: DADOS, ENDEREÇO E PAGAMENTO (7 colunas) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* ETAPA 1: SEUS DADOS PESSOAIS */}
              <div className="bg-white dark:bg-[#1A1918] p-5 sm:p-7 border border-[#C5A059]/30 shadow-xs">
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#C5A059]/20">
                  <span className="w-6 h-6 rounded-none bg-[#C5A059] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-serif-luxury text-base sm:text-lg font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                    Seus Dados Pessoais
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                      }}
                      placeholder="Ex: Maria Carolina da Silva"
                      className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border ${
                        formErrors.name ? 'border-red-500' : 'border-[#C5A059]/30 focus:border-[#C5A059]'
                      } text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none`}
                    />
                    {formErrors.name && (
                      <span className="text-[11px] text-red-500 mt-1 block">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        WhatsApp com DDD *
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(formatPhone(e.target.value));
                          if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: '' }));
                        }}
                        placeholder="(49) 99999-9999"
                        maxLength={15}
                        className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border ${
                          formErrors.phone ? 'border-red-500' : 'border-[#C5A059]/30 focus:border-[#C5A059]'
                        } text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none`}
                      />
                      {formErrors.phone && (
                        <span className="text-[11px] text-red-500 mt-1 block">{formErrors.phone}</span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        E-mail (Opcional)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ETAPA 2: ENDEREÇO DE ENTREGA COM VIACEP */}
              <div className="bg-white dark:bg-[#1A1918] p-5 sm:p-7 border border-[#C5A059]/30 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C5A059]/20">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-none bg-[#C5A059] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-serif-luxury text-base sm:text-lg font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                      Endereço de Entrega
                    </h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A8A29E]">ViaCEP Oficial</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Campo de CEP com Busca */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                      CEP *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cepInput}
                        onChange={(e) => {
                          const formatted = formatCep(e.target.value);
                          setCepInput(formatted);
                          if (formatted.replace(/\D/g, '').length === 8) {
                            handleSearchCep(formatted);
                          }
                        }}
                        placeholder="00000-000"
                        maxLength={9}
                        className="flex-1 px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSearchCep()}
                        disabled={isCepLoading}
                        className="px-4 py-2.5 bg-[#1A1918] dark:bg-[#C5A059] text-white font-semibold uppercase tracking-wider text-xs hover:bg-[#C5A059] transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        {isCepLoading ? 'Buscando...' : 'Buscar CEP'}
                      </button>
                    </div>
                    {cepError && (
                      <span className="text-[11px] text-red-500 mt-1 block">{cepError}</span>
                    )}
                  </div>

                  {/* Rua e Número */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    <div className="sm:col-span-8">
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        Rua / Avenida *
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Av. Brasil"
                        className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border ${
                          formErrors.street ? 'border-red-500' : 'border-[#C5A059]/30 focus:border-[#C5A059]'
                        } text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none`}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Ex: 1250"
                        className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border ${
                          formErrors.number ? 'border-red-500' : 'border-[#C5A059]/30 focus:border-[#C5A059]'
                        } text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none`}
                      />
                    </div>
                  </div>

                  {/* Complemento e Bairro */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        Complemento (Apto, Bloco...)
                      </label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Ex: Apto 402"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ex: Centro"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    <div className="sm:col-span-9">
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Chapecó"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                        UF *
                      </label>
                      <input
                        type="text"
                        value={uf}
                        onChange={(e) => setUf(e.target.value.toUpperCase())}
                        placeholder="SC"
                        maxLength={2}
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 focus:border-[#C5A059] text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none text-center font-bold"
                      />
                    </div>
                  </div>

                  {/* OPÇÃO DE FRETE */}
                  {uf && (
                    <div className="pt-3 border-t border-[#C5A059]/15">
                      <label className="block font-semibold mb-2 text-[#57534E] dark:text-[#D6D3D1]">
                        Opção de Envio:
                      </label>
                      <div className="space-y-2">
                        {isFreeShipping ? (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                Frete VIP Grátis (Cortesia da Boutique)
                              </span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">R$ 0,00</span>
                          </div>
                        ) : (
                          shippingOptions.map((opt) => (
                            <label
                              key={opt.id}
                              className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                                selectedShipping === opt.id
                                  ? 'border-[#C5A059] bg-[#C5A059]/10 font-bold'
                                  : 'border-black/10 dark:border-white/10 hover:border-[#C5A059]/50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="radio"
                                  name="shipping"
                                  checked={selectedShipping === opt.id}
                                  onChange={() => setSelectedShipping(opt.id)}
                                  className="accent-[#C5A059]"
                                />
                                <div>
                                  <span className="block text-xs text-[#1A1918] dark:text-[#FAF8F5]">{opt.name}</span>
                                  <span className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">{opt.deliveryDays}</span>
                                </div>
                              </div>
                              <span className="text-xs text-[#C5A059] font-bold">{opt.formattedPrice}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* ETAPA 3: FORMA DE PAGAMENTO */}
              <div className="bg-white dark:bg-[#1A1918] p-5 sm:p-7 border border-[#C5A059]/30 shadow-xs">
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#C5A059]/20">
                  <span className="w-6 h-6 rounded-none bg-[#C5A059] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-serif-luxury text-base sm:text-lg font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                    Forma de Pagamento
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* PIX com 5% de desconto */}
                  <label
                    className={`flex items-start justify-between p-3.5 sm:p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-xs'
                        : 'border-black/10 dark:border-white/10 hover:border-[#C5A059]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="accent-[#C5A059] mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#1A1918] dark:text-[#FAF8F5]">
                            PIX (À Vista com 5% de Desconto)
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#22C55E] text-white text-[9px] font-bold uppercase">
                            5% OFF
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 leading-relaxed">
                          Aprovação imediata e envio prioritário da sua encomenda.
                        </p>
                      </div>
                    </div>
                    <QrCode className="w-5 h-5 text-[#C5A059] shrink-0" />
                  </label>

                  {/* Cartão de Crédito */}
                  <label
                    className={`flex items-start justify-between p-3.5 sm:p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-xs'
                        : 'border-black/10 dark:border-white/10 hover:border-[#C5A059]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="accent-[#C5A059] mt-0.5"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#1A1918] dark:text-[#FAF8F5] block">
                          Cartão de Crédito (Até 6x Sem Juros)
                        </span>
                        <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 leading-relaxed">
                          Link de pagamento 100% seguro emitido pela consultora no fechamento.
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#C5A059] shrink-0" />
                  </label>

                  {/* WhatsApp VIP */}
                  <label
                    className={`flex items-start justify-between p-3.5 sm:p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-xs'
                        : 'border-black/10 dark:border-white/10 hover:border-[#C5A059]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={() => setPaymentMethod('whatsapp')}
                        className="accent-[#C5A059] mt-0.5"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#1A1918] dark:text-[#FAF8F5] block">
                          Combinar Pagamento no WhatsApp VIP
                        </span>
                        <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 leading-relaxed">
                          Fale com a Leidy e escolha as condições especiais de atendimento.
                        </p>
                      </div>
                    </div>
                    <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                  </label>
                </div>
              </div>

              {/* Observações Opcionais */}
              <div className="bg-white dark:bg-[#1A1918] p-5 sm:p-7 border border-[#C5A059]/30 shadow-xs">
                <label className="block text-xs font-semibold mb-1 text-[#57534E] dark:text-[#D6D3D1]">
                  Observações para a Leidy (Opcional)
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ex: Embalar para presente, ponto de referência..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/30 text-xs text-[#1A1918] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

            </div>

            {/* COLUNA DIREITA: RESUMO DO PEDIDO E TOTAL (5 colunas) */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              
              <div className="bg-white dark:bg-[#1A1918] p-5 sm:p-7 border border-[#C5A059]/30 shadow-md">
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold pb-3.5 mb-4 border-b border-[#C5A059]/20 flex items-center justify-between">
                  <span>Resumo do Pedido</span>
                  <span className="text-xs text-[#C5A059] font-sans font-semibold">
                    {cartCount} {cartCount === 1 ? 'peça' : 'peças'}
                  </span>
                </h3>

                {/* Lista de Peças */}
                <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar mb-5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-[#C5A059]/10 last:border-0">
                      <div className="relative w-14 h-18 bg-[#FAF8F5] dark:bg-[#201D1B] border border-[#C5A059]/25 shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#C5A059]">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#1A1918] dark:text-[#FAF8F5] truncate">
                          {item.name}
                        </h4>
                        <div className="text-[10px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 space-y-0.5">
                          <div>Cor: <strong>{item.color}</strong> • Tam: <strong>{item.size}</strong></div>
                          <div>Qtd: <strong>{item.quantity}x</strong></div>
                        </div>
                        <div className="text-xs font-bold text-[#C5A059] mt-1">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discriminativo de Valores */}
                <div className="space-y-2 text-xs pt-3 border-t border-[#C5A059]/20 text-[#57534E] dark:text-[#D6D3D1]">
                  <div className="flex justify-between items-center">
                    <span>Subtotal das Peças:</span>
                    <span className="font-semibold text-[#1A1918] dark:text-[#FAF8F5]">
                      R$ {subtotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Frete / Envio:</span>
                    <span className="font-semibold text-[#C5A059]">
                      {isFreeShipping ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Grátis (VIP)</span>
                      ) : shippingPrice > 0 ? (
                        `R$ ${shippingPrice.toFixed(2).replace('.', ',')}`
                      ) : (
                        'A calcular'
                      )}
                    </span>
                  </div>

                  {pixDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Desconto Especial PIX (5%):</span>
                      <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-base sm:text-lg font-bold text-[#1A1918] dark:text-[#FAF8F5] pt-3 border-t border-dashed border-[#C5A059]/30">
                    <span>Total Final:</span>
                    <span className="text-[#C5A059] dark:text-[#DFBE76]">
                      R$ {totalAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Botão de Finalização */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#1A1918] dark:bg-[#C5A059] hover:bg-[#C5A059] dark:hover:bg-[#DFBE76] dark:hover:text-[#1A1918] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>FINALIZAR COMPRA</span>
                  </button>
                  <p className="text-[10px] text-center text-[#78716C] dark:text-[#A8A29E] mt-2.5">
                    Ambiente seguro e protegido com criptografia de ponta a ponta.
                  </p>
                </div>

                {/* Selos de Confiança */}
                <div className="mt-6 pt-4 border-t border-[#C5A059]/15 grid grid-cols-2 gap-2 text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Peças 100% Originais</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Envio para todo o Brasil</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </main>

    </div>
  );
}
