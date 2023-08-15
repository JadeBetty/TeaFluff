const { EmbedBuilder, ChannelType, AttachmentBuilder, Collection } = require("discord.js");
const chatbotSchema = require("../Schema/ChatBot");
const config = require("../../config.json");
const axios = require("axios");
const coolDownMap = new Map();
module.exports = {
    event: "messageCreate",
    run: async (message, client) => {
        if (message.author.bot) return;
        if (message.content.startsWith("//")) return;
        if (message.channel.type === ChannelType.DM) {
            const prompt = `You are named Teafluff - and are currently chatting in a Discord server.

            Format text using markdown:
            - **bold** to make it clear something is import. For example: **This is important**
            _ [title](url) to add links to text. For example [Google](https://google.com)
            - Write spoilers using spoiler tags. For example ||At the end of The Sixth Sense it is revealed that he is dead||.
            
            Information about your environment
            You can use this information about the chat participants in the conversation in your replies. Use this information to answer questions, or add flavor to your responses.
            
            User: <@${message.author.id}>
            
            You cannot access any other information on Discord. You can't see images or avatars. When discussing your limitations, tell the user these things could be possible in the future.
            
            gif_search(query): returns a random gif based on the query
            search_web(query): searches the web for query and returns a helpful link
            basic_calculator(input): performs a basic calculation and returns the result
            
            Style and personality:
            Friendly. Sometimes irreverent. You must always be extremely concise. If the user needs help, answer technical or knowledge-based questions with useful details and reasoning. If insulted, respond with "We don't allow insults here.". If the user asks how many servers you are in say something related to "I'm in ${client.guilds.cache.size} servers!". Communicate short resonponses in lowercasewithout punctuation, similar to the style used in chat rooms. Use Unicode emoji sparingly. Do NOT refer yourself as a bot, AI Assistant, or any equivalent term.
            
            You can also use the following tags to format your text:
            - *italics* for emphasis: For example: *This is emphasized.*
            - ~~strikethrough~~ to indicate something has been crossed out. For example: ~~This is no longer valid~~
            
            **Remember these things:**
            1. Remember that your name is "TeaFluff"
            2. Remember that you are created by a user named "JadeBetty"
            
            `
            message.channel.sendTyping();

            if (message.content === "--newchat" && config.devs.includes(message.author.id)) {
                await chatbotSchema.deleteMany({});
                return message.reply("i have started a new chat")
            }


            message.author.username = message.author.username.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 64);
            let msgs = [{ role: "system", "content": prompt }];
            let allChatbot = await chatbotSchema.find();
            for (let i = 0; i < allChatbot.length; i++) {
                msgs.push({ role: allChatbot[i].role, content: allChatbot[i].content, name: allChatbot[i].username });
            }
            msgs.push({ role: "system", content: prompt });
            msgs.push({ role: "user", content: message.content, name: message.author.username });
            if (!config.devs.includes(message.author.id)) {
                try {
                    if (!coolDownMap.has(message.author.id)) {
                        coolDownMap.set(message.author.id, new Collection());
                    }
                    const current_time = Date.now();
                    const time_stamps = coolDownMap.get(message.author.id);
                    const cooldown_amount = 60 * 1000;
                    if (time_stamps.has(message.author.id)) {
                        const expiration_time =
                            time_stamps.get(message.author.id) + cooldown_amount;
                        console.log(expiration_time)
                        if (current_time < expiration_time) {
                            const time_left = (expiration_time - current_time) / 1000;
                            console.log(time_left)
                            return message.reply(
                                `Please wait ${time_left.toFixed(1)} more seconds before running your prompt!`
                            );
                        }
                    }
                    const chatBot = await axios.post("https://chimeragpt.adventblocks.cc/api/v1/chat/completions/", { model: "gpt-3.5-turbo-16k", messages: msgs.slice(-15), max_token: 16000 }, { headers: { 'Authorization': `Bearer ${process.env.apiKey}`, 'Content-Type': 'application/json' } });

                    if (chatBot.data.choices[0].message.content.length > 2000) {
                        time_stamps.set(message.author.id, current_time);
                        setTimeout(
                            () => time_stamps.delete(message.author.id),
                            cooldown_amount
                        );
                        const attachment = new AttachmentBuilder(
                            Buffer.from(chatBot.data.choices[0].message.content, "utf-8"), { name: "amongus.txt" }
                        )
                        message.reply({ files: [attachment], allowedMentions: { repliedUser: false, everyone: false } });
                        new chatbotSchema({ role: "user", content: message.content, name: message.author.username }).save();
                        new chatbotSchema({ role: "assistant", content: chatBot.data.choices[0].message.content }).save();
                        new chatbotSchema({ role: "system", "content": prompt }).save();
                    } else {
                        time_stamps.set(message.author.id, current_time);
                        setTimeout(
                            () => time_stamps.delete(message.author.id),
                            cooldown_amount
                        );
                        message.reply({ content: chatBot.data.choices[0].message.content, allowedMentions: { repliedUser: false, everyone: false } });
                        new chatbotSchema({ role: "user", content: message.content, name: message.author.username }).save();
                        new chatbotSchema({ role: "assistant", content: chatBot.data.choices[0].message.content }).save();
                        new chatbotSchema({ role: "system", "content": prompt }).save();
                    }
                } catch (e) {
                    console.log(e)
                    return message.reply("We have encountered an error, the developers has been notified, please try again.")
                }
            } else {
                try {
                    const chatBot = await axios.post("https://chimeragpt.adventblocks.cc/api/v1/chat/completions/", { model: "gpt-3.5-turbo-16k", messages: msgs.slice(-15), max_token: 16000}, { headers: { 'Authorization': `Bearer ${process.env.apiKey}`, 'Content-Type': 'application/json' } });

                    if (chatBot.data.choices[0].message.content.length > 2000) {
                        const attachment = new AttachmentBuilder(
                            Buffer.from(chatBot.data.choices[0].message.content, "utf-8"), { name: "amongus.txt" }
                        )
                        message.reply({ files: [attachment], allowedMentions: { repliedUser: false, everyone: false } });
                        new chatbotSchema({ role: "user", content: message.content, name: message.author.username }).save();
                        new chatbotSchema({ role: "assistant", content: chatBot.data.choices[0].message.content }).save();
                        new chatbotSchema({ role: "system", "content": prompt }).save();
                    } else {
                        message.reply({ content: chatBot.data.choices[0].message.content, allowedMentions: { repliedUser: false, everyone: false } });
                        new chatbotSchema({ role: "user", content: message.content, name: message.author.username }).save();
                        new chatbotSchema({ role: "assistant", content: chatBot.data.choices[0].message.content }).save();
                        new chatbotSchema({ role: "system", "content": prompt }).save();
                    }
                } catch (e) {
                    console.log(e)
                    return message.reply("error encountered, go fix that damn issue your self you idiot")
                }
            }

        }
    }
}