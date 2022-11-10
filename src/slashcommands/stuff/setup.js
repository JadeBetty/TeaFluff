const { SlashCommandBuilder, EmbedBuilder, Client, PermissionFlagsBits, ChannelType } = require('discord.js');
module.exports = {
   
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up mod mail')
        .addChannelOption(option =>
            option.setName('modmail')
                .setDescription('Mod Mail Category')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Logs channel")
                .setRequired(true)
             
                
        )
        .addStringOption(option => option
            .setName("guild")
            .setDescription("Guild Id")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async run(client, interaction) {
        let modmailCat = await interaction.options.getChannel('modmail')
        let channel = await interaction.options.getChannel("channel");
        let guildId = await interaction.options.getString("guild")
        let guild = client.guilds.cache.get(guildId)
        if(!guild) return interaction.reply({content: "Guild doesnt exist or wrong guild ID", ephemeral: true }) 
        console.log(modmailCat)

    }
}