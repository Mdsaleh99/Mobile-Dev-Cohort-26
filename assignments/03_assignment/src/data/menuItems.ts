export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: 'Popular' | 'Starters' | 'Mains';
  image: any;
};

export const MENU_ITEMS: MenuItem[] = [
  // Lumina Brasserie (id: '1')
  {
    id: "m1",
    restaurantId: "1",
    name: "Wild Mushroom & Truffle Tagliatelle",
    description:
      "Hand-made ribbon pasta tossed in a light mascarpone cream, finished with shaved black truffle.",
    price: 34.0,
    category: "Popular",
    image: require("../../assets/images/image2.png"),
  },
  {
    id: "m2",
    restaurantId: "1",
    name: "Heirloom Tomato Burrata",
    description:
      "Pugliese burrata, farm-fresh heirloom tomatoes, aged balsamic reduction, fresh basil.",
    price: 22.0,
    category: "Popular",
    image: require("../../assets/images/image3.png"),
  },
  {
    id: "m3",
    restaurantId: "1",
    name: "Wagyu Beef Carpaccio",
    description:
      "Thinly sliced wagyu beef, caper berries, arugula, shaved parmesan, truffle oil drizzle.",
    price: 28.0,
    category: "Starters",
    image: require("../../assets/images/image4.png"),
  },
  {
    id: "m4",
    restaurantId: "1",
    name: "Pan-Seared Scallops",
    description:
      "Diver scallops on pea purée, crispy pancetta, micro herbs, lemon beurre blanc.",
    price: 38.0,
    category: "Mains",
    image: require("../../assets/images/image5.png"),
  },

  // Osteria Verde (id: '2')
  {
    id: "m5",
    restaurantId: "2",
    name: "Truffle Risotto",
    description:
      "Carnaroli rice, 24-month aged parmesan crisp, white truffle oil, chive oil.",
    price: 32.0,
    category: "Popular",
    image: require("../../assets/images/image8.png"),
  },
  {
    id: "m6",
    restaurantId: "2",
    name: "Margherita Napoletana",
    description:
      "San Marzano tomatoes, fior di latte, fresh basil, extra virgin olive oil.",
    price: 24.0,
    category: "Popular",
    image: require("../../assets/images/image6.png"),
  },
  {
    id: "m7",
    restaurantId: "2",
    name: "Wagyu Beef Tartare",
    description:
      "Cured egg yolk, capers, shallots, artisanal crostini, Dijon aioli.",
    price: 28.0,
    category: "Starters",
    image: require("../../assets/images/image9.png"),
  },
  {
    id: "m8",
    restaurantId: "2",
    name: "Charred Octopus",
    description:
      "Mediterranean octopus, slow-cooked and charred, served over smoked potato purée with salsa verde.",
    price: 26.0,
    category: "Starters",
    image: require("../../assets/images/image4.png"),
  },

  // Botanica (id: '3')
  {
    id: "m9",
    restaurantId: "3",
    name: "Harvest Grain Bowl",
    description:
      "Farro, roasted sweet potato, edamame, avocado, sesame-ginger dressing.",
    price: 21.0,
    category: "Popular",
    image: require("../../assets/images/image7.png"),
  },
  {
    id: "m10",
    restaurantId: "3",
    name: "Burrata & Stone Fruit",
    description:
      "Fresh burrata, white peach, roasted cherry tomatoes, aged sherry vinegar, basil oil.",
    price: 19.0,
    category: "Starters",
    image: require("../../assets/images/image3.png"),
  },
  {
    id: "m11",
    restaurantId: "3",
    name: "Miso Glazed Aubergine",
    description:
      "Roasted aubergine, white miso glaze, pickled cucumber, toasted sesame, spring onion.",
    price: 23.0,
    category: "Mains",
    image: require("../../assets/images/image5.png"),
  },
];
