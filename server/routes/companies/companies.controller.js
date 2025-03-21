const dbController = require("../../db");

exports.getCompanies = (req, res) => {
  const db = dbController.readDB();
  const { offset, limit, companyState } = req.query;
  const start = parseInt(offset, 10) || 0;
  const end = parseInt(limit, 10) || 100;
  let companies = db.companies;

  if (companyState) {
    companies = companies.filter(company => company.companyState === companyState);
  }

  companies = companies.slice(start, end)
    .sort((a, b) => a.name.localeCompare(b.name))

  res.json(companies);
}

exports.updateCompany = (req, res) => {
  const db = dbController.readDB();
  const companies = db.companies;
  const index = companies.findIndex(company => company.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Company not found' });
  }

  db.companies[index] = { ...companies[index], ...req.body };
  dbController.writeDB(db);
  res.json(db.companies[index]);
}

exports.getCompany = (req, res) => {
  const db = dbController.readDB();
  const company = db.companies.find(company => company.id === req.params.id);

  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  res.json(company);
}
