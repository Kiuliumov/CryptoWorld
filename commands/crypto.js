const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const currentDate = new Date();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crypto")
    .setDescription("Get info for a specific cryptocurrency")
    .addStringOption(option =>
      option.setName("currency")
        .setDescription("The name of the cryptocurrency")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const currencyName = interaction.options.getString("currency");

      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "eur",
            order: "market_cap_desc",
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        }
      );

      const data = response.data;
      const selectedCurrency = data.find(currency => currency.name.toLowerCase() === currencyName.toLowerCase());

      if (!selectedCurrency) {
        return interaction.reply("The provided cryptocurrency name is not valid.");
      }

      const embed = new EmbedBuilder()
        .setTitle(`${selectedCurrency.name} Information`)
        .setDescription(`As of ${currentDate.toUTCString()}`)
        .addFields(
          { name: "Rank", value: `${selectedCurrency.market_cap_rank}`, inline: true },
          { name: "Price", value: `${selectedCurrency.current_price} EUR`, inline: true },
          { name: "Market Cap", value: `${selectedCurrency.market_cap} EUR`, inline: true },
          { name: "24h Change", value: `${selectedCurrency.price_change_24h} EUR`, inline: true },
          { name: "Total Volume", value: `${selectedCurrency.total_volume} EUR`, inline: true }
        )
        .setImage(selectedCurrency.image);

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Error fetching cryptocurrency prices:", error.message);
      await interaction.reply(
        "An error occurred while fetching cryptocurrency prices."
      );
    }
  },
};
