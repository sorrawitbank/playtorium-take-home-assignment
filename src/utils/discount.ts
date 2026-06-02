import type { Cart } from "../types/cart";
import type { DiscountInput } from "../types/discount";

function isFinitePositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function validateCart(cart: Cart): void {
  if (!Array.isArray(cart)) {
    throw new Error("Cart must be an array.");
  }

  cart.forEach((item, index) => {
    if (!item || typeof item.name !== "string" || item.name.trim() === "") {
      throw new Error(`Cart item at index ${index} has invalid name.`);
    }

    if (!isFinitePositiveNumber(item.price)) {
      throw new Error(`Cart item at index ${index} has invalid price.`);
    }
  });
}

function validateDiscountInput(discountInput: DiscountInput): void {
  if (discountInput == null || typeof discountInput !== "object") {
    throw new Error("Discount input must be an object.");
  }

  if (discountInput.coupon) {
    if (discountInput.coupon.type === "fixed") {
      if (!isFinitePositiveNumber(discountInput.coupon.amount)) {
        throw new Error("Coupon fixed amount must be a non-negative number.");
      }
    }

    if (discountInput.coupon.type === "percentage") {
      const { percentage } = discountInput.coupon;
      if (!isFinitePositiveNumber(percentage) || percentage > 100) {
        throw new Error("Coupon percentage must be between 0 and 100.");
      }
    }
  }

  if (discountInput.onTop) {
    if (discountInput.onTop.type === "categoryPercentage") {
      const { percentage } = discountInput.onTop;
      if (!isFinitePositiveNumber(percentage) || percentage > 100) {
        throw new Error(
          "On top category percentage must be between 0 and 100.",
        );
      }
    }

    if (discountInput.onTop.type === "points") {
      if (!isFinitePositiveNumber(discountInput.onTop.points)) {
        throw new Error("On top points must be a non-negative number.");
      }
    }
  }

  if (discountInput.seasonal) {
    const { everyX, discountY } = discountInput.seasonal;
    if (!isFinitePositiveNumber(everyX) || everyX <= 0) {
      throw new Error("Seasonal everyX must be greater than 0.");
    }
    if (!isFinitePositiveNumber(discountY)) {
      throw new Error("Seasonal discountY must be a non-negative number.");
    }
  }
}

function calculateFinalPrice(cart: Cart, discountInput: DiscountInput): number {
  validateCart(cart);
  validateDiscountInput(discountInput);

  let total = cart.reduce((sum, item) => sum + item.price, 0);

  // 1) Coupon
  if (discountInput.coupon) {
    if (discountInput.coupon.type === "fixed") {
      total -= discountInput.coupon.amount;
    } else {
      total -= total * (discountInput.coupon.percentage / 100);
    }
  }

  // 2) On Top (exactly one campaign type)
  if (discountInput.onTop) {
    const onTopCampaign = discountInput.onTop;

    if (onTopCampaign.type === "categoryPercentage") {
      const categoryTotal = cart
        .filter((item) => item.category === onTopCampaign.category)
        .reduce((sum, item) => sum + item.price, 0);

      total -= categoryTotal * (onTopCampaign.percentage / 100);
    } else {
      const maxDiscount = total * 0.2;
      const usedPoints = Math.min(onTopCampaign.points, maxDiscount);
      total -= usedPoints;
    }
  }

  // 3) Seasonal
  if (discountInput.seasonal) {
    const times = Math.floor(total / discountInput.seasonal.everyX);
    total -= times * discountInput.seasonal.discountY;
  }

  return Math.max(0, Number(total.toFixed(2)));
}

export default calculateFinalPrice;
