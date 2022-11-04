const { webhookURL } = require("../config.json")
const { EmbedBuilder, WebhookClient} = require("discord.js")
module.exports = {
    event: "messageDelete",
     run: async (message, client) => {
        if (message.author?.bot) return;

        let deletedLogEmbed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("A message has been deleted!")
          .setDescription(
            `**Deleted Message:**\n ${
              message.content ? message.content : "None"
            }`.slice(0, 4096)
          )
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
          })
          .addFields({ name: "Channel", value: `${message.channel}` })
          .setFooter({
            text: `User ID: ${message.author.id}`,
            iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
          });
    
        if (message.attachments.size >= 1) {
          deletedLogEmbed.addFields({name: `Attachments:`, value: `${message.attachments.map((a) => a.url)}`, inline: true}
          );
        }
    
        const deleteLogger = new WebhookClient({
          url: messageWebHookURL,
        });
    
        await deleteLogger.send({ embeds: [deletedLogEmbed] });
     }
}