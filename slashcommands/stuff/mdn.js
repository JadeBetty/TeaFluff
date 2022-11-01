const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mdn')
        .setDescription('Mdn Search Command')
        .addStringOption(option => 
            option.setName('topic')
            .setDescription("mdn topic")
            .setRequired(true)
        ),
    async run(client, interaction) {
        const query = interaction.options.getString('topic');
        const URI = `https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(
            query,
          )}&locale=en-US`;

          const documents = (await axios(URI)).data.documents;

          if (!documents) {
            return interaction.reply({
              embeds: [
                {
                  title: `No results found for "${query}"`,
                  color: 'RED',
                  timestamp: new Date(),
                },
              ],
            });
          }
      
          const mdnEmbed = new EmbedBuilder()
            .setAuthor({
              name: 'MDN documentation',
              iconURL: 'https://avatars.githubusercontent.com/u/7565578?s=200&v=4',
            })
            .setColor('Purple');
      
          let overflow = false;
      
          if (documents.length > 3) {
            documents.length = 3;
            overflow = true;
          }
      
          for (let {mdn_url, title, summary} of documents) {
            summary = summary.replace(/(\r\n|\n|\r)/gm, '');
      mdnEmbed.addFields(
          {name: title, value: `${summary}\n[**Link**](https://developer.mozilla.org/${mdn_url})`}
      )
      
      
          }
      
          if (overflow) {
              mdnEmbed.addFields(
                  {name: `Too many results!`, value: `Visit more results [here!](https://developer.mosilla.org/en-US/search?q=${encodeURIComponent(query)})`}
              )
              /*
            mdnEmbed.addField(
              'Too many results!',
              `Visit more results [here!](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(
                query,
              )})`,
            ); */
          }

          interaction.reply({embeds: [mdnEmbed]})

    }
}