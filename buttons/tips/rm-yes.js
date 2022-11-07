const tipsSchema = require('../../schema/tip');
const tipsCmd = require('../.././Commands/adminFunc/tip');

module.exports = {
  id: 'rm-yes',
  run: async (client, interaction) => {
    console.log("it work")
    tipsSchema.findOneAndDelete(
      {
        _id: tipsCmd.tipId,
      },
      async (err, data) => {
        console.log(data)
        if (err) throw err;
        if (data) {
          return interaction.message.edit({
            embeds: [
              {
                title: 'Tip Removed!',
                description: `Tip **${
                  data.tip
                }** has been removed!\n\n**Tip ID:** ${
                  data._id
                }\n**Author:** ${interaction.guild.members.cache.get(
                  data.authorId,
                )} | ||${data.authorId}||\n**Deleted by:** ${
                  interaction.member
                } | ||${interaction.member.id}||`,
                color: client.config.colors.success,
              },
            ],
            components: [],
          });
        }
      },
    );
  },
};
