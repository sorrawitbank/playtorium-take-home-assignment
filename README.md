## Discount Module – Playtorium Take‑home Assignment

This project implements the **discount module** from the Playtorium take‑home assignment.  
It focuses on calculating the final price of an order by applying multiple discount campaigns with a fixed order:

- **Coupon** → **On Top** → **Seasonal**

### Features (Mapped to Requirement)

- **Coupon (only one at a time)**
  - **Fixed amount**: subtract a fixed THB amount from the cart total.
  - **Percentage discount**: subtract a percentage of the cart total.
- **On Top (only one at a time)**
  - **Percentage by item category**: discount a specific category (`Clothing`, `Accessories`, `Electronics`) by X%.
  - **Points discount**: 1 point = 1 THB, **capped at 20%** of the current total.
- **Seasonal**
  - Every **X THB** in the current total, subtract **Y THB**.
- **Validation**
  - Cart shape, positive prices.
  - Coupon percentage within 0–100.
  - On Top percentage within 0–100.
  - Points non‑negative.
  - Seasonal `everyX > 0`, `discountY >= 0`.
- **Tested**
  - Unit tests for main logic.
  - Separate tests that reproduce **all examples from the PDF**.

### Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Build**: `tsc`
- **Test**: `vitest`

### Project Structure (Relevant Parts)

- `src/types/cart.ts` – cart and item type definitions.
- `src/types/discount.ts` – discount campaign types (`Coupon`, `OnTop`, `Seasonal`).
- `src/utils/discount.ts` – core function `calculateFinalPrice(cart, discountInput)`.
- `src/data/cart.json` – example cart used by `main.ts` and tests.
- `src/data/discounts.json` – example discount configuration for `main.ts`.
- `src/main.ts` – simple entry point that reads JSON and logs final price.
- `test/discount.test.ts` – general test cases and ordering (Coupon → On Top → Seasonal).
- `test/discountPDFExample.test.ts` – tests that match **PDF examples 1–5** exactly.

### How to Run

#### 1. Install dependencies

```bash
npm install
```

#### 2. Run in dev mode (using example JSON)

```bash
npm run dev
```

This will:

- Read `src/data/cart.json` as the cart.
- Read `src/data/discounts.json` as the chosen campaigns.
- Print the final price to stdout.

#### 3. Build and run compiled code

```bash
npm run build
npm start
```

### How to Run Tests

#### Run full test suite once

```bash
npm test
```

#### Run tests in watch mode

```bash
npm run test:watch
```

The suite includes:

- Logic tests in `test/discount.test.ts`.
- PDF example tests in `test/discountPDFExample.test.ts`.

### Assumptions

- **Campaign exclusivity per category**
  - At most **one Coupon campaign** at a time (`fixed` or `percentage`).
  - At most **one On Top campaign** at a time (`categoryPercentage` or `points`).
  - At most **one Seasonal campaign** at a time.
- **Order of application**
  - Always: **Coupon → On Top → Seasonal**, as specified in the PDF.
- **Points cap (On Top)**
  - The 20% cap is always calculated on the current running total **after** Coupon and **before** Seasonal.
- **Input source**
  - For simplicity, the “module to receive user inputs” is implemented as:
    - TypeScript function `calculateFinalPrice(cart, discountInput)` for programmatic use.
    - `main.ts` that reads from JSON files.
  - A full UI is intentionally omitted as allowed by the assignment.
- **Error handling**
  - Invalid inputs (e.g., negative prices, invalid percentages) throw errors early to keep the core calculation safe and explicit.

### How to Use the Core Module Programmatically

You can import and call the function directly:

```ts
import calculateFinalPrice from "./src/utils/discount";
import type { Cart } from "./src/types/cart";
import type { DiscountInput } from "./src/types/discount";

const cart: Cart = [
  { name: "T-Shirt", price: 350, category: "Clothing" },
  { name: "Hat", price: 250, category: "Accessories" },
];

const discount: DiscountInput = {
  coupon: { type: "percentage", percentage: 10 },
};

const finalPrice = calculateFinalPrice(cart, discount);
console.log(finalPrice);
```

This README is intended to document how the assignment requirements are interpreted, implemented, and tested within this repository.
