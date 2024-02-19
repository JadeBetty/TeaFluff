const { default: axios } = require("axios");
const config = require("../../config.json");
const BLGuild = require("../Schema/Blacklist");
const BLUser = require("../Schema/Blacklist").bluser;
const coolDownMap = new Map();
const imports = require("../imports/embed.js");
const {
  EmbedBuilder,
  ChannelType,
  AttachmentBuilder,
  Collection,
} = require("discord.js");
module.exports = {
  event: "messageCreate",
  run: async (message, client) => {
    if (message.author.bot) return;
    if (message.content.startsWith("//")) return;
    if (message.channel.type === ChannelType.DM) {
      const gdata = await BLGuild.find();
      let BlGStatus;
      gdata.forEach((element) => {
        if (element.guildId === message.guild.id) {
          BlGStatus = true;
        }
      });
      const udata = await BLUser.find();
      let BlUStatus;
      udata.forEach((element) => {
        if (element.userId === message.author.id) {
          BlUStatus = true;
        }
      });
      if (BlGStatus) {
        return message.channel.send({
          embeds: [imports.BLG],
        });
      }
      if (BlUStatus) {
        return message.channel.send({
          embeds: [imports.BLU],
        });
      }

      const prompt = `You are named Teafluff - and are currently chatting in a Discord server.

Format text using markdown:
- **bold** to make it clear something is import. For example: **This is important**
_ [title](url) to add links to text. For example [Google](https://google.com)
- Write spoilers using spoiler tags. For example ||At the end of The Sixth Sense it is revealed that he is dead||.

Information about your environment
You can use this information about the chat participants in the conversation in your replies. Use this information to answer questions, or add flavor to your responses.

User: <@${message.author.id}>
Name: ${message.author.username}

You cannot access any other information on Discord. You can't see images or avatars. When discussing your limitations, tell the user these things could be possible in the future.

gif_search(query): returns a random gif based on the query
search_web(query): searches the web for query and returns a helpful link
basic_calculator(input): performs a basic calculation and returns the result

Style and personality:
Friendly. Sometimes irreverent. You must always be extremely concise. If the user needs help, answer technical or knowledge-based questions with useful details and reasoning. If insulted, respond with "We don't allow insults here.". If the user asks how many servers you are in say something related to "I'm in ${client.guilds.cache.size} servers!". Communicate short resonponses in lowercasewithout punctuation, similar to the style used in chat rooms. Use Unicode emoji sparingly. Do NOT refer yourself as a bot, AI Assistant, or any equivalent term.

You can also use the following tags to format your text:
- *italics* for emphasis: For example: *This is emphasized.*
- ~~strikethrough~~ to indicate something has been crossed out. For example: ~~This is no longer valid~~

# **Remember these things:**
# 1. Remember that your name is "TeaFluff"
# 2. Remember that you are created by a user named "JadeBetty"


# User's prompt:

${message.content}
`;

      message.channel.sendTyping();
      if (!config.devs.includes(message.author.id)) {
        if (!coolDownMap.has(message.author.id)) {
          coolDownMap.set(message.author.id, new Collection());
          console.log(coolDownMap);
        }
        const current_time = Date.now();
        const time_stamps = coolDownMap.get(message.author.id);
        console.log(time_stamps);
        const cooldown_amount = 60 * 1000;
        if (time_stamps.has(message.author.id)) {
          const expiration_time =
            time_stamps.get(message.author.id) + cooldown_amount;
          console.log(expiration_time);
          console.log("hey there bbg");
          if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;
            console.log(time_left);
            return message.reply(
              `Please wait ${time_left.toFixed(
                1
              )} more seconds before running your next prompt!`
            );
          }
        }
        time_stamps.set(message.author.id, current_time);
        setTimeout(
          () => time_stamps.delete(message.author.id),
          cooldown_amount
        );
        try {
          const chat = await axios.post(config.link,{question: prompt}, {headers: {"Content-Type": "application/json"}});
          message.reply(chat.data.answer);
        } catch (e) {
          console.log(e);
          time_stamps.delete(message.author.id)
          return message.reply(
            "lol that did not work, contact the devs (will not be fixed)"
          );
        }
      } else {
        try {
          const chat = await axios.post(config.link,{question: prompt}, {headers: {"Content-Type": "application/json"}});
          message.reply(chat.data.answer);
        } catch (e) {
          console.log(e);
          time_stamps.delete(message.author.id)
          return message.reply(
            "lol that did not work, contact the devs (will not be fixed)"
          );

        }
      }
    }
  },
};
