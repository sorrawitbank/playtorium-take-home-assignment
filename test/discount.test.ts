import { describe, expect, it } from "vitest";
import cartData from "../src/data/cart.json";
import type { Cart } from "../src/types/cart";
import type { DiscountInput } from "../src/types/discount";
import calculateFinalPrice from "../src/utils/discount";

const baseCart = cartData as Cart;

describe("calculateFinalPrice", () => {
  it("no discount", () => {
    expect(calculateFinalPrice(baseCart, {})).toBe(2120);
  });

  it("applies fixed coupon", () => {
    const discount: DiscountInput = {
      coupon: { type: "fixed", amount: 50 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(2070);
  });

  it("applies percentage coupon", () => {
    const discount: DiscountInput = {
      coupon: { type: "percentage", percentage: 10 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1908);
  });

  it("applies on-top clothing category percentage", () => {
    const discount: DiscountInput = {
      onTop: {
        type: "categoryPercentage",
        category: "Clothing",
        percentage: 15,
      },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(2067.5);
  });

  it("applies on-top electronics category percentage", () => {
    const discount: DiscountInput = {
      onTop: {
        type: "categoryPercentage",
        category: "Electronics",
        percentage: 25,
      },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1797.5);
  });

  it("caps on-top points discount to 20 percent", () => {
    const discount: DiscountInput = {
      onTop: { type: "points", points: 9999 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1696);
  });

  it("applies seasonal discount by threshold", () => {
    const discount: DiscountInput = {
      seasonal: { everyX: 300, discountY: 40 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1840);
  });

  it("applies campaigns in correct order: coupon then on-top then seasonal", () => {
    const discount: DiscountInput = {
      coupon: { type: "percentage", percentage: 10 },
      onTop: { type: "points", points: 68 },
      seasonal: { everyX: 300, discountY: 40 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1600);
  });

  it("applies campaigns in correct order: coupon then on-top (category percentage) then seasonal", () => {
    const discount: DiscountInput = {
      coupon: { type: "percentage", percentage: 10 },
      onTop: {
        type: "categoryPercentage",
        category: "Clothing",
        percentage: 40,
      },
      seasonal: { everyX: 300, discountY: 40 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1568);
  });

  it("applies campaigns in correct order: coupon then on-top (caps on-top points discount to 20 percent) then seasonal", () => {
    const discount: DiscountInput = {
      coupon: { type: "percentage", percentage: 10 },
      onTop: { type: "points", points: 9999 },
      seasonal: { everyX: 300, discountY: 40 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(1326.4);
  });

  it("returns zero when discount exceeds total", () => {
    const discount: DiscountInput = {
      coupon: { type: "fixed", amount: 9999 },
    };

    expect(calculateFinalPrice(baseCart, discount)).toBe(0);
  });

  it("throws for invalid cart item price", () => {
    const invalidCart = [
      { name: "Broken item", price: -1, category: "Clothing" },
    ] as Cart;

    expect(() => calculateFinalPrice(invalidCart, {})).toThrow(
      "Cart item at index 0 has invalid price.",
    );
  });

  it("throws for invalid coupon percentage", () => {
    const discount = {
      coupon: { type: "percentage", percentage: 150 },
    } as DiscountInput;

    expect(() => calculateFinalPrice(baseCart, discount)).toThrow(
      "Coupon percentage must be between 0 and 100.",
    );
  });

  it("throws for invalid on top category percentage", () => {
    const discount = {
      onTop: {
        type: "categoryPercentage",
        category: "Accessories",
        percentage: 150,
      },
    } as DiscountInput;

    expect(() => calculateFinalPrice(baseCart, discount)).toThrow(
      "On top category percentage must be between 0 and 100.",
    );
  });

  it("throws for invalid seasonal everyX", () => {
    const discount: DiscountInput = {
      seasonal: { everyX: 0, discountY: 40 },
    };

    expect(() => calculateFinalPrice(baseCart, discount)).toThrow(
      "Seasonal everyX must be greater than 0.",
    );
  });
});
