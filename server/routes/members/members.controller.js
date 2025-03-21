const dbController = require("../../db");

exports.getApprovedMembers = (req, res) => {
  const db = dbController.readDB();
  const { companyId, offset, limit } = req.query;
  const start = parseInt(offset, 10) || 0;
  const end = parseInt(limit, 10) || 100;

  let members = db.members.filter(member => {
    return member.companyId === companyId
      && member.accountState !== 'WAIT_APPROVAL'
      && member.accountState !== 'DECLINED'
  }).slice(start, end);

  res.json(members);
}

exports.getPendingMembers = (req, res) => {
  const db = dbController.readDB();
  const { companyId, offset, limit } = req.query;
  const start = parseInt(offset, 10) || 0;
  const end = parseInt(limit, 10) || 100;

  let members = db.members.filter(member => {
    return member.companyId === companyId
      && member.accountState === 'WAIT_APPROVAL'
  }).slice(start, end);

  res.json(members);
}

exports.updateMember = (req, res) => {
  const db = dbController.readDB();
  const members = db.members;
  const index = members.findIndex(member => member.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  db.members[index] = { ...members[index], ...req.body };
  dbController.writeDB(db);
  res.json(db.members[index]);
}

exports.getMember = (req, res) => {
  const db = dbController.readDB();
  const member = db.members.find(member => member.id === req.params.id);

  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  res.json(member);
}
