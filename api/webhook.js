module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const type = body.type;
    const orderId = body.data?.metadata?.reference;
    const amount = body.data?.amount?.total;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    if (type === 'SALE_APPROVED') {
      const isSuscripcion = orderId.includes('-sub-');
      const endpoint = isSuscripcion
        ? 'https://parkly.website/version-test/api/1.1/wf/bold-webhook-suscripcion'
        : 'https://parkly.website/version-test/api/1.1/wf/bold-webhook';

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSO
