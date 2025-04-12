const dbController = require("../../db");

exports.getCurrentUser = (req, res) => {
  const { users } = dbController.readDB();
  const userId = req.user?.id;
  // todo fix
  res.json({
    firstName: 'test'
  })

  // if (!userId) {
  //   return res.status(401).json({ message: 'No auth user' });
  // }
  //
  // const user = users.find(user => user.id === userId);
  //
  // if (!user) {
  //   return res.status(404).json({ message: 'No found user data' });
  // }

  // res.json(user);
  // todo fix
  // res.send('Success')
}
