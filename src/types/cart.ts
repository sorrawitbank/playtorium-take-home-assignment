export type ItemCategory = "Clothing" | "Accessories" | "Electronics";

export type CartItem = {
  name: string;
  price: number;
  category: ItemCategory;
};

export type Cart = CartItem[];
