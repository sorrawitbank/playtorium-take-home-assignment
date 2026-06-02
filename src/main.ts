import cartData from "./data/cart.json";
import discountData from "./data/discounts.json";
import type { Cart } from "./types/cart";
import type { DiscountInput } from "./types/discount";
import calculateFinalPrice from "./utils/discount";

console.log(
  calculateFinalPrice(cartData as Cart, discountData as DiscountInput),
);
