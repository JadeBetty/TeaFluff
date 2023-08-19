const Discord = require("discord.js");
const axios = require("axios");
module.exports = {
    name: "compile",
    description: "Compile a code!",
    category: "Bot Development",
    run: async (client, message, args) => {
        const cmd = message.content.replace(/^!/, ""); // used to check for the compile command
        const regex1 = /compile\s+```([a-zA-Z]+)\s+([\s\S]+?)```/; //compile `language \n code`
        const regex2 = /^compile [a-zA-Z]+ `.*`$/gm; //compile language `code`
        const languages = await axios.get("https://wandbox.org/api/list.json"); // sending a request to wandbox.org for all languages
        const supportedLanguages = Object.values(languages.data.filter(obj => obj.name !== "spidermonkey-88.0.0").reduce((accumulator, currentValue) => {
            if (accumulator[currentValue.language]) {
                if (currentValue.version > accumulator[currentValue.language].version) {
                    accumulator[currentValue.language] = currentValue;
                }
            } else {
                accumulator[currentValue.language] = currentValue;
            }
            return accumulator;
        }, {})); // finding the supported languages while removing spider monkey from javascript

        const supportedLanguagesObj = {
            js: "JavaScript",
            py: "Python",
            java: 'Java',
            cpp: 'C++',
            rb: 'Ruby',
            cs: 'C#',
            ts: "TypeScript",
            rs: "Rust"
        }; // shortcut words

        if (regex1.test(cmd)) {
            const argssplited = args.join().split("\n").filter(obj => obj.length > 0); // splitting args
            const language = argssplited[0].replace(/`/g, ""); // language for the compile
            const code = argssplited[1].replace(/`/g, "").replace(/,/g, " "); // code
            let langcompiled;
            supportedLanguages.forEach((lang, num) => {
                if (lang.language === supportedLanguagesObj[language]) {
                    langcompiled = lang.name;
                }
            }); // finding the right language to compile in wandbox.org


            if (!langcompiled) {
                return message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Language not found")
                            .setDescription("The language that you are using is not found on wandbox.org.\nAvailable languages: somethjing")
                    ]
                })
            }
            const compiling = await axios.post('https://wandbox.org/api/compile.json', {
                code: code,
                compiler: langcompiled,
            });
            //no error
            if (compiling.data.program_error.length === 0) {
                message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Program Output")
                            .setDescription(`\`\`\`${compiling.data.program_output || compiling.data.compiler_output}\`\`\``)
                            .setFooter({ text: `${langcompiled} on wandbox.org` })
                            .setColor("#a8f1b0")
                    ]
                })
            } else {
                //yes error
                message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Program Output")
                            .setDescription(`\`\`\`${compiling.data.program_error || compiling.data.compiler_error}\`\`\``)
                            .setFooter({ text: `${langcompiled} on wandbox.org` })
                            .setColor("#f09999")
                    ]
                })
            }

        } else if (regex2.test(cmd)) {
            const language = args[0];
            let langcompiled;
            supportedLanguages.forEach((lang, num) => {
                if (lang.language === supportedLanguagesObj[language]) {
                    langcompiled = lang.name;
                }
            });

            const code = args[1].replace(/`/g, "");
            if (!langcompiled) {
                return message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder
                            .setTitle("Language not found")
                            .setDescription("The language that you are using is not found on wandbox.org.\nAvailable languages: somethjing")
                    ]
                })
            }
            const compiling = await axios.post('https://wandbox.org/api/compile.json', {
                code: code,
                compiler: langcompiled,
            });
            //no error
            if (compiling.data.program_error.length === 0) {
                message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Program Output")
                            .setDescription(`\`\`\`${compiling.data.program_output || compiling.data.compiler_output}\`\`\``)
                            .setFooter({ text: `${langcompiled} on wandbox.org` })
                            .setColor("#a8f1b0")
                    ]
                })
            } else {
                //yes error
                message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Program Output")
                            .setDescription(`\`\`\`${compiling.data.program_error || compiling.data.compiler_error}\`\`\``)
                            .setFooter({ text: `${langcompiled} on wandbox.org` })
                            .setColor("#f09999")
                    ]
                })
            }
        } else {
            message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle("Language not found")
                        .setDescription("The language that you are using is not found on wandbox.org.\nAvailable languages: somethjing")
                ]
            })
        }
    }
}