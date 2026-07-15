const jwt = require('jsonwebtoken');

// Use the same secret as in the auth controller.
const SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(401);
  }
};

module.exports = authenticate;
