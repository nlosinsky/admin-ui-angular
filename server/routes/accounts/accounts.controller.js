const dbController = require("../../db");
const crypto = require('node:crypto')

exports.getAccounts = (req, res) => {
  const db = dbController.readDB();
  const { offset, limit, companyId } = req.query;
  const start = parseInt(offset, 10) || 0;
  const end = parseInt(limit, 10) || 100;
  let accounts = db.accounts;

  if (companyId) {
    accounts = accounts.filter(account => account.companyId === companyId);
  }

  accounts = accounts.slice(start, end)
    .sort((a, b) => a.name.localeCompare(b.name))

  res.json(accounts);
}

exports.addAccount = (req, res) => {
  const db = dbController.readDB();

  const newAccount = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...req.body
  };

  db.accounts.push(newAccount);

  dbController.writeDB(db);

  res.status(201).json(newAccount);
}
