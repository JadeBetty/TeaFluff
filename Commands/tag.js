const Discord = require("discord.js");
const TagSchema = require("../schema/tag.js")
const {tagsCache} = require("../utils/Cache")
module.exports = {
    name: "tag",
    description: "Tag System",
    run: async (client, message, args) => {
        if(!args[0]) {
            return message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(
                        "Please use the following format! \n `tag <tagname/create/edit/delete> [tagname] [content]`"
                        )
                        .setTimestamp()
                        .setColor("Red")
                ]
            })

        }
        if(!args[0] === "create") {
            if(!args[1] || !args[2]) {
                return message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setTitle("Invalid Usage!")
                        .setColor("Red")
                        .setDescription(
                            "Please use the following format! \n `tag <tagname/create/edit/delete> [tagname] [content]`"
                            )
                            .setTimestamp(),
                    ]
                })
            }
         
        let tagA = tagsCache.get(args[1])
        if(tagA) {
            if(!tagA.enabled) {
                return message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setTitle("Invalid Usage!")
                        .setDescription(
                            "This tag is already subbmitted for verification, If the verification gets defined you can try to re-create a new tag"
                        )
                        .setColor("Red")
                        .setTimestamp()
                    ]
                })
            }
            return message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(
                        "This tag name you provided is already in use, Please choose another one"
                    )
                    .setColor("Red")

                ]
            })
        }
        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                .setTitle("Tag Submmited!")
                .setDescription(
                    `The tag **${args[1]}** have been create & submmited for verification.`
                )
            ]
        })
        let tag = await TagSchema.create({
            name: args[1],
            content: args.slice(2).join(" "),
            owner: message.author.id,
            createdAt: new Date().toISOString(),
            guild: message.guild.id,
            enabled: false,
        })
        let id = tag._id.valueOf();
        client.channels.fetch('1033190983388635136').then(channel => {
            let newTagEmbed = new Discord.EmbedBuilder()
            .setTitle("New Tag Submission")
            .setDescription(
                tag.content > 2048 ? tag.content.slice(0, 2048) : tag.content,
            )
            .setColor("Gold")
            .addFields(
                {name: `Tag name`, value: tag.name},
                {name: `Tag ID`, value: tag.id},
                {name: `Guild`, value: message.guild.name},
                {name: `Owner`, value: message.author.toString()}

            )
            channel.send({
                embeds: [newTagEmbed],
                components: [
                  new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                      .setCustomId('a-' + id)
                      .setLabel('Accept')
                      .setStyle(Discord.ButtonStyle.Success),
                    new Discord.ButtonBuilder()
                      .setCustomId('d-' + id)
                      .setLabel('Deny')
                      .setStyle(Discord.ButtonStyle.Danger),
                  ),
                ],
              });
        })
        return tagsCache.set(args[1], {
            name: args[1],
            content: args.slice(2).join(" "),
            owner: message.author.id,
            createdAt: new Date(),
            guild: message.guild.id,
            enabled: false,
            _id: tag._id,
        })
        }
        if(args[0] === "delete") {
            if(!args[1]){
                return message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setTitle("Invalid Usage!")
                        .setDescription(
                            'Please use the following format!\n `tag <tagName/create/delete/edit> [tagName] [content]`',
                        )
                    ]
                })
            }
            let delTag = tagsCache.get(args[1]);
            if (!delTag || !delTag.enabled) {
              return message.channel.send({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setTitle('Invalid Usage!')
                    .setDescription(
                      'The tag you provided does not exist, please try again.',
                    ),
                ],
              });
            }
      
            if (delTag.guild !== message.guild.id) {
              return message.channel.send({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setTitle('Invalid Usage!')
                    .setDescription(
                      'The tag you provided is not in this server, please try again.',
                    ),
                ],
              });
            }
            if (
                message.member.permissions.has('MANAGE_MESSAGES') ||
                devs.includes(message.member.id) ||
                message.author.id === message.guild.ownerId
              ) {
                TagSchema.deleteOne({
                  name: args[1],
                }).exec();
                tagsCache.delete(args[1]);
                return message.channel.send({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle('Tag Deleted!')
                      .setDescription(`The tag **${args[1]}** has been deleted.`),
                  ],
                });
              }
              if (delTag.owner !== message.author.id) {
                return message.channel.send({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle('Invalid Usage!')
                      .setDescription(
                        'You are not the owner of this tag, please try again.',
                      ),
                  ],
                });
              }
              TagSchema.deleteOne({
                name: args[1],
              }).exec();
              tagsCache.delete(args[1]);
              return message.channel.send({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setTitle('Tag Deleted!')
                    .setDescription(`The tag **${args[1]}** has been deleted.`),
                ],
              });
            }
        

        }
    }