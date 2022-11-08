const {
    EmbedBuilder,
} = require("discord.js")
module.exports = {
    name: "snipe",
    category: "Moderation",
    description: "Snipe a message",
 //   deleteTrigger: true,
    run: async(client, message, args) => {
        const channel =
        message.mentions?.channels?.first() ??
        message.guild?.channels?.cache?.get(args[0]) ??
        message.channel;
       // console.log(client)
     const snipes = client.snipes.get(channel.id);
      let eSnipe = client.eSnipe.get(channel.id);
      if (!snipes && !eSnipe)
        return message.channel.send(`Nothing to snipe in ${channel}`);
      // Check for the snipe in eSnipe
      let embeds;

      if (snipes) {
        let content = snipes?.message ? `\`${snipes?.message}\`` : '`No content`';
      //  console.log(new Date(snipes.time).toUTCString)
        const embed = new EmbedBuilder()
          .setTitle(`🔫 Snipe in ${channel.name}`)
          .setColor('Yellow')
          .setDescription(`*Content:*\n${content}`)
          .setAuthor({
            name: `${snipes.author?.tag}`,
            iconURL: snipes.author?.displayAvatarURL() ?? null,
          })
          .setImage(snipes.attachment ?? null)
          .addFields(
            {name: `Time`, value: `${new Date(snipes.time).toUTCString()}`}
          )
       //   .addField('Time', `${new Date(snipes.time).toUTCString()}`);
  message.channel.send({embeds: [embed]})
        
          }
          if (eSnipe) {
            // Create a description that'll be formatted in **Current Content:**\n ${content}\n\n **Previous Content:**\n ${eSnipe.prevs.content}
            let description = `**Current Content:**\n ${eSnipe.currs}\n\n **Previous Content:**\n ${eSnipe.prevs}`;
            // Create the embed
            const embed = new EmbedBuilder()
              .setTitle(`🔫 Edit Snipe in ${channel.name}`)
              .setColor('Yellow')
              .setDescription(description)
              .setAuthor({
                name: `${eSnipe.author?.tag}`,
                iconURL: eSnipe.author?.displayAvatarURL() ?? null,
              })
              .addFields(
                {name: `Time`, value: `${new Date(eSnipe.time).toUTCString()}`}
              )
            // Send the embed
           // embeds.push(embed);
           message.channel.send({
            embeds: [embed]
          });
          }

    }
}