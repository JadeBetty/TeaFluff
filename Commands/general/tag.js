const Discord = require("discord.js");
const { tagslogs, guildId } = require("../../config.json")
const TagSchema = require("../../schema/tag.js")
const { tagsCache } = require("../../utils/Cache")
const tags = require("../../schema/tag");
module.exports = {
    name: "tag",
    description: "Tag System",
    category: 'Help',
    run: async (client, message, args) => {
      //console.log(tagsCache.values())
      let guild = await client.guilds.cache.get(guildId)
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
        if(args[0] === "create") {
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
                .setColor("Green")
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
        client.channels.fetch(tagslogs).then(async channel => {
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
           let msg = await channel.send({
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
              let collector = msg.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button
              })
              collector.on('collect', async c => {
                let [enable, id] = c.customId.split("-")
                let tag = Array.from(tagsCache.values()).find(
                  (tag) => tag._id?.valueOf() === id
                )
  
                if(!tag) {
                  return c.update("Tag not found")
                }
                if (tag.enabled) {
                  return c.update("Tag is already accepted");
                }
                if(
                  !c.member.permissions.has(
                    Discord.PermissionFlagsBits.KickMembers
                  )
                ) {
                  return message.channel.send("You don't have permission to do this!")
                }
                if(enable === `a`) {
                  tag.enabled = true;
                  tag.verifiedAt = new Date();
                  tag.verifiedBy = message.member.id;
                  tagsCache.set(tag.name, tag);
                  c.update({
                    embeds: [
                      new Discord.EmbedBuilder()
                      .setColor("#36393F")
                      .setTitle("Tag Accepted")
                      .setDescription(
                        `Tag **${tag.name}** was accepted by <@${message.member.id}>`
                      )
                      .addFields(
                        {name: `Tag`, value: tag.name },
                        { name: `Verified at`, value: tag.verifiedAt.toString() },
                      )
                      .setTimestamp()
                    ],
                    components: []
                  })
                  let embed2 = new Discord.EmbedBuilder()
                  .setColor("36393F")
                  .setTitle("A Tag Was Accepted")
                  .setDescription(
                    `**Accepted By:** ${message.member} || |${
                      tag.verifiedBy
                    }|\n**Tag Name:** ${
                      tag.name
                    }\n**Accepted At:** ${tag.verifiedAt.toString()}`
                  );
                  
                  guild.channels.cache.get(tagslogs).send({ embeds: [embed2] });
                let owner = client.users.cache.get(tag.owner);
                if (owner) {
                  owner
                    .send({
                      embeds: [
                        new Discord.EmbedBuilder()
                        .setColor("#36393F")
                        .setTitle("Tag Accepted")
                        .setDescription(
                          `Tag **${tag.name}** was accepted by <@${message.member.id}>`
                        )
                        .addFields(
                          {name: `Tag`, value: tag.name },
                          { name: `Verified at`, value: tag.verifiedAt.toString() },
                        )
                        .setTimestamp()
                      ],
                    })
                    .catch(() => {});
                }
                tags.findById(id).then(async (tag)  => {
                  tag.enabled = true;
                  tag.verifiedAt = new Date();
                  tag.verifiedBy = message.member.id;
                 await tag.save();
                });
                 
                } else if(enable === "d")      {
                  tagsCache.delete(tag.name);
                  let embed = new Discord.EmbedBuilder()
                  .setColor("Red")
                  .setTitle("Tag denied")
                  .setDescription(
                    `Tag **${tag.name}** was denied by <@${message.member.id}>`
                  )
                  .addFields(
                    {name: `Tag`, value: tag.name}
                  )
                  c.update({
                    embeds: [embed],

                  })

                  let embed2 = new Discord.EmbedBuilder()
                  .setColor("36393F")
                  .setTitle("A Tag Was Denied")
                  .setDescription(
                    `**Denied By:** ${message.member} || |${
                      message.member.id
                    }|\n**Tag Name:** ${
                      tag.name
                    }\n**Denied At:** ${new Date().toString()}`
                  );
                
                  guild.channels.cache.get(tagslogs).send({ embeds: [embed2] });
                  let owner = client.users.cache.get(tag.owner);
                  if (owner) {
                    owner
                      .send({
                        embeds: [embed],
                      })
                      .catch(() => {});
                  }
                  await tags.findByIdAndDelete(id);
                }
              })
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
                message.member.permissions.has('ManageMessages') ||
                devs.includes(message.member.id) ||
                message.author.id === message.guild.ownerId
              ) {
                TagSchema.deleteOne({
                  name: args[1],
                }).exec();
    
              console.log(TagSchema)
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

              if (args[0] === 'edit') {
                if (!args[1] || !args[2]) {
                  return message.channel.send({
                    embeds: [
                      new Discord.EmbedBuilder()
                        .setTitle('Invalid Usage!')
                        .setDescription(
                          'Please use the following format!\n `tag <tagName/create/delete/edit> [tagName] [content]`',
                        ),
                    ],
                  });
                }
                // If the tag is not in the database, return an error
                if (!(await TagSchema.findOne({name: args[1], enabled: true}).exec())) {
                  return message.channel.send({
                    embeds: [
                      new Discord.EmbedBuilder()
                        .setTitle('Invalid Usage!')
                        .setColor('Red')
                        .setDescription(
                          'The tag you provided is not in the database, please check the tag name.',
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
            if (
              await TagSchema.findOne({
                name: args[1],
                owner: message.author.id,
                guild: message.guild.id,
                enabled: true,
              }).exec()
            ) {
              // edit from cache
              tagsCache.set(args[1], {
                name: args[1],
                content: args.slice(2).join(' '),
                owner: message.author.id,
                createdAt: new Date().toISOString(),
                guild: message.guild.id,
              });
              await TagSchema.updateOne(
                {name: args[1]},
                {
                  $set: {
                    content: args.slice(2).join(' '),
                  },
                },
              ).exec();
              return message.channel.send({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setTitle('Tag Edited!')
                    .setDescription(`The tag **${args[1]}** has been edited.`),
                ],
              });
            } else {
              return message.channel.send({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setTitle('Invalid Usage!')
                    .setDescription(
                      "You don't have permission to edit this tag, please contact the owner of the tag.",
                    ),
                ],
              });
            }
          }

          if (args[0] === 'list') {
            const tagsArr = Array.from(
              require('../../utils/Cache').tagsCache.values(),
            )
              .map(a => a.name)
              .join('\n');
              let tagsFile = new Discord.AttachmentBuilder(
                Buffer.from(tagsArr, 'utf-8'), {name: `tags.txt`}
              );

            return message.reply({
              files: [tagsFile],
              // embeds: [
              // 	{
              // 		title: "Tags list for " + message.guild.name,
              // 		description: tagsArr,
              // 		footer: {
              // 			text: "use tags via -<tagname>",
              // 			icon_url: message.guild.iconURL(),
              // 		},
              // 		color: "BLURPLE",
              // 	},
              // ],
            });
          }

          const tag = tagsCache.get(args[0]);
          if (!tag) {
            return message.channel.send({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle('Invalid Usage!')
                  .setDescription(
                    'The tag you provided is not in the database, please check the tag name.',
                  ),
              ],
            });
          }
      
          if (tag.guild !== message.guild.id) {
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
          if (!tag.enabled) {
            return message.channel.send({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle('Invalid Usage!')
                  .setDescription(
                    "The tag isn't verified by a moderator yet and not ready for use.",
                  ),
              ],
            });
          }
          // If the tag is in the database, return the content of the tag
          return message.reply({
            allowedMentions: {repliedUser: false, everyone: false},
            embeds: [
              new Discord.EmbedBuilder()
              .setTitle(`Tag Info`)
              .addFields(
                {name: `Name`, value: `\`${tag.name}\``},
                {name: `Tag Creator`, value: `<@!${tag.owner}>`},
                {name: `Creation Date`, value: `${tag.createdAt}`},
                {name: `Verified at`, value: `\`${tag.verifiedAt}\``},
                {name: `Verified by`, value: `<@!${tag.verifiedBy}>`},
              )
            ],
          });
          console.log(TagSchema)
          console.log(tagsCache)
        }
    }