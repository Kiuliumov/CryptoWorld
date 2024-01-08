const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Information about CryptoWorld"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setAuthor({name:'Kiuliumov',iconURL:'https://i.imgur.com/DfaHV39.jpg'})
            .setTitle('Info')
            .setDescription('CryptoWorld is a crypto news Discord application, entirely open source and free to use!')
            .addFields(
                { name: 'About me:', value: "Based in :flag_bg: \n I've been a freelance JS/Python developer since 2021 and I've built many Discord web apps" },
                { name: 'About CryptoWorld:', value: 'The main goal of CryptoWorld is to provide an easy way to get a built-in Discord crypto news app that can also provide data for all crypto currencies available.' },
                { name: 'Contact me:', value: 'Email: ikiuliumov@gmail.com' },
                { name: 'Support Server:', value: '[Join Here](https://discord.gg/grPQ8M9PK8)' },
                { name: 'GitHub Repository:', value: '[GitHub Repository](https://github.com/Kiuliumov/CryptoWorld)' },
                { name: 'How to use:', value: 'CryptoNews: Just use /setup in the channel you want the news to be sent to and enjoy\n Crypto Info: Use /crypto and specify which crypto currency you want the data for.' }

            )
            .setImage('https://i.imgur.com/VEVHxxl.jpeg')
            .setFooter({text:'CryptoWorld'});

        interaction.reply({ embeds: [embed] });
    }
};
