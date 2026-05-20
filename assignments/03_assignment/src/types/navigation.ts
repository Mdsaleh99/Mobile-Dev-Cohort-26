export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  RestaurantDetail: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    priceRange: string;
    heroImage: any;
  };
  Cart: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type ProfileDrawerParamList = {
  Profile: undefined;
  MyOrders: undefined;
  Settings: undefined;
  Help: undefined;
};
