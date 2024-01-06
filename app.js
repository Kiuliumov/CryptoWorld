const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const fs = require("fs");
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
function loadServerConfigs() {
  try {
    const data = fs.readFileSync(configFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading server configs:", error.message);
    return {};
  }
}
function saveServerConfigs(configs) {
  try {
    fs.writeFileSync(configFile, JSON.stringify(configs, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving server configs:", error.message);
  }
}
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", () => {
  console.log(`${client.user.tag} is ready!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }

 else if (commandName == "setup") {
    console.log("Processing setup command...");
    const serverId = interaction.guildId;
    const configs = loadServerConfigs();
    await interaction.reply(
      "Mention the channel where you want to receive crypto news."
    );
    const filter = (message) => message.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 30000,
    });
    collector.on("collect", (message) => {
      const mentionedChannel = message.mentions.channels.first();
      if (mentionedChannel) {
        configs[serverId] = { newsChannelId: mentionedChannel.id };
        saveServerConfigs(configs);
        interaction.followUp(`Crypto news will be sent to ${mentionedChannel}`);
      } else {
        interaction.followUp("Invalid channel mentioned. Setup canceled.");
      }
      collector.stop();
    });
  }
});
client.login(TOKEN);
