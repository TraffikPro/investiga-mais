const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Muitas tentativas. Tente novamente mais tarde.'
});

module.exports = loginLimiter;
