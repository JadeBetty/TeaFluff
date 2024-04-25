const { EmbedBuilder } = require("discord.js");
const UserSchema = require("../Schema/Users");
module.exports = {
  name: "key",
  category: "Developers",
  description: "Get a key",
  devsOnly: true,
  run: async (client, message, args) => {
    const user = await UserSchema.findOne({ id: message.author.id });
    if (user.key) {
        return message.author.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Key")
                .setDescription(
                  "Your key has been generated before, please visit click on the spoiler to get your key ||" +
                    user.key +
                    "||"
                ),
            ],
          });
    }
    const m = await message.reply({
      embeds: [new EmbedBuilder().setTitle("Generating key...")],
    });
    const key = generateKey();

    await user.updateOne({ key: key });

    m.delete();

    message.author.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Key")
          .setDescription(
            "Your key has been generated, please visit click on the spoiler to get your key ||" +
              key +
              "||"
          ),
      ],
    });
  },
};

function generateKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
