const dbController = require("../../db");

exports.getCountries = (req, res) => {
  const countries = dbController.readCountries();

  res.json(countries);
}

