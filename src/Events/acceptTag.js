const tags = require("../schema/tag");
const { tagsCache } = require("../utils/Cache");
const { tagslogs, guildId } = require("../../config.json")
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  event: "interactionCreate",
  async run(interaction) {
    const client = require("..");
    let guild = await client.guilds.cache.get(guildId)
    const logsChannel = guild.channels.cache.get(tagslogs);

    if (!interaction.isButton()) return;
    // If the interaction's customId doesn't start with a or d return
    if (
      !interaction.customId.startsWith("a") &&
      !interaction.customId.startsWith("d")
    )
      return;
    // Make sure that the user has KICK_MEMBERS permission
    await interaction.deferReply({
      ephemeral: true,
    });
    let [enable, id] = interaction.customId.split("-");
    // From the tagCache (a map) find a tag in values by checking _id which is a mongoose object id
    let tag = Array.from(tagsCache.values()).find(
      (tag) => tag._id?.valueOf() === id
    );
    // If the tag is not found, return
    if (!tag) return await interaction.editReply("Tag not found");
    if (
      !interaction.message.member.permissions.has(
        PermissionFlagsBits.KickMembers
      )
    ) {
      return interaction.editReply("You don't have permission to do this!")
    }
    if (tag.enabled) {
      return interaction.editReply("Tag is already accepted");
    }
    if (enable === "a") {
      // If the first value is a a, accept the tag by enabling it
      tag.enabled = true;
      tag.verifiedAt = new Date();
      tag.verifiedBy = interaction.member.id;
      tagsCache.set(tag.name, tag);
      let embed = new EmbedBuilder()
        .setColor("#36393F")
        .setTitle("Tag Accepted")
        .setDescription(
          `Tag **${tag.name}** was accepted by <@${interaction.member.id}>`
        )
        .addFields(
          { name: `Tag`, value: tag.name },
          { name: `Verified at`, value: tag.verifiedAt.toString() },
        )
        .setTimestamp()
      await interaction.editReply({
        embeds: [embed],
        components: []
      });
      let embed2 = new EmbedBuilder()
        .setColor("36393F")
        .setTitle("A Tag Was Accepted")
        .setDescription(
          `**Accepted By:** ${interaction.member} || |${tag.verifiedBy
          }|\n**Tag Name:** ${tag.name
          }\n**Accepted At:** ${tag.verifiedAt.toString()}`
        );

      await logsChannel.send({ embeds: [embed2] });
      let owner = client.users.cache.get(tag.owner);
      if (owner) {
        owner
          .send({
            embeds: [embed],
          })
          .catch(() => { });
      }
      // Find the tag in the database and update it
      tags.findById(id).then((tag) => {
        tag.enabled = true;
        tag.verifiedAt = new Date();
        tag.verifiedBy = interaction.member.id;
        tag.save();
      });
      // Delete the interaction message
      interaction.message.delete();


    } else if (enable === "d") {
      tagsCache.delete(tag.name);
      let embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Tag denied")
        .setDescription(
          `Tag **${tag.name}** was denied by <@${interaction.member.id}>`
        )
        .addFields(
          { name: `Tag`, value: tag.name }
        )
      await interaction.editReply({
        embeds: [embed],
        components: []

      })

      let embed2 = new EmbedBuilder()
        .setColor("36393F")
        .setTitle("A Tag Was Denied")
        .setDescription(
          `**Denied By:** ${interaction.member} || |${interaction.member.id
          }|\n**Tag Name:** ${tag.name
          }\n**Denied At:** ${new Date().toString()}`
        );
      await logsChannel.send({ embeds: [embed2] });

      // Send the message the tag owner
      let owner = client.users.cache.get(tag.owner);
      if (owner) {
        owner
          .send({
            embeds: [embed],
          })
          .catch(() => { });
      }
      await tags.findByIdAndDelete(id);
      await interaction.message.delete();

    }
  }
}