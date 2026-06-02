import { describe, expect, it } from "vitest";
import type { Cart } from "../src/types/cart";
import type { DiscountInput } from "../src/types/discount";
import calculateFinalPrice from "../src/utils/discount";

describe("calculateFinalPrice - PDF examples", () => {
  it("fixed amount coupon: 1 T-Shirt 350, 1 Hat 250, discount 50 => total 550", () => {
    const cart: Cart = [
      { name: "T-Shirt", price: 350, category: "Clothing" },
      { name: "Hat", price: 250, category: "Accessories" },
    ];

    const discount: DiscountInput = {
      coupon: { type: "fixed", amount: 50 },
    };

    expect(calculateFinalPrice(cart, discount)).toBe(550);
  });

  it("percentage coupon: 1 T-Shirt 350, 1 Hat 250, 10% => total 540", () => {
    const cart: Cart = [
      { name: "T-Shirt", price: 350, category: "Clothing" },
      { name: "Hat", price: 250, category: "Accessories" },
    ];

    const discount: DiscountInput = {
      coupon: { type: "percentage", percentage: 10 },
    };

    expect(calculateFinalPrice(cart, discount)).toBe(540);
  });

  it("category percentage: clothing 15% on clothing items only => total 2,382.5", () => {
    const cart: Cart = [
      { name: "T-Shirt", price: 350, category: "Clothing" },
      { name: "Hoodie", price: 700, category: "Clothing" },
      { name: "Watch", price: 850, category: "Accessories" },
      { name: "Bag", price: 640, category: "Accessories" },
    ];

    const discount: DiscountInput = {
      onTop: {
        type: "categoryPercentage",
        category: "Clothing",
        percentage: 15,
      },
    };

    expect(calculateFinalPrice(cart, discount)).toBe(2382.5);
  });

  it("points discount with 20% cap: total 830, 68 points => total 762", () => {
    const cart: Cart = [
      { name: "T-Shirt", price: 350, category: "Clothing" },
      { name: "Hat", price: 250, category: "Accessories" },
      { name: "Belt", price: 230, category: "Accessories" },
    ];

    const discount: DiscountInput = {
      onTop: {
        type: "points",
        points: 68,
      },
    };

    expect(calculateFinalPrice(cart, discount)).toBe(762);
  });

  it("seasonal discount: total 830, 40 THB every 300 THB => total 750", () => {
    const cart: Cart = [
      { name: "T-Shirt", price: 350, category: "Clothing" },
      { name: "Hat", price: 250, category: "Accessories" },
      { name: "Belt", price: 230, category: "Accessories" },
    ];

    const discount: DiscountInput = {
      seasonal: {
        everyX: 300,
        discountY: 40,
      },
    };

    expect(calculateFinalPrice(cart, discount)).toBe(750);
  });
});
