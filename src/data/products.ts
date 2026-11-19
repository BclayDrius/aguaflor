import img500ml from '../assets/images/aguaflor500ml.jpeg';
import img650ml from '../assets/images/aguaflor650ml.jpeg';
import img7l from '../assets/images/aguaflor7l.jpeg';
import img20l from '../assets/images/aguaflor20l.jpeg';

export type ProductCategory = 'personal' | 'familiar' | 'gran-capacidad';

export interface Product {
  id: string;
  name: string;
  shortLabel: string;
  numeral: string;
  unit: string;
  category: ProductCategory;
  badge: string;
  highlightTag?: string;
  featured?: boolean;
  bestSeller?: boolean;
  photoStyle: 'studio' | 'nature';
  offsetDesktop: number;
  image: ImageMetadata;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  idealFor: string[];
  specs: string[];
}

export const BRAND = {
  name: 'Aguaflor',
  tagline: 'Lo natural siempre es mejor',
  subtitle: 'Agua de mesa sin gas',
  phoneDisplay: '+51 995 822 660',
  whatsappNumber: '51995822660',
  email: 'contacto@tamayainvest.com',
  hours: 'Lunes a Sábado, 8am – 6pm',
  delivery: 'Disponible en La Merced y San Ramón – Chanchamayo',
  address: 'Carretera Central km 100.20, sector Salsipuedes, San Ramón – Chanchamayo',
  reclamacionesUrl: 'https://tamayainvest.com/libro-de-reclamaciones.php',
} as const;

export const PRODUCTS: Product[] = [
  {
    id: '500ml',
    name: 'Aguaflor 500 ml',
    shortLabel: '500 ml',
    numeral: '500',
    unit: 'ml',
    category: 'personal',
    badge: 'Personal',
    photoStyle: 'studio',
    offsetDesktop: 0,
    image: img500ml,
    shortDescription: 'Botella de agua perfecta para una dosis de rehidratación.',
    fullDescription:
      'Nuestra presentación personal de 500ml es perfecta para llevarla contigo a cualquier lugar. Diseñada para tu hidratación diaria, ya sea en el trabajo, en el gimnasio o en tus actividades al aire libre. Tu compañera ideal para mantenerte hidratado todo el día.',
    highlights: ['Tapa antiderrame', 'PET 100% reciclable'],
    idealFor: ['Trabajo y oficina', 'Gimnasio y deporte', 'Actividades al aire libre', 'Viajes en auto'],
    specs: [
      'Pureza Natural: agua de mesa sin gas 100% natural, sin aditivos ni conservantes',
      'Capacidad Ideal: 500ml perfectos para hidratación personal durante varias horas',
      'Tapa Segura: tapa de rosca que evita derrames y mantiene la frescura',
      'Ecológica: envase PET 100% reciclable y diseño ergonómico',
      'Diseño Ergonómico: fácil de agarrar y transportar en cualquier bolso o mochila',
      'Resistente: mantiene la temperatura y resiste caídas ocasionales',
    ],
  },
  {
    id: '650ml',
    name: 'Aguaflor 650 ml',
    shortLabel: '650 ml',
    numeral: '650',
    unit: 'ml',
    category: 'personal',
    badge: 'Personal',
    photoStyle: 'studio',
    offsetDesktop: 84,
    image: img650ml,
    shortDescription:
      'Ideal para llevar contigo a cualquier lugar. Perfecta para el día a día, el trabajo o el gimnasio.',
    fullDescription:
      'Nuestra presentación personal de 650ml es perfecta para llevar contigo a cualquier lugar. Diseñada para tu hidratación diaria, ya sea en el trabajo, en el gimnasio o en tus actividades al aire libre. Tu compañera ideal para mantenerte hidratado todo el día.',
    highlights: ['Mayor rendimiento', 'Diseño ergonómico'],
    idealFor: ['Trabajo y oficina', 'Gimnasio y deporte', 'Actividades al aire libre', 'Viajes en auto'],
    specs: [
      'Pureza Natural: agua de mesa sin gas 100% natural, sin aditivos ni conservantes',
      'Capacidad Ideal: 650ml perfectos para hidratación personal durante varias horas',
      'Tapa Segura: tapa de rosca que evita derrames y mantiene la frescura',
      'Ecológica: envase PET 100% reciclable y diseño ergonómico',
      'Diseño Ergonómico: fácil de agarrar y transportar en cualquier bolso o mochila',
      'Resistente: mantiene la temperatura y resiste caídas ocasionales',
    ],
  },
  {
    id: '7l',
    name: 'Aguaflor 7 L',
    shortLabel: '7 L',
    numeral: '7',
    unit: 'L',
    category: 'familiar',
    badge: 'Familiar',
    highlightTag: 'Con dispensador',
    featured: true,
    photoStyle: 'nature',
    offsetDesktop: 28,
    image: img7l,
    shortDescription:
      'Perfecta para el hogar o la oficina. Presentación en galonera con dispensador fácil de usar.',
    fullDescription:
      'La galonera de 7L es la opción perfecta para el hogar o la oficina. Incluye un práctico dispensador que facilita servir el agua y mantiene la pureza del contenido. Diseñada para familias o pequeños grupos que valoran la calidad y practicidad.',
    highlights: ['Galonera con caño', 'Ideal para familias'],
    idealFor: ['Hogar y cocina', 'Oficinas pequeñas', 'Mesa diaria y reuniones'],
    specs: [
      'Agua de mesa sin gas 100% natural',
      'Galonera con dispensador incluido',
      'Fácil de almacenar y servir',
      'Envase de alta resistencia y reciclable',
      'Ideal para el consumo familiar',
      'Mantiene la frescura del agua por más tiempo',
    ],
  },
  {
    id: '20l',
    name: 'Aguaflor 20 L',
    shortLabel: '20 L',
    numeral: '20',
    unit: 'L',
    category: 'gran-capacidad',
    badge: 'Gran capacidad',
    highlightTag: 'Más vendido',
    bestSeller: true,
    photoStyle: 'studio',
    offsetDesktop: 112,
    image: img20l,
    shortDescription:
      'Bidón de 20 litros para eventos, oficinas o familias grandes. La opción más económica a largo plazo.',
    fullDescription:
      'Nuestro bidón de 20L es la solución perfecta para eventos, oficinas o familias grandes que consumen mucha agua. Ofrece la mejor relación calidad-precio y está diseñado para usarse con dispensadores de agua estándar. La opción más económica y práctica para un suministro constante de agua pura y natural.',
    highlights: ['Asa ergonómica', 'Máximo ahorro'],
    idealFor: ['Familias numerosas', 'Oficinas y empresas', 'Eventos y reuniones', 'Máximo ahorro por litro'],
    specs: [
      'Agua de mesa sin gas 100% natural',
      'Bidón de 20 litros de alta capacidad',
      'Diseñado para dispensadores estándar',
      'Envase de polietileno de alta densidad',
      'Ideal para eventos y reuniones grandes',
      'La opción más económica por litro',
      'Fácil de transportar con asa ergonómica',
      'Tapa de seguridad antiderrame',
    ],
  },
];
