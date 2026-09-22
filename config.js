require('dotenv').config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  ownerIds: (process.env.OWNER_IDS || '').split(',').map(id => id.trim()).filter(Boolean),
  colors: {
    primary: 0x5865F2,
    success: 0x57F287,
    error: 0xED4245,
    warning: 0xFEE75C,
    premium: 0xFFD700
  }
};
