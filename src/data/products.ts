import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: '01-casaco-tricot',
    name: 'Casaco em Tricot Biamar Exclusivo',
    price: 289.90,
    formattedPrice: 'R$ 289,90',
    originalPrice: 349.90,
    formattedOriginalPrice: 'R$ 349,90',
    discountBadge: 'OUTLET 17% OFF',
    category: 'Casacos & Tricots',
    badge: 'Mais Vendido',
    isBestSeller: true,
    isOutlet: true,
    description: 'Casaco confeccionado em tricot premium Biamar, com textura canelada encorpada e toque aveludado irresistível. Modelagem ampla com caimento elegante para compor sobreposições refinadas em dias de meia-estação e inverno.',
    details: [
      'Fio nobre Biamar de alta durabilidade e conforto térmico',
      'Acabamento canelado com caimento fluído',
      'Pala alongada e modelagem sofisticada',
      'Composição: 70% Acrílico nobre, 30% Poliamida',
      'Cuidados: Lavagem manual ou ciclo delicado para preservar a fibra'
    ],
    sizes: ['Tamanho Único (veste 38 ao 44)'],
    colors: [
      { name: 'Marrom Caramelo', hex: '#8B5A2B', imageSrc: '/products/01-casaco-tricot/marrom.jpg' },
      { name: 'Branco Off-White', hex: '#FAF9F6', imageSrc: '/products/01-casaco-tricot/branco.jpg' }
    ],
    media: [
      {
        type: 'video',
        src: '/products/01-casaco-tricot/video.mp4',
        label: 'Vídeo no Provador (Leidy)'
      },
      {
        type: 'image',
        src: '/products/01-casaco-tricot/marrom.jpg',
        label: 'Marrom Caramelo'
      },
      {
        type: 'image',
        src: '/products/01-casaco-tricot/branco.jpg',
        label: 'Branco Off-White'
      }
    ],
    thumbnail: '/products/01-casaco-tricot/marrom.jpg',
    rating: 5.0,
    reviewCount: 18,
    pairedWithId: '04-conjunto-alfaiataria-bege'
  },
  {
    id: '02-blusa-tricot-rosa',
    name: 'Blusa em Tricot Especial Outubro Rosa',
    price: 189.90,
    formattedPrice: 'R$ 189,90',
    originalPrice: 249.90,
    formattedOriginalPrice: 'R$ 249,90',
    discountBadge: 'OUTLET 24% OFF',
    isOutlet: true,
    isBestSeller: true,
    category: 'Blusas & Tops',
    badge: 'Edição Especial',
    description: 'Blusa em tricot canelado com ponto refinado e decote suave. Peça curinga que combina a delicadeza dos tons rosados com a sofisticação de uma malharia estruturada e confortável para qualquer momento do dia.',
    details: [
      'Trama trabalhada com toque suave na pele',
      'Elasticidade inteligente que valoriza a silhueta sem apertar',
      'Manga de acabamento impecável com punho ajustado',
      'Composição: 80% Fio Especial, 20% Elastano de reforço',
      'Peça versátil para combinar com alfaiataria ou jeans premium'
    ],
    sizes: ['Tamanho Único (veste 36 ao 42)'],
    colors: [
      { name: 'Rosa Quartz', hex: '#E8A598', imageSrc: '/products/02-blusa-tricot-rosa/rosa.jpg' }
    ],
    media: [
      {
        type: 'video',
        src: '/products/02-blusa-tricot-rosa/video.mp4',
        label: 'Vídeo no Provador (Leidy)'
      },
      {
        type: 'image',
        src: '/products/02-blusa-tricot-rosa/rosa.jpg',
        label: 'Rosa Quartz'
      }
    ],
    thumbnail: '/products/02-blusa-tricot-rosa/rosa.jpg',
    rating: 4.9,
    reviewCount: 14,
    pairedWithId: '03-conjunto-cetim'
  },
  {
    id: '03-conjunto-cetim',
    name: 'Conjunto em Cetim Seda Chic',
    price: 349.90,
    formattedPrice: 'R$ 349,90',
    originalPrice: 429.90,
    formattedOriginalPrice: 'R$ 429,90',
    discountBadge: 'OUTLET 18% OFF',
    isOutlet: true,
    isBestSeller: true,
    category: 'Conjuntos Exclusivos',
    badge: 'Look Casual Chic',
    description: 'Conjunto em cetim toque de seda com brilho suave e movimento natural. O match perfeito entre conforto descomplicado e o requinte de uma produção sofisticada para ocasiões especiais, jantares e passeios com estilo.',
    details: [
      'Cetim acetinado com toque acetinado premium antiestático',
      'Calça de corte reto com caimento fluido e cós confortável',
      'Camisa leve de botões forrados e manga estruturada',
      'Composição: 97% Cetim Seda Toque Suave, 3% Elastano',
      'Não amassa facilmente e traz frescor imediato'
    ],
    sizes: ['P (veste 38)', 'M (veste 40)', 'G (veste 42/44)'],
    colors: [
      { name: 'Prata Acetinado', hex: '#D1D5DB', imageSrc: '/products/03-conjunto-cetim/prata.jpg' }
    ],
    media: [
      {
        type: 'video',
        src: '/products/03-conjunto-cetim/video.mp4',
        label: 'Vídeo no Provador (Leidy)'
      },
      {
        type: 'image',
        src: '/products/03-conjunto-cetim/prata.jpg',
        label: 'Prata Acetinado'
      }
    ],
    thumbnail: '/products/03-conjunto-cetim/prata.jpg',
    rating: 5.0,
    reviewCount: 22,
    pairedWithId: '01-casaco-tricot'
  },
  {
    id: '04-conjunto-alfaiataria-bege',
    name: 'Conjunto Alfaiataria Premium Bege Dourado',
    price: 389.90,
    formattedPrice: 'R$ 389,90',
    originalPrice: 489.90,
    formattedOriginalPrice: 'R$ 489,90',
    discountBadge: 'OUTLET 20% OFF',
    category: 'Alfaiataria Nobre',
    badge: 'Top 1 Mais Vendido',
    isBestSeller: true,
    isOutlet: true,
    description: 'A definição absoluta da alfaiataria feminina contemporânea. Peça esculpida em tecido estruturado de caimento impecável em tom bege sofisticado. Projetado para mulheres que se posicionam com autoridade e elegância onde chegam.',
    details: [
      'Alfaiataria encorpada com costura e forro de alto padrão',
      'Blazer com ombreiras sutis que desenham a postura com harmonia',
      'Calça pantalona com pregas frontaisRequesting alongadoras',
      'Composição: 95% Crepe Alfaiataria, 5% Spandex',
      'Acompanha botões nobres com acabamento em banho dourado fosco'
    ],
    sizes: ['P (veste 38)', 'M (veste 40)', 'G (veste 42/44)'],
    colors: [
      { name: 'Bege Areia Nobre', hex: '#E2D3B8', imageSrc: '/products/04-conjunto-alfaiataria-bege/bege.jpg' }
    ],
    media: [
      {
        type: 'video',
        src: '/products/04-conjunto-alfaiataria-bege/video.mp4',
        label: 'Vídeo no Provador (Leidy)'
      },
      {
        type: 'image',
        src: '/products/04-conjunto-alfaiataria-bege/bege.jpg',
        label: 'Bege Areia Nobre'
      }
    ],
    thumbnail: '/products/04-conjunto-alfaiataria-bege/bege.jpg',
    rating: 5.0,
    reviewCount: 31,
    pairedWithId: '02-blusa-tricot-rosa'
  }
];

export const CATEGORIES = [
  'Todos os Modelos',
  'Mais Vendidos',
  'Casacos & Tricots',
  'Conjuntos Exclusivos',
  'Alfaiataria Nobre',
  'Blusas & Tops',
  'OUTLET'
];

export const STORE_INFO = {
  name: 'Leidy Boutique',
  tagline: 'Curadoria Exclusiva em Moda Feminina',
  whatsapp: '5549999999999', // Leonardo pode ajustar o número real da Leidy a qualquer momento
  instagram: '@leidyboutique',
  freeShippingThreshold: 350.00
};
