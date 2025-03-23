const dbController = require("../../db");
const { isDate, isWithinInterval } = require("date-fns");

exports.getCurrentUser = (req, res) => {
  const { users } = dbController.readDB();
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'No auth user' });
  }

  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'No found user data' });
  }

  res.json(user);
}
