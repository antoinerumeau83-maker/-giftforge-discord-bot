# 🤖 Super Bot Discord

Bot Discord complet en **discord.js v14** : jeux interactifs, modération, système premium, bienvenue automatique, panel de configuration, commandes owner.

## 📦 Installation

1. Installe [Node.js 18+](https://nodejs.org)
2. Dans le dossier du bot :
   ```
   npm install
   ```
3. Copie `.env.example` en `.env` et remplis :
   - `TOKEN` : le token de ton bot (portail développeur Discord → Bot → Reset Token)
   - `CLIENT_ID` : l'ID de ton application (portail développeur → General Information → Application ID)
   - `OWNER_IDS` : ton ID Discord (active le mode développeur dans Discord pour le copier), plusieurs IDs séparés par une virgule
4. Sur le portail développeur Discord, active les **Privileged Gateway Intents** : `Server Members Intent` et `Message Content Intent`.
5. Lance le bot :
   ```
   npm start
   ```
   Les commandes slash se déploient automatiquement au démarrage (peut prendre jusqu'à 1h pour apparaître globalement la première fois, mais généralement instantané).

## 🗂️ Structure

```
bot/
  index.js              → point d'entrée, charge tout dynamiquement
  config.js              → variables d'environnement
  database/db.js         → base de données JSON (premium, bienvenue, warns)
  events/                → ready, interactionCreate, guildMemberAdd/Remove
  commands/
    utility/    (7)  → ping, userinfo, serverinfo, avatar, invite, poll, help
    fun/        (7)  → coinflip, dice, 8ball, rps, tictactoe, guessnumber, trivia
    moderation/ (8)  → kick, ban, unban, timeout, untimeout, warn, warnings, clear
    config/     (4)  → setwelcome, welcometest, setlog, panel
    premium/    (2)  → premium-status, customembed
    owner/      (8)  → eval, addpremium, removepremium, premiumlist, broadcast, botstats, reload, shutdown
```

## ➕ Ajouter tes propres commandes

Crée un fichier `.js` dans le sous-dossier de catégorie voulu :

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('exemple').setDescription('Ma commande'),
  // ownerOnly: true,      // optionnel : réserve la commande au(x) owner(s)
  // premiumOnly: true,    // optionnel : réserve la commande aux serveurs premium
  // cooldown: 5,          // optionnel : cooldown en secondes (défaut 3)
  async execute(interaction, client) {
    await interaction.reply('Salut !');
  }
};
```

Redémarre le bot (ou utilise `/reload` en tant que owner) : la commande est automatiquement détectée et enregistrée. Aucune autre modification nécessaire.

## ⭐ Système Premium

- `/addpremium id_serveur:<ID> jours:<optionnel>` (owner) active le premium sur un serveur.
- Les commandes marquées `premiumOnly: true` sont automatiquement bloquées pour les serveurs non premium.
- `/premium-status` permet à n'importe qui de voir le statut du serveur.

## 👋 Bienvenue automatique

- `/setwelcome activer salon:#bienvenue` puis `/setwelcome message texte:...`
- Variables disponibles : `{user}` (mention), `{username}`, `{server}`, `{count}`
- `/panel` ouvre une interface graphique (boutons + menu + formulaire) pour tout configurer sans taper de commande.

## ⚠️ Limites volontaires

Ce bot fournit ~36 commandes **réellement fonctionnelles et testables**, pas 1500 commandes creuses. L'architecture (chargement dynamique) te permet d'en ajouter autant que tu veux toi-même en suivant le modèle ci-dessus.
