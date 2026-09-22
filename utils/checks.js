const config = require('../config');

function isOwner(userId) {
  return config.ownerIds.includes(userId);
}

module.exports = { isOwner };
