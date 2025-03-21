module.exports = (app) => {
  app.use('/documents', require('./documents'));
  app.use('/companies', require('./companies'));
  app.use('/transactions', require('./transactions'));
  app.use('/members', require('./members'));
  app.use('/accounts', require('./accounts'));
}
