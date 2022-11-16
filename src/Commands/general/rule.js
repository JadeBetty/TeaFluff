
const discord = require('discord.js');
const rules = [
    {
        num: 1,
        name: "Follow Discord Terms and service.",
        value: msg => "Please ensure that you're following Discord Terms and service while talking in this server https://discord.com/terms & https://discord.com/guidelines"
    },
    {
        num: 2,
        name: "Keep the server SFW.",
        value: msg => "Please make sure that whatever you are talking is appropriate for the people that is over 13 and over."
    },
    {
        num: 3,
        name: "No hate speech or harassment of any kind.",
        value: msg => "This is self explanatory, but hate speech, and threats are not allowed on this server. We do not tolerate it and if you're caught breaking this rule, you'll be banned immediately"
    },
    {
        num: 4,
        name: "No offensive slurs or languages that could be triggering to people in the community.",
        value: msg => "If you were caught doing this you will immediately get banned."
    },
    {
        num: 5,
        name: "Keep spam + Promotion out.",
        value: msg => "Spamming of any kind is prohibited in this server. For example, mass-ping or bot spam or text-walls. Promoting anywhere other than promotion is not allowed. Also, no unrequested Direct Messages (DM) Promotion."
    },
    {
        num: 6,
        name: "Use proper channels for discussion, please.",
        value: msg => "This rule is self explanatory, there's place for everything. For example, chat in Mainchat, Also if you want to fight you can make your own thread and arguments in that thread."
    },
    {
        num: 7,
        name: "English only.",
        value: msg => "Usage of any language other than English is prohibited. This is an English-only server. If you're having trouble, you may use a translator."
    },
    {
        num: 8,
        name: "Please don't ping the owner.",
        value: msg => `Please don't ping <@${msg.guild.ownerId}> without a solid reason (this includes message inline reply). If you're caught doing so, you may get punished.`
    }
];

module.exports = {
    name: 'rule',
    description: 'Check a rules of the server.',
    aliases: ['rules'],
    disabledChannel: [],
    category: 'General',
    cooldown: 5,
    run: async (client, message, args) => {
        const argsNum = Number(args[0]);
        const rule = rules.find(({ num }) => num === argsNum);

        let embed;
        if (!rule) {
            const allRules = rules.map((rule) => ({ name: `${rule.num}. ${rule.name}`, value: rule.value(message) }))
            embed = new discord.EmbedBuilder()
                .setTitle("__Rules__")
                .setDescription(
                    `
                    Hello everyone, welcome to the Imagine Gaming Play's Discord Server!
A newbie hole for new aspiring coders.\nMake friends, find people to collaborate with or help some people with their Discord Bot and earn a few scores. (Scores later can be used to unlock exciting rewards!)
    ↳ Social Links ↰
➔ Channel: https://youtube.com/ImagineGamingPlay
➔ Instagram: https://www.instagram.com/imaginegamingplayofficial/
➔ Twitter: https://twitter.com/yourman_igp
➔ Github: https://github.com/ImagineGamingPlay
➔ Website: https://imagine.cf/
We hope you have a good time here!
Below are some rules, please read all of them to get started. <:tctThinkDerp:878865297312981042>
`
                )
                .addFields(allRules)
                .setTimestamp()
                .setFooter({
                    text: 'Page 1/1'
                })
                .setColor('Orange')
                .setAuthor({
                    name: 'IGP Community Guidelines',
                    iconURL:
                        'https://images-ext-2.discordapp.net/external/s_3olUDuxLwE1zKZEKnmxQsp3udo06B2w_nPqMa5GjA/https/cdn.discordapp.com/icons/697495719816462436/a_6db19f30e288a192f61d1c4975710585.gif',
                })
        } else if (args[0] === "send") {
            const channel = message.mentions.channels.first();
            if (!channel) return message.channel.send('Please mention a channel.');
            const allRules = rules.map((rule) => ({ name: `${rule.num}. ${rule.name}`, value: rule.value(message) }))
            let embed = new discord.EmbedBuilder()
                .setTitle("__Rules__")
                .setTitle("__Rules__")
                .setDescription(
                    `
                    Hello everyone, welcome to the Imagine Gaming Play's Discord Server!
A newbie hole for new aspiring coders.
    ↳ Social Links ↰
➔ Channel: https://youtube.com/ImagineGamingPlay
➔ Instagram: https://www.instagram.com/imaginegamingplayofficial/
➔ Twitter: https://twitter.com/yourman_igp
➔ Github: https://github.com/ImagineGamingPlay
➔ Website: https://imagine.cf/
We hope you have a good time here!
Below are some rules, please read all of them to get started. <:tctThinkDerp:878865297312981042>
`
                )
                .addFields(allRules)
                .setTimestamp()
                .setFooter({
                    text: 'Page 1/1'
                })
                .setColor('Orange')
                .setAuthor({
                    name: 'IGP Community Guidelines',
                    iconURL:
                        'https://images-ext-2.discordapp.net/external/s_3olUDuxLwE1zKZEKnmxQsp3udo06B2w_nPqMa5GjA/https/cdn.discordapp.com/icons/697495719816462436/a_6db19f30e288a192f61d1c4975710585.gif',
                })
            channel.send({ embeds: [embed] })
        } else {
            embed = new discord.EmbedBuilder()
                .setTitle(`**__Rules ${rule.num}__**`)
                .setDescription(`**${rule.num}. ${rule.name}** \n ${rule.value(message)}`)
                .setColor('Orange')
                .setTimestamp();

        }
        message.reply({ embeds: [embed] })
        
    }
}

