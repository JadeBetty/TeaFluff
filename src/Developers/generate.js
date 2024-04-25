const { EmbedBuilder } = require("discord.js");
const UserSchema = require("../Schema/Users");

module.exports = {
  name: "generate",
  category: "Developers",
  description: "Generate a shortened url with an alias",
  devsOnly: true,
  deleteTrigger: true,
  run: async (client, message, args) => {
    const alias = args[0];
    const link = args[1];
    const key = args[2];

    if (!alias) {
      return message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("An error has occured")
              .setDescription("You must provide an alias"),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            msg.delete();
          }, 10000)
        );
    }

    if (alias.length > 10) {
      return message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("An error has occured")
              .setDescription("The alias is too long to be used"),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            msg.delete();
          }, 10000)
        );
    }

    if (!link) {
      return message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("An error has occured")
              .setDescription("You must provide a link."),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            msg.delete();
          }, 10000)
        );
    }
    console.log(link)
    if (!link.includes("https://") || link.includes("http://")) {
      return message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("An error has occured")
              .setDescription("Your link must contain http/https"),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            msg.delete();
          }, 10000)
        );
    }

    if (!key) {
        return message.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("An error has occured")
                .setDescription("You must provide a key."),
            ],
          })
          .then((msg) =>
            setTimeout(() => {
              msg.delete();
            }, 10000)
          );
      }

      if (key.length > 10) {
        return message.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("An error has occured")
                .setDescription("The key is too long"),
            ],
          })
          .then((msg) =>
            setTimeout(() => {
              msg.delete();
            }, 10000)
          );
      }


    const user = await UserSchema.findOne({ id: message.author.id });
    if(!user.key === key) {
        return message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("An error has occured")
              .setDescription("The key is not correct."),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            msg.delete();
          }, 10000)
        );
    }


    const request = await fetch("http://localhost:4321/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            alias: alias,
            key: key,
            link: link
        })
    });


    if(request.status == 200) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Your link has been shortened")
                .setDescription("Visit https://links.jadebetty.me/" + (await request.json()).shortlink + " to view your site.")
            ]
        })
    } else {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("An erro has occured")
                .setDescription("Error: " + (await request.json()).id)
            ]
        })
    }
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
