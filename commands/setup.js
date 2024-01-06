const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const configFile = 'serverConfigs.json';

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up the channel for receiving crypto news"),
  async execute(interaction) {
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
  },
};