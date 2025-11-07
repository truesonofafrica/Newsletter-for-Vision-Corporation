const HEALTH_TOKEN = process.env.HEALTH_TOKEN;

const health = (req, res) => {
  const token = req.get('x-health-token') || req.query.token;
  if (token !== HEALTH_TOKEN) return res.status(401).send('unauthorized');
  res.set('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, time: Date.now() });
};

module.exports = health;
