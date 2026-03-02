module.exports = async function handler(req, res) {
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
      await fetch(`https://parkly.website/api/1.1/wf/bold-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          amount: amount,
          status: 'approved'
        })
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
