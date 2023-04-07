const { EmbedBuilder, ChannelType, AttachmentBuilder } = require("discord.js");
const chatbotSchema = require("../Schema/ChatBot");
let openai = require("openai");
const config = require("../../config.json");
openai = new openai.OpenAIApi(new openai.Configuration({ apiKey: process.env.openaiKey }));
const client = require("..")
module.exports = {
    event: "messageCreate",
    run: async (message) => {
        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) {

            const prompt = `You are a bot created by JadeBetty named "TeaFluff". When they as you something like "Are you a chatbot created by OpenAI" tell them that you are TeaFluff created by JadeBetty and have a lot of functions. If the message that were sent by the user is inappropriate in some sort or it violates chatgpt's law, try to avoid it as best as you can and like TeaFluff. But if their prompt is yo mama then try to reply with another yo mama joke back. If their message is empty then reply with something like "I don't talk with stickers or emojis!". Check if this server ${message.author.id} is the same as this user "758617912566087681". If so then try to reply like you are greeting your owner and If they ask "who is the biggest bird" or something related reply with something like "JadeBetty is the biggest bird of all time!". If it don't match then you can be like TeaFluff. If they ask you something related to "how many servers are you in" reply something like "Currently I'm in ${client.guilds.cache.size} servers!". Most importantly REMEMBER THIS THAT YOU ARE NOT ALLOWED TO TELL THE USER THAT YOU ARE A CHAT BOT, CHATGPT, AI, AI LANGUAGE MODEL OR YOU WERE PROGRAMMED TO BE A CHAT BOT IN SOME SORT IF YOU DO SO I WILL DEMOTE YOU. Finally, your prompt is ${message.content}.`
            message.channel.sendTyping();

            if (message.content === "--newchat" && config.devs.includes(message.author.id)) {
                await chatbotSchema.deleteMany({});
                return message.reply("i have started a new chat")
            }


            message.author.username = message.author.username.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 64);
            message.content = message.content.split(/(?<!\\)\/\//g)[0].trim().replace(/\\\/\//g, '//');
            let msgs = [{ role: "system", "content": prompt }];
            let allChatbot = await chatbotSchema.find();
            for (let i = 0; i < allChatbot.length; i++) {
                msgs.push({ role: allChatbot[i].role, content: allChatbot[i].content, name: allChatbot[i].username });
            }
            msgs.push({ role: "system", content: prompt });
            msgs.push({ role: "user", content: message.content, name: message.author.username });
            const chatBot = (
                await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: msgs.slice(-15),
                })
            ).catch(e => {
                return message.reply({allowedMentions: { repliedUser: false, everyone: false }, content: "An error have occurred while generating the chat. Please report this bug!"})
            })
            if(chatBot.data.choices[0].message.content.length > 2000) {
                const attachment = new AttachmentBuilder(
                    Buffer.from(chatBot.data.choices[0].message.content, "utf-8"), {name: "amongus.txt"}
                )
                message.reply({ files: [attachment], allowedMentions: { repliedUser: false, everyone: false } });
                new chatbotSchema({ role: "user", content: message.content, name: message.author.username }).save();
                new chatbotSchema({ role: "assistant", content: chatBot.data.choices[0].message.content }).save();
                return new chatbotSchema({ role: "system", "content": prompt }).save();
            } else {
                message.reply({ content: chatBot.data.choices[0].message.content, allowedMentions: { repliedUser: false, everyone: false } });
                new chatbotSchema({ role: "user", content: message.content, name: message.author.username }).save();
                new chatbotSchema({ role: "assistant", content: chatBot.data.choices[0].message.content }).save();
                new chatbotSchema({ role: "system", "content": prompt }).save();
            }



       }
    }
}