require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  AttachmentBuilder
} = require("discord.js");

const { randomInt } = require("crypto");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error(
    "Il manque une variable : DISCORD_TOKEN, CLIENT_ID ou GUILD_ID."
  );
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("generate")
    .setDescription("Génère des liens fictifs de test.")
    .addIntegerOption(option =>
      option
        .setName("nombre")
        .setDescription("Nombre de liens")
        .setMinValue(1)
        .setMaxValue(5000)
    )
    .addIntegerOption(option =>
      option
        .setName("longueur")
        .setDescription("Longueur du code")
        .setMinValue(4)
        .setMaxValue(64)
    ),

  new SlashCommandBuilder()
    .setName("test")
    .setDescription("Teste les liens générés."),

  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Affiche les statistiques."),

  new SlashCommandBuilder()
    .setName("export")
    .setDescription("Exporte les liens dans un fichier TXT."),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprime la génération actuelle."),

  new SlashCommandBuilder()
    .setName("auto")
    .setDescription("Envoie automatiquement 1 lien fictif par seconde."),

  new SlashCommandBuilder()
    .setName("stopauto")
    .setDescription("Arrête l'envoi automatique.")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log("Commandes enregistrées !");
}

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const sessions = new Map();
const autoIntervals = new Map();

function generateCode(length) {
  let code = "";

  for (let i = 0; i < length; i++) {
    code += alphabet[randomInt(alphabet.length)];
  }

  return code;
}

function generateLinks(number, length) {
  const links = [];
  const codes = new Set();

  while (links.length < number) {
    const code = generateCode(length);

    if (!codes.has(code)) {
      codes.add(code);

      // URL volontairement fictive et non fonctionnelle.
      links.push(`https://discord.gift/${code}`);
    }
  }

  return links;
}

client.once("ready", () => {
  console.log(`Bot connecté : ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  // =========================
  // GENERATE
  // =========================

  if (interaction.commandName === "generate") {
    const number = interaction.options.getInteger("nombre") || 100;
    const length = interaction.options.getInteger("longueur") || 16;

    const links = generateLinks(number, length);

    sessions.set(userId, links);

    const preview = links.slice(0, 10).join("\n");

    await interaction.reply(
      `✅ **${links.length} liens fictifs générés !**\n\n` +
      "```text\n" +
      preview +
      "\n```\n" +
      `Utilise \`/export\` pour récupérer toute la liste.`
    );
  }

  // =========================
  // TEST
  // =========================

  if (interaction.commandName === "test") {
    const links = sessions.get(userId);

    if (!links || links.length === 0) {
      return interaction.reply(
        "❌ Tu n'as encore rien généré. Utilise `/generate`."
      );
    }

    const codes = links.map(link => link.split("/").pop());
    const unique = new Set(codes);

    const valid = codes.filter(code =>
      /^[A-Za-z0-9]+$/.test(code)
    ).length;

    const duplicates = codes.length - unique.size;

    await interaction.reply(
      `### 🧪 Test terminé\n` +
      `Format valide : **${valid}/${links.length}**\n` +
      `Codes uniques : **${unique.size}/${links.length}**\n` +
      `Doublons : **${duplicates}**\n\n` +
      `ℹ️ Aucun vrai cadeau Discord n'est vérifié.`
    );
  }

  // =========================
  // STATS
  // =========================

  if (interaction.commandName === "stats") {
    const links = sessions.get(userId);

    if (!links || links.length === 0) {
      return interaction.reply("❌ Aucune génération.");
    }

    const codes = links.map(link => link.split("/").pop());

    await interaction.reply(
      `📊 **Statistiques**\n` +
      `Liens : **${links.length}**\n` +
      `Codes uniques : **${new Set(codes).size}**\n` +
      `Longueur : **${codes[0].length} caractères**`
    );
  }

  // =========================
  // EXPORT
  // =========================

  if (interaction.commandName === "export") {
    const links = sessions.get(userId);

    if (!links || links.length === 0) {
      return interaction.reply("❌ Aucune génération à exporter.");
    }

    const file = new AttachmentBuilder(
      Buffer.from(links.join("\n") + "\n", "utf8"),
      { name: "giftforge-links.txt" }
    );

    await interaction.reply({
      content: "📄 Voici ton fichier :",
      files: [file]
    });
  }

  // =========================
  // CLEAR
  // =========================

  if (interaction.commandName === "clear") {
    sessions.delete(userId);

    await interaction.reply("🗑️ Génération supprimée.");
  }

  // =========================
  // AUTO
  // =========================

  if (interaction.commandName === "auto") {
    if (autoIntervals.has(userId)) {
      return interaction.reply(
        "⚠️ L'auto est déjà activé."
      );
    }

    await interaction.reply(
      "▶️ **Auto activé !** 1 lien fictif par seconde."
    );

    const interval = setInterval(async () => {
      try {
        const code = generateCode(16);

        // URL volontairement fictive et non fonctionnelle.
        const link =
          `https://discord.gift/${code}`;

        await interaction.channel.send(link);
      } catch (error) {
        console.error("Erreur auto :", error);

        clearInterval(interval);
        autoIntervals.delete(userId);
      }
    }, 1000);

    autoIntervals.set(userId, interval);
  }

  // =========================
  // STOP AUTO
  // =========================

  if (interaction.commandName === "stopauto") {
    const interval = autoIntervals.get(userId);

    if (!interval) {
      return interaction.reply(
        "ℹ️ Aucun auto n'est actuellement actif."
      );
    }

    clearInterval(interval);
    autoIntervals.delete(userId);

    await interaction.reply(
      "⏹️ **Auto arrêté.**"
    );
  }
});

async function start() {
  await registerCommands();
  await client.login(TOKEN);
}

start();
