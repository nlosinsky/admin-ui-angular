const { verifyToken } = require("./auth/auth.controller");

module.exports = (app) => {
  app.use('/documents', verifyToken, require('./documents'));
  app.use('/companies', verifyToken , require('./companies'));
  app.use('/transactions', verifyToken, require('./transactions'));
  app.use('/members', verifyToken, require('./members'));
  app.use('/accounts', verifyToken, require('./accounts'));
  app.use('/users', verifyToken, require('./users'));
  app.use('/auth', require('./auth'));
  app.use('/constant-data', require('./constant-data'));
}
