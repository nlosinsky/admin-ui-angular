const dbController = require("../../db");
const { isWithinInterval, isDate } = require("date-fns");

exports.getTransactionsCount = (req, res) => {
  const db = dbController.readDB();
  const { companyId, userId, startDate, endDate } = req.query;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!isDate(start) || !isDate(end)) {
    return res.json([]);
  }

  const transactions = db.transactions.filter(transaction => {
    const isValidCompany = companyId ? transaction.companyId === companyId : true;
    const isValidUser = userId ? transaction.userId === userId : true;
    const isValidDate = isWithinInterval(new Date(transaction.date), { start, end });

    return isValidCompany && isValidUser && isValidDate;
  });

  res.json(transactions);
}
