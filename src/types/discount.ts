import type { ItemCategory } from "./cart";

export type CouponCampaign =
  | {
      type: "fixed";
      amount: number;
    }
  | {
      type: "percentage";
      percentage: number;
    };

export type OnTopCampaign =
  | {
      type: "categoryPercentage";
      category: ItemCategory;
      percentage: number;
    }
  | {
      type: "points";
      points: number;
    };

export type SeasonalCampaign = {
  everyX: number;
  discountY: number;
};

export type DiscountInput = {
  coupon?: CouponCampaign;
  onTop?: OnTopCampaign;
  seasonal?: SeasonalCampaign;
};
