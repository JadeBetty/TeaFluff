console.log("Paste v2 command work? :O")
const { EmbedBuilder } = require('discord.js');
//const {CommandStructure} = require('../../structure/CommandStructure');
const fetch = require('node-fetch');
const prettier = require('prettier');

module.exports = {
    name: 'paste',
    description: 'Pastebin a replied message.',
    category: 'Help',
    cooldown: 20,
    run: async (client, message, args) => {
        try {
            let repliedMessage = await message.fetchReference();
            if (!repliedMessage)  {
                throw new Error('You need to reply to a message!');
            }


            let content = repliedMessage.content
                .replace('```js', '')
                .replace('```', '');

            // Check if the message consist of a attachment that could be valid text
            if (repliedMessage.attachments.size > 0) {
                let attachment = repliedMessage.attachments.first();
                if (
                    attachment.url.endsWith('.png') ||
                    attachment.url.endsWith('.jpg')
                ) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(
                                    `You can't paste this message because it contains an image!`,
                                ),
                        ],
                    });
                }
                if (
                    attachment.url.endsWith('.txt') ||
                    attachment.url.endsWith('.js') ||
                    attachment.url.endsWith('.ts')
                ) {
                    // Read the buffer and try to convert it to text
                    try {
                        content = await fetch(attachment.url).then(a => a.text());
                    } catch (e) {
                        return message.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription(
                                        `I can't paste this message because it isn't a valid message to paste!`,
                                    ),
                            ],
                        });
                    }
                }
            }
            if (!content || content.length < 1) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(
                                `I can't paste this message because it isn't a valid message to paste!`,
                            ),
                    ],
                });
            }
            try {
                content = prettier.format(content, {
                    parser: 'typescript',
                    semi: false,
                    singleQuote: false,
                    trailingComma: 'none',
                    printWidth: 100,
                    tabWidth: 2,
                    bracketSpacing: true,
                    arrowParens: 'always',
                    endOfLine: 'lf',
                });
            } catch (e) {
                console.log(e);
            }
            // Paste the message in pastebin
            let response = await fetch(
                'https://www.toptal.com/developers/hastebin/documents',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: content,
                },
            );
            console.log(response)
            let json = await response.json();
            let url = `https://www.toptal.com/developers/hastebin/${json.key}.js`;
            console.log(url);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Paste')
                        .setDescription(`[Click here to view the paste](${url})`)
                        .addField('Requested by', message.author.tag)
                        .addField('Requested in', message.channel.toString())
                        .setTimestamp(),
                ],
            });

        } catch (e) {
            console.log(e);
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`You must reply to a message!`),
                ],
            })
        }
    },
}
