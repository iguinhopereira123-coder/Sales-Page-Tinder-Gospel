function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function getOrigin(req) {
  return req.headers.origin || '';
}

function normalizeOrigin(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch {
    return String(value).trim().replace(/\/+$/, '').toLowerCase();
  }
}

function isAllowedOrigin(origin) {
  const configured = process.env.ALLOWED_ORIGINS || '';
  if (!configured.trim()) return true;
  const normalizedOrigin = normalizeOrigin(origin);
  const allowed = configured
    .split(',')
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);
  return allowed.includes(normalizedOrigin);
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });

    const origin = getOrigin(req);
    if (!isAllowedOrigin(origin)) {
      return json(res, 403, { ok: false, error: 'Origin não permitida.' });
    }

    const webhookUrl = process.env.N8N_PAYMENT_PROOF_WEBHOOK_URL;
    if (!webhookUrl) {
      return json(res, 500, { ok: false, error: 'N8N_PAYMENT_PROOF_WEBHOOK_URL não configurada.' });
    }

    const body = parseBody(req);
    if (!body?.costumer_phone || !body?.media_data_url) {
      return json(res, 400, { ok: false, error: 'Payload inválido para comprovante.' });
    }

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.N8N_PAYMENT_PROOF_WEBHOOK_TOKEN) {
      headers.Authorization = `Bearer ${process.env.N8N_PAYMENT_PROOF_WEBHOOK_TOKEN}`;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      return json(res, 502, { ok: false, error: `Webhook n8n falhou (${response.status}): ${text}` });
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return json(res, 200, { ok: true, data });
  } catch (error) {
    console.error('[payment-proof-webhook] erro:', error);
    return json(res, 500, { ok: false, error: 'Erro interno ao enviar comprovante.' });
  }
}

