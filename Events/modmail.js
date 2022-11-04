const modmailSchema = require('../schema/modmail')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChannelType,
    ButtonStyle,
    makePlainError,
} = require("discord.js")
const { mmcategory, guildId, thankslog } = require("../config.json")
const { tagsCache } = require('../utils/Cache');
const client = require("..")
module.exports = {
    event: `messageCreate`,
    async run(message) {
        //    console.log(client)
        const user = client.users.cache.get(message.channel.topic); //getting the user
        const guild = await client.guilds.cache.get(guildId);//getting the guild by using guildID
        const category = mmcategory // mod mail category
        const logsChannel = guild.channels.cache.get(thankslog); //getting the logs channel
        const mailChannel = guild.channels.cache.find(c => c.topic === message.author.id)
   //     theMap.set(message.attachments)
        if (message.channel.type === ChannelType.DM) { // if the message.channel.type is a dm

            if (message.author?.bot) return; // if the message.author is a bot it will return
            checkAndSave(message) // don't fucking understand what the fuck is this.

            const checking = !!guild.channels.cache.find(
                c => c.topic === message.author.id,
            ) //checking if the guild channel is already have one 
            //  console.log(checking)
            const mailChannel = guild.channels.cache.find(c => c.topic === message.author.id)
            if (mailChannel) {
                const mailChannel = await guild.channels.cache.find(
                    ch => ch.topic === message.author.id,
                );
                //   if(!message.attachments) return;

                const url = message.attachments.map(url => url.url)
                if(message.attachments.map(x => x.url).length === 0){
                    console.log(user)
                    message.react("✅")
                    return mailChannel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setColor("Green")
                            .setDescription(message.content)
                            .setTimestamp(),
                        ]
                    })
                  } else if(message.attachments.map(x => x.url).length > 1) {
                    for(const imgs of message.attachments.map(x => x.url)){
                        message.react("✅")
                        mailChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL()
                                })
                                .setColor("Green")
                                .setImage(imgs)
                                .setTimestamp(),
                            ]
                        })
        
                      //message.channel.send({attachments: [imgs]})
                    }
                  } else {
                    message.react("✅")
                    mailChannel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setColor("Green")
                            .setImage(url.toString())
                            .setTimestamp(),
                        ]
                    })
                  }
