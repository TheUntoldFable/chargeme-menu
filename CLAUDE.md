# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 (App Router) restaurant digital menu and ordering app. Mobile-first, client-side heavy. Customers browse menus, add items to cart, place orders, and pay via Stripe. UI supports Bulgarian and English via next-intl.

## Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint (next lint)
npm run format     # Prettier on all files
```

No test suite is configured.

## Path Aliases

- `@/*` → `src/*`
- `#/*` → project root (e.g. `#/public/svg/icons/IconMenu`)

## Architecture

### State Management
- **Zustand** with localStorage persistence for global client state:
  - `useCartStore` — cart items, quantities, product rating tracking
  - `useOrderStore` — orderId, items, payment status, transaction session
  - `useRestaurantStore` — restaurantId, tableId, restaurant data
  - `useLanguageStore` — selected language (BG/EN)
- `StoreHydration` component handles Zustand rehydration on mount
- **React Context** (`TableOrderContext`, `PrePayContext`) for scoped state within `AppWrapper`
- **TanStack React Query v5** for all server state — each entity has a dedicated hook in `src/hooks/`

### Provider Stack (ClientProviders)
```
Toaster → StoreHydration → IntlProvider → QueryClientProvider → LocationProvider → AppWrapper
```
`AppWrapper` reads `restaurantId` + `table` from URL query params, fetches restaurant/order data, syncs to Zustand store.

### Internationalization
- **next-intl** with default locale `bg` (Bulgarian)
- Message files in `messages/` directory (bg.json, en.json)
- Config in `src/i18n/request.ts`

### API Layer
- Base URL: `NEXT_PUBLIC_BASE_API_URL` env var
- Axios instance at `src/api/config.ts` with interceptor that injects `lang` param based on language store
- Key endpoints: `/menu-items/categories/restaurant/:id`, `/menu-items/:id`, `/restaurants/:id`, `/orders/active`, `/orders/pre-paid`, `/app/createTransaction`

### Real-time
SockJS + STOMP (`useSockJS` hook) for order status updates. Auto-reconnects every 5 seconds.

### Payments
Stripe integration. Next.js API route at `src/app/api/create-payment-intent/route.ts` creates PaymentIntents server-side. Prices in BGN display, Stripe uses EUR (`priceInEur` field on products).

### Location Services
Browser Geolocation API via `LocationService` static class. Controlled by `NEXT_PUBLIC_ENABLE_LOCATION_CHECKER`. Redirects to `/location-error` if user is outside restaurant radius.

### Styling
- Tailwind CSS v4 (CSS-based config via `@tailwindcss/postcss`, no tailwind.config.ts)
- Theme tokens defined in `src/app/globals.css` using `@theme` directive
- Radix UI + shadcn components in `src/components/ui/`
- `cn()` utility (`clsx` + `tailwind-merge`) in `src/lib/utils.ts`
- Mobile-first, max-width `440px` (`max-w-mobile`)
- Dark theme: black (#111111) background, gold (#F2C83D) accent

### Icons
Custom SVG icons as React TSX components in `public/svg/icons/`. Workflow: optimize with SVGOMG → convert via SVGR.

## Environment Variables

```bash
NEXT_PUBLIC_BASE_API_URL=               # Backend REST API base URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=     # Stripe publishable key
STRIPE_SECRET_KEY=                      # Stripe secret key (server-only)
NEXT_PUBLIC_RESTAURANT_ID=              # Default restaurant ID
NEXT_PUBLIC_ENABLE_LOCATION_CHECKER=    # Enable GPS location check (default: false)
```

## Code Style

- ESLint (`eslint-config-next` + `eslint-config-prettier`) + Prettier (`prettier-plugin-tailwindcss`, `prettier-plugin-organize-imports`)
- Husky + lint-staged: pre-commit runs ESLint fix + Prettier on `*.{js,ts,tsx,json}`
- Root layout uses `force-dynamic` rendering

## Conventions

- Most pages are `"use client"` (heavy use of hooks/browser APIs)
- Order statuses: `"NEW"`, `"ORDERED"`, `"COMPLETED"`, `"CANCELLED"`
- Payment modes: standard (post-pay) and `paymentInAdvance` (pre-pay) — controlled by restaurant config
- Commit format: `<type>(<scope>): <subject>` (types: `feat`, `fix`, `chore`, `refactor`, `perf`, `docs`, `style`, `test`, `build`)
