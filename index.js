const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');
const config = require('./config');

if (!config.token || !config.clientId) {
  console.error('❌ TOKEN ou CLIENT_ID manquant dans .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.cooldowns = new Collection();

function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const categories = fs.readdirSync(commandsPath);
  const commandsJSON = [];
  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      delete require.cache[require.resolve(path.join(categoryPath, file))];
      const command = require(path.join(categoryPath, file));
      if (!command?.data || !command?.execute) { console.warn(`⚠️ Ignorée: ${category}/${file}`); continue; }
      command.category = category;
      client.commands.set(command.data.name, command);
      commandsJSON.push(command.data.toJSON());
    }
  }
  return commandsJSON;
}

const commandsJSON = loadCommands();
client.reloadCommands = loadCommands;

const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(config.token);
  try {
    console.log(`🚀 Déploiement de ${commandsJSON.length} commandes...`);
    await rest.put(Routes.applicationCommands(config.clientId), { body: commandsJSON });
    console.log('✅ Commandes déployées.');
  } catch (err) { console.error('❌ Erreur déploiement:', err); }
}

client.once('ready', () => deployCommands());
client.login(config.token);