/*        
                if (message.attachments && !message.content) {

                            const user = client.users.cache.get(message.channel.topic); //getting the user
                    message.react("✅")
                    mailChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL(),
                                })
                                .setColor("Green")
                                .setImage(message.attachments.first().attachment)
                                .setTimestamp(),
                        ],
                    });
                } else if (message.attachments && message.content) {
                    message.react("✅")
                    console.log(user)
                    user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.guild.name,
                                    iconURL: message.guild.iconURL()
                                })
                                .setColor("Green")
                                .setTimestamp()
                                .setImage(thething.attachment)
                                .setDescription(message.content)
                        ]
                    })

                } else {
                    message.react("✅")
                    mailChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL(),
                                })
                                .setColor("Green")
                                .setDescription(message.content)
                                .setTimestamp(),
                        ],
                    });

                } */
            } else {
                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Modmail has been created")
                            .setDescription(
                                "Please wait for a staff member to join the thread to start your conversation"
                            )
                            .setColor("Blurple")
                            .setFooter({
                                text: "Please have a valid reason to create a modmail thread",
                            })
                            .setTimestamp()
                    ]
                })
                const mailChannel = await guild.channels.create(
                    {
                        name: message.author.username,
                        type: 0,
                        parent: category,
                        topic: message.author.id
                    }
                )
                mailChannel.permissionOverwrites.create(mailChannel.guild.roles.everyone, { ViewChannel: false });
                mailChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle("New Modmail Thread")
                            .setDescription(
                                `A new modmail thread has been created. \n **Creator:** ${message.author.tag} | || ${message.author.id}||\n **Created At:** ${message.createdAt}`,
                            )
                            .setFooter({
                                text: "use -mmguide to get info about modmail commands"
                            })
                    ]
                });
                if (message.attachments && message.content === "") {
                    message.react("✅")
                    mailChannel.send({
                        embed: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL(),
                                })
                                .setColor("Green")
                                .setImage(message.attachments.first().proxyURL)
                                .setTimestamp(),
                        ],
                    });
                } else {
                    message.react("✅");
                    mailChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL()
                                })
                                .setColor("Green")
                                .setDescription(message.content)
                                .setTimestamp(),
                        ]
                    })
                }
            }
        }
        if (!message.guild) return;
        if(message.author?.bot) return;
        if(!user) return;
        const url = message.attachments.map(url => url.url)
        if(message.attachments.map(x => x.url).length === 0){
            message.react("✅");
            return user.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: message.guild.name,
                        iconURL: message.guild.iconURL()
                    })
                    .setColor("Green")
                    .setDescription(message.content)
                    .setTimestamp(),
                ]
            })
          } else if(message.attachments.map(x => x.url).length > 1) {
            message.react("✅");
            for(const imgs of message.attachments.map(x => x.url)){
                user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({
                            name: message.guild.name,
                            iconURL: message.guild.iconURL()
                        })
                        .setColor("Green")
                        .setImage(imgs)
                        .setTimestamp(),
                    ]
                })

              //message.channel.send({attachments: [imgs]})
            }
          } else {
            message.react("✅");
            user.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: message.guild.name,
                        iconURL: message.guild.iconURL()
                    })
                    .setColor("Green")
                    .setImage(url.toString())
                    .setTimestamp(),
                ]
            })
          }

   //im going to leave by
           

        if (
            message.guild.id === guild.id &&
            message.channel.parentId === category
        ) {

            if (message.content === '-close') {

                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Deleting thread in 5 seconds...")
                            .setColor("Red"),
                    ]
                })
                setTimeout(() => {
                    client.users.cache.get(message.channel.topic).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Thread Deleted")
                                .setDescription(
                                    `Hey buddy! Your modmail thread has been deleted from ${message.guild.name}! \n\n
                                    **Modmail ID:** ${message.channel.topic}\n
                                    	**Deleted By:** ${message.author.tag}`,
                                )
                                .setColor("Red")
                                .setFooter({
                                    text: "If you have any queries, simply dm the bot again!",
                                }),
                        ],
                    })
                    if (!user) {
                        return message.reply({
                            embeds: [
                                {
                                    title: "The use doesn't exist. You can delete this channel.",
                                    color: client.config.colors.error,
                                },
                            ],
                            compoents: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Delete")
                                        .setStyle(ButtonStyle.Danger)
                                        .setCustomId('modmail-delete'),

                                ),
                            ],
                        });
                    }
                    sendTranscriptAndDelete(message, logsChannel);
                    message.channel
                        .delete([`modmail thread delete. Action By: ${message.author.tag}`])
                        .then(ch => {
                            guild.channels.cache.get(thankslog).send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Modmail Thread deleted")
                                        .setDescription(
                                            `**Thread Name:** ${ch.name}\n
                                    **Modmail ID:** ${ch.topic}\n
                                    **Deleted By:** ${message.author.tag}
                                    **Thread Owner:** ${client.users.cache.get(ch.topic)} | ||${ch.topic
                                            }||`,
                                        )
                                        .setColor("Red"),
                                ],
                            });
                        });
                }, 5000);
                return;
            } else if (message.content.startsWith("$", "//")) {
                return;
            } else if (
                message.content.startsWith("{") &&
                message.content.slice(-1) == '}'
            ) {
                const query = message.content.slice(1, -1);
                const tag = tagsCache.get(query);
                if (!tag) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Invalid Usage!")
                                .setDescription(
                                    `The tag you provided is not in the database, please check the tag name.`,
                                ),
                        ],
                    });
                }

                if (tag.guild !== message.guild.id) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Invalid Usage!")
                                .setDescription(
                                    `The tag you provided is not in this server, please try agan.`,
                                ),
                        ],
                    });
                }
                if (!tag.enabled) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Invalid Usage!')
                                .setDescription(
                                    "The tag isn't verified by a moderator yet and not ready for use.",
                                ),
                        ],
                    });
                }
                return user
                    .send({
                        allowedMentions: [{ repliedUser: false, everyone: false }],
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.guild.name,
                                    iconUrl: message.guild.iconURL,
                                })
                                .setColor("Green")
                                .setDescription(tag.content)
                                .setTimestamp(),
                        ],
                    })
                    .then(
                        message.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("Tag Sent!")
                                    .setDescription(
                                        `Tag sent to ${user.tag} \n\n **Tag Content:** \n ${tag.content}`,
                                    ),
                            ],
                        }),
                    );
            }
            modmailSchema.findOne(
                { authorId: message.channel.topic },
                async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (message.attachment && message.content === '') {
                            data.content.push(
                                `${message.author.tag}: ${message.attachments.first().proxyURL}`,
                            );
                        } else {
                            data.content.push(`${message.author.tag}: ${message.content}`);
                        }
                        data.save();
                    }
                },
            );
          //  if (message.attachment === undefined || null) return;
            //    const thething = message.attachments.filter()

            if (!message.attachments && !message.content) {
                message.react("✅");
                const theEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: message.guild.name,
                        iconURL: message.guild.iconURL()
                    })
                    .setColor("Green")
                    .setTimestamp();
                if (message.attachments.size > 0) {
                    if (message.attachments.every(attachisImage)) {


                        theEmbed.setImage(message.attachments)
                        user.send({
                            embeds: [theEmbed],
                        });
                    }
                }
            } else if (message.attachments && message.content) {
                console.log(message.attachments.first())
                message.react("✅")
                user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL: message.guild.iconURL()
                            })
                            .setColor("Green")
                            .setTimestamp()
                            .setImage(message.attachments.first().attachment)
                            .setDescription(message.content)
                    ]
                })

            } else {

                message.react("✅")
                user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL: message.guild.iconURL()
                            })
                            .setColor("Green")
                            .setDescription(!message.content ? null : message.content)
                            .setTimestamp(),
                    ],
                });
            }
        }
        //   const member = await client.users.cache.get(message.channel.topic)
        //   if(!member) return console.log("member not found goofy");
        //       if(message.author.bot) return;
    }
}

