# OrderBook

A mobile-first Progressive Web Application (PWA) for creating grocery shopping lists and sharing them with local shopkeepers.

## Features

- **Customer Order Creation** - Add items with quantities and units
- **Share with Shopkeeper** - Via WhatsApp link or QR code
- **Shopkeeper Pricing** - Enter prices and see running total
- **WhatsApp Invoice** - Send itemized invoice directly to customer
- **Multi-language** - English and Gujarati support
- **Offline Support** - Works without internet (PWA)
- **No Backend** - Everything runs in the browser

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Radix UI (shadcn-style components)
- react-i18next (localization)
- lz-string (URL compression)
- qrcode.react (QR generation)
- vite-plugin-pwa (PWA support)
- React Router (client-side routing)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## How It Works

1. Customer creates a grocery list with items, quantities, and units
2. Enters shopkeeper's WhatsApp number
3. Shares the order via link or QR code
4. Shopkeeper opens the link and enters prices
5. Shopkeeper sends itemized invoice back via WhatsApp

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── ui/          # Base components (Button, Input, Select, etc.)
│   ├── Header.tsx   # App header with back navigation
│   └── DrawerMenu.tsx # Slide-in menu
├── features/        # Feature-specific pages
│   ├── customer/    # Customer order creation
│   ├── shopkeeper/  # Shopkeeper pricing
│   └── about/       # About & privacy
├── i18n/            # Internationalization setup
├── lib/             # Utilities (sharing, storage)
├── messages/        # Translation files (en, gu)
└── types/           # TypeScript type definitions
```

## Privacy

OrderBook runs entirely in the browser. No data is sent to any server. Lists and phone numbers are stored only in localStorage.

## License

MIT
