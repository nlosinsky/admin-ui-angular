const dbController = require('../../db');

exports.getDocuments = (req, res) => {
  const db = dbController.readDB();
  res.json(db.documents);
}