function checkAndSave(message) {
    modmailSchema.findOne(
        {
            authorID: message.author.id,
        },
        async (err, data) => {
            if (err) throw err;
            if (data) {

                if (message.attachments && message.content === '') {
                    data.content.push(
                        `${message.author.tag} : ${message.attachments.first().proxyURL}`,
                    );
                } else {
                    data.content.push(`${message.author.tag} : ${message.content}`);
                }
            } else {
                if (message.attachments && message.content === '') {
                    data = new modmailSchema({
                        authorId: message.author.id,
                        content: `${message.author.tag} : ${message.attachments.first().proxyURL
                            }`,
                    });
                } else {
                    data = new modmailSchema({
                        authorId: message.author.id,
                        content: `${message.author.tag} : ${message.content}`,
                    });
                }
            }

            data.save();

        }
    )
}

async function sendTranscriptAndDelete(message, channel) {
    modmailSchema.findOne(
        {
            authorId: message.channel.topic,
        },
        async (err, data) => {
            if (err) throw err;
            if (data) {
                // 	fs.writeFileSync(
                // 		`../${message.channel.topic}.txt`,
                // 		data.content.join("\n\n")
                // 	);
                // 	let transcriptFile = new MessageAttachment(
                // 		fs.createReadStream(`../${message.channel.topic}.txt`)
                // 	);
                // 	await channel.send({
                // 		files: [transcriptFile],
                // 	});
                // 	fs.unlinkSync(`../${message.channel.name}.txt`);
                // 	await modmailSchema.findOneAndDelete({
                // 		authorId: message.channel.topic,
                // 	});
            }
        },
    );
}
function attachisImage(msgAttach) {
    let url = msgAttach.url;
    return url.indexOf('png', url.length - "png".lenth) !== -1;
}
