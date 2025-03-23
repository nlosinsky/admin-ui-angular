const jwt = require('jsonwebtoken');
const dbController = require("../../db");
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret';

exports.login = (req, res) => {
  const { users } = dbController.readDB();
  const { email, password } = req.body;

  const user = users.find(user => email === user.email && password === user.password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateToken(user);
  res.json({
    accessToken,
    userId: user.id
  });
}

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};
