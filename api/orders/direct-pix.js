const REQUIRED_FIELDS = ['transaction_id', 'status', 'amount', 'checkout_id', 'description'];

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function getOrigin(req) {
  return req.headers.origin || '';
}

function isAllowedOrigin(origin) {
  const configured = process.env.ALLOWED_ORIGINS || '';
  if (!configured.trim()) return true;
  const allowed = configured.split(',').map(item => item.trim()).filter(Boolean);
  return allowed.includes(origin);
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

function pickClientPayload(body) {
  const payload = {
    transaction_id: String(body.transaction_id || ''),
    status: String(body.status || 'created'),
    amount: Number(body.amount || 0),
    customer_name: String(body.customer_name || ''),
    customer_email: String(body.customer_email || ''),
    customer_phone: String(body.customer_phone || ''),
    checkout_id: String(body.checkout_id || ''),
    description: String(body.description || ''),
    utmify_conversion_sent: Boolean(body.utmify_conversion_sent),
    meta_conversion_sent: Boolean(body.meta_conversion_sent),
    utm_source: String(body.utm_source || ''),
    utm_medium: String(body.utm_medium || ''),
    utm_campaign: String(body.utm_campaign || ''),
    utm_content: String(body.utm_content || ''),
    utm_term: String(body.utm_term || '')
  };
  return payload;
}

function validatePayload(payload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field]) return `Campo obrigatório ausente: ${field}`;
  }
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    return 'Valor inválido.';
  }
  return null;
}

function buildSecureOrderPayload(clientPayload) {
  return {
    ...clientPayload,
    user_id: process.env.ORDER_USER_ID,
    pix_copy_paste_code: process.env.PIX_COPY_PASTE_CODE
  };
}

async function sendToSupabase(orderPayload) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas no servidor.');
  }

  const baseUrl = supabaseUrl.replace(/\/$/, '');
  const endpoint = `${baseUrl}/rest/v1/orders`;

  const upstreamResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(orderPayload)
  });

  if (!upstreamResponse.ok) {
    const text = await upstreamResponse.text();
    throw new Error(`Falha no upstream (${upstreamResponse.status}): ${text}`);
  }

  return upstreamResponse.json();
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });

    const origin = getOrigin(req);
    if (!isAllowedOrigin(origin)) {
      return json(res, 403, { ok: false, error: 'Origin não permitida.' });
    }

    const body = parseBody(req);
    const clientPayload = pickClientPayload(body);
    const validationError = validatePayload(clientPayload);
    if (validationError) return json(res, 400, { ok: false, error: validationError });

    if (!process.env.ORDER_USER_ID || !process.env.PIX_COPY_PASTE_CODE) {
      return json(res, 500, {
        ok: false,
        error: 'Configuração incompleta no servidor (ORDER_USER_ID / PIX_COPY_PASTE_CODE).'
      });
    }

    const securePayload = buildSecureOrderPayload(clientPayload);
    const created = await sendToSupabase(securePayload);

    return json(res, 200, { ok: true, data: created });
  } catch (error) {
    console.error('[direct-pix] erro:', error);
    return json(res, 500, { ok: false, error: 'Erro interno ao criar ordem.' });
  }
}

