const crypto = require('crypto');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const secret = process.env.BOLD_SECRET_KEY;
  const currency = 'COP';
  const timestamp = Date.now();
  const orderId = `parkly-${userId}-${amount}-${timestamp}`;
  const raw = `${orderId}${amount}${currency}${secret}`;
  const hash = crypto.createHash('sha256').update(raw).digest('hex');

  return res.status(200).json({ orderId, hash });
};
