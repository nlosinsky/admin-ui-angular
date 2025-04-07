const { randomUUID } = require('node:crypto');
const dbController = require("../../db");

exports.login = (req, res) => {
  const { users } = dbController.readDB();
  const { email, password } = req.body;

  const user = users.find(user => email === user.email && password === user.password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = randomUUID();
  // todo add more arguments
  res.cookie('authToken', token, { maxAge: 60 * 60 * 1000, sameSite: 'strict' });
  res.json('You are logged in');
}

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
  const token = req.cookies['authToken'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};
