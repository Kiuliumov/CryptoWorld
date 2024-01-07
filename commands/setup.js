const { SlashCommandBuilder } = require("@discordjs/builders");
const { promises: fsPromises, existsSync } = require("fs");

const configFile = "serverConfigs.json";

async function loadServerConfigs() {
  if (existsSync(configFile)) {
    try {
      const data = await fsPromises.readFile(configFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading server configs:", error.message);
      return {};
    }
  } else {
    return {};
  }
}

async function saveServerConfigs(configs) {
  try {
    await fsPromises.writeFile(
      configFile,
      JSON.stringify(configs, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Error saving server configs:", error.message);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up the channel for receiving crypto news"),

  async execute(interaction) {
    const serverId = interaction.guildId;
    const configs = await loadServerConfigs();

    const channelId = interaction.channelId;
    if (interaction.guild.channels.cache.has(channelId)) {
      const channel = interaction.guild.channels.cache.get(channelId);
      configs[serverId] = { newsChannelId: channelId };
      await saveServerConfigs(configs);
      interaction.reply({
        content: `Crypto news will be sent to the channel ${channel}.`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content:
          "Invalid channel ID or the channel does not exist. Setup canceled.",
        ephemeral: true,
      });
    }
  },
};
