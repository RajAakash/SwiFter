const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(403)
      .send({ message: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token.split(' ')[1], 'ADMIN_SECRET');
    if (decoded.role !== 'admin')
      return res.status(403).send({ message: 'Not authorized as admin.' });
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};
module.exports = { verifyAdmin };
