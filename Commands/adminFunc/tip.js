const {
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");
const { Types } = require("mongoose");
const tipSchema = require("../../schema/tip")
module.exports = {
    name: "tip",
    description: "Edit a tip to the Database",
    aliaes: ["tip"],
    category: "Administrator",
    usage: "addtip <tip>",
    permissions: ["Administrator"],
    run: async (client, message, args) => {
        const method = args[0];

        if (
            !method ||
            !['add', 'create', 'list', 'delete', 'remove', 'del'].includes(method)
        ) {
            return message.reply({
                embeds: [
                    {
                        title: 'Invalid Method!',
                        description:
                            'Please specify a valid method to edit a tip! Your valid options are Add, List or Remove',
                        color: client.config.colors.error,
                    },
                ],
            });
        }

        if (method === 'add') {
            const tip = args.slice(1).join(' ');
            if (!tip) {
                return message.reply('Please mention the tip you want to add!');
            }
            tipSchema.findOne(
                {
                    tip: tip,
                },
                async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        data = new tipSchema({
                            tip: tip,
                            authorId: message.author.id,
                        });
                        message.reply({
                            embeds: [
                                {
                                    title: 'Tip Added!',
                                    description: `Your tip \`${tip}\` has been added!`,
                                    color: client.config.colors.success,
                                },
                            ],
                        });
                    } else {
                        return message
                            .reply('That tip already exists!')
                            .then(msg => setTimeout(() => msg.delete(), 5000));
                    }
                    data.save();
                },
            );
        } else if (method === 'list') {
            let tips = [];
            tipSchema.find({}, async (err, data) => {
                if (err) throw err;
                if (data) {
                    tips = data.map(obj => obj.tip);
                }
                message.reply({
                    embeds: [
                        {
                            title: 'Tips',
                            author: {
                                name: message.author.tag,
                                icon_url: message.author.displayAvatarURL({ dynamic: true }),
                            },
                            description: `${data
                                .map(
                                    t =>
                                        `**Tip:** ${t.tip}\n**Tip ID:** ${t._id
                                        }\n**Author:** ${message.guild.members.cache.get(
                                            t.authorId,
                                        )} | ||${t.authorId}||\n\n`,
                                )
                                .join(' ')}`,
                            color: client.config.colors.primary,
                        },
                    ],
                });
            });
        } else if ((method === 'delete', 'remove', 'del')) {
            const tipId = args[1];
            module.exports.tipId = tipId;
            if (!tipId) {
                return message.reply({
                    embeds: [
                        {
                            title: 'Invalid Tip ID!',
                            description: 'Please specify a valid tip ID to delete!',
                            color: client.config.colors.error,
                        },
                    ],
                });
            }

            if (!Types.ObjectId.isValid(tipId)) {
                return client.config.errEmbed(
                    message,
                    'Tip not found!',
                    'That tip does not exist! Please check the tip ID and try again.',
                );
            }
            // await tipSchema
            // 	.findOne({ _id: tipId })
            // 	.then(data => {
            // 		if (!data) {
            // 			return client.config.errEmbed(
            // 				"Tip Not Found!",
            // 				"That tip does not exist!"
            // 			);
            // 		}
            // 	})
            // 	.catch(err => {
            // 		client.config.handleError(message, err);
            // 	});

            let msg = await message.reply({
                embeds: [
                    {
                        title: 'Are you sure?',
                        description: `Are you sure you want to delete the tip with the ID of \`${tipId}\`?`,
                        color: client.config.colors.warning,
                        fields: [
                            {
                                name: 'Tip ID:',
                                value: tipId,
                            },
                        ],
                    },
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("Yes")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId("rm-yes"),
                        new ButtonBuilder()
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('rm-cancel'),
                    )
                ]
            })
/*
            let collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
            })

            collector.on("collect", async i => {
                if (i.customId === "rm-yes") {
    
                    tipSchema.findOneAndDelete(
                        {
                            _id: message.tipId
                        },
                        async (err, data) => {
                            if (err) throw err;
                            if (data) {
                                return i.message.edit({
                                    embeds: [
                                        {
                                            title: 'Tip Removed!',
                                            description: `Tip **${data.tip
                                                }** has been removed!\n\n**Tip ID:** ${data._id
                                                }\n**Author:** ${i.guild.members.cache.get(
                                                    data.authorId,
                                                )} | ||${data.authorId}||\n**Deleted by:** ${i.member
                                                } | ||${i.member.id}||`,
                                            color: client.config.colors.success,
                                        },
                                    ],
                                    components: [],
                                });
                            }
                        },
                    )

                } else if(i.customId === "rm-cancel") {
                    i.message.delete()
                }


            }) */
        } 
    }
}