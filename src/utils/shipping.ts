export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado?: string;
  regiao?: string;
  ibge?: string;
  erro?: boolean | string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  deliveryDays: string;
  iconType: 'sedex' | 'pac' | 'pickup';
}

/**
 * Formata um valor de CEP para a máscara 00000-000
 */
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

/**
 * Consulta a API pública do ViaCEP sem necessidade de autenticação ou banco de dados
 */
export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro === true || data.erro === 'true') {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao consultar ViaCEP:', error);
    return null;
  }
}

/**
 * Calcula prazos e valores de frete realistas baseados na UF de destino
 */
export function calculateShippingOptions(uf: string, subtotal: number = 0): ShippingOption[] {
  const ufUpper = (uf || '').toUpperCase().trim();
  const isFreeShipping = subtotal >= 400; // Frete Cortesia para compras a partir de R$ 400

  // Região Sudeste (Origem Boutique)
  const isSudeste = ['SP', 'RJ', 'MG', 'ES'].includes(ufUpper);
  // Região Sul e Centro-Oeste
  const isSulOuCentro = ['PR', 'SC', 'RS', 'DF', 'GO', 'MT', 'MS'].includes(ufUpper);

  let sedexPrice = 18.90;
  let sedexDays = '1 a 2 dias úteis';

  let pacPrice = 14.50;
  let pacDays = '3 a 5 dias úteis';

  if (isSudeste) {
    sedexPrice = 18.90;
    sedexDays = '1 a 2 dias úteis';
    pacPrice = isFreeShipping ? 0 : 14.50;
    pacDays = '3 a 5 dias úteis';
  } else if (isSulOuCentro) {
    sedexPrice = 27.90;
    sedexDays = '2 a 4 dias úteis';
    pacPrice = isFreeShipping ? 0 : 21.00;
    pacDays = '5 a 7 dias úteis';
  } else {
    // Norte e Nordeste
    sedexPrice = 38.90;
    sedexDays = '3 a 6 dias úteis';
    pacPrice = isFreeShipping ? 0 : 28.50;
    pacDays = '7 a 12 dias úteis';
  }

  const options: ShippingOption[] = [
    {
      id: 'sedex',
      name: 'Sedex Express / Correios',
      description: `${sedexDays} • Envio Prioritário`,
      price: sedexPrice,
      formattedPrice: `R$ ${sedexPrice.toFixed(2).replace('.', ',')}`,
      deliveryDays: sedexDays,
      iconType: 'sedex'
    },
    {
      id: 'pac',
      name: 'PAC Padrão / Correios',
      description: `${pacDays} • Envio Econômico Segurado`,
      price: pacPrice,
      formattedPrice: pacPrice === 0 ? 'Grátis' : `R$ ${pacPrice.toFixed(2).replace('.', ',')}`,
      deliveryDays: pacDays,
      iconType: 'pac'
    },
    {
      id: 'pickup',
      name: 'Retirada VIP na Boutique',
      description: 'Disponível após agendamento • Atendimento VIP',
      price: 0,
      formattedPrice: 'Grátis',
      deliveryDays: 'Pronta Entrega',
      iconType: 'pickup'
    }
  ];

  return options;
}
