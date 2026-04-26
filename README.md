# Typebot Tinder (Front + Back na Vercel)

Projeto com:
- Frontend estático: `tinder-gospel-typebot.html`
- Backend serverless: `api/orders/direct-pix.js`

## Como funciona

- O frontend chama `POST /api/orders/direct-pix` quando o usuário escolhe Pix direto.
- A função serverless adiciona os dados sensíveis no servidor (`ORDER_USER_ID`, `PIX_COPY_PASTE_CODE`) e encaminha para seu webhook/API real (`ORDER_UPSTREAM_URL`).
- Nenhuma key privada fica exposta no frontend.

## Variáveis de ambiente

Use `env.example` como referência e configure no painel da Vercel:

- `ALLOWED_ORIGINS`
- `ORDER_UPSTREAM_URL`
- `ORDER_UPSTREAM_TOKEN`
- `ORDER_USER_ID`
- `PIX_COPY_PASTE_CODE`

## Deploy

1. Suba o projeto para um repositório Git.
2. Importe na Vercel.
3. Configure as variáveis de ambiente.
4. Deploy.

## Desenvolvimento local

```bash
npm install
npm run dev
```

