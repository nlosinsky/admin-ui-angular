const fs = require('node:fs');

const DB_PATH = __dirname + '/db.json';
const COUNTRIES_PATH = __dirname + '/countries.json';

// Helper: Read DB
exports.readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Helper: Write DB
exports.writeDB = (data) =>{
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

exports.readCountries = () => {
  const data = fs.readFileSync(COUNTRIES_PATH, 'utf8');
  return JSON.parse(data);
}
