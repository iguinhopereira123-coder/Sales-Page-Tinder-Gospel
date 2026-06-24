# Comunidade Tinder Gospel — Sales Page

Landing page cinematográfica em Next.js para a Comunidade Tinder Gospel.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- GSAP (animações de scroll)
- Vercel Analytics
- Meta Pixel + Utmify

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Checkout

O botão de compra redireciona para o Universal Checkout com UTMs preservadas via `lib/tracking.ts`.

## Deploy

Importe o repositório na Vercel. O framework é detectado automaticamente como Next.js.
