module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body;
    const type = body.type;
    const orderId = body.data?.metadata?.reference;
    const amount = body.data?.amount?.total;

    if (!orderId || !amount) {
      res.status(400).json({ error: 'Faltan datos' });
      return;
    }

    if (type === 'SALE_APPROVED') {
      const isSuscripcion = orderId.includes('-sub-');
      const endpoint = isSuscripcion
        ? 'https://parkly.website/version-test/api/1.1/wf/bold-webhook-suscripcion'
        : 'https://parkly.website/version-test/api/1.1/wf/bold-webhook';

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          amount: String(amount),
          status: 'approved'
        })
      });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
