export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  priceRange: string;
  tags: string[];
  heroImage: any;
  cardImage: any;
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Lumina Brasserie',
    cuisine: 'Mediterranean · Tasting Menu',
    rating: 4.9,
    reviewCount: 312,
    deliveryTime: '40-50 min',
    priceRange: '$$$$',
    tags: ['Organic', 'Chef\'s Table'],
    heroImage: require('../../assets/images/image1.png'),
    cardImage: require('../../assets/images/image5.png'),
  },
  {
    id: '2',
    name: 'Osteria Verde',
    cuisine: 'Artisan Italian · Wood-fired',
    rating: 4.8,
    reviewCount: 420,
    deliveryTime: '35-45 min',
    priceRange: '$$$',
    tags: ['Organic', 'Seasonal'],
    heroImage: require('../../assets/images/image6.png'),
    cardImage: require('../../assets/images/image6.png'),
  },
  {
    id: '3',
    name: 'Botanica',
    cuisine: 'Plant-Based · Organic',
    rating: 4.7,
    reviewCount: 198,
    deliveryTime: '25-35 min',
    priceRange: '$$$',
    tags: ['Vegan', 'Gluten-Free'],
    heroImage: require('../../assets/images/image7.png'),
    cardImage: require('../../assets/images/image7.png'),
  },
];
