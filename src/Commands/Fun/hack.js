//const devs = require("../../config.json");
const { EmbedBuilder } = require("discord.js")
const fs = require('fs')
module.exports = {
  name: "hack",
  description: "Hack someone on Discord! just 4 fun",
  disabledChannel: ["general"],
  category: "Fun",
  deleteTrigger: true,
  run: async (client, message, args) => {
    const zipCode = generate(1000, 9999)
    const streetNumber = generate(1000, 9999)
    const streetName = ["Street 69", "Street 423", "Street 056", "Balls eater Street", "Bed Tester Street", "Sex Street", "IGP Street"]
    const cityName = ["NewYork", "LA", "San francisco", "Collection City", "Paris"]
    const stateName = ["New York", "California", "East US"]

    function createAdress() {
      return `${streetNumber} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${zipCode}`;
    }
    function getRandom(input) {
      return input[Math.floor((Math.random() * input.length))];
    }

    let address = createAdress()


    const fetch = require('isomorphic-fetch');

    async function fetchData(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      } catch (error) {
        console.error('Unable to fetch data:', error);
      }
    }

    function fetchNames(nameType) {
      return fetchData(`https://www.randomlists.com/data/names-${nameType}.json`);
    }

    function pickRandom(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    async function generateName(gender) {
      try {
        const response = await Promise.all([
          fetchNames(gender || pickRandom(['male', 'female'])),
          fetchNames('surnames')
        ]);

        const [firstNames, lastNames] = response;

        const firstName = pickRandom(firstNames.data);
        const lastName = pickRandom(lastNames.data);

        return `${firstName} ${lastName}`;
      } catch (error) {
        console.error('Unable to generate name:', error);
      }
    }


    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]);
    if (!target) return message.reply(
      "```diff\n- TypeError: Cannot find a target to hack!```"
    )
    if (target.id === message.author.id) return message.reply("```diff\n- TypeError: Cannot hack yourself.```");
    if (target.id === client.user.id) return message.reply("```diff\n- TypeError: Cannot hack this user!.```");
    if (target.user.bot) return message.reply("```diff\n- TypeError: Cannot hack a bot!.```");
    //if (target.id === message.guild.ownerId) return message.reply("```diff\n- TypeError: Cannot hack the owner!.```")
    //      if (devs.includes(target.id)) return message.reply("```diff\n- TypeError: Cannot hack the developers!.```")
    let username = target.user.tag;
    const text = [
      `\`\`\`diff\n+ Hacking ${username}...\n\`\`\``,
      `\`\`\`diff\n+ Getting ${username}'s token...\n\`\`\``,
      `\`\`\`diff\n+ Sending virus to ${username}...\n\`\`\``,
      `\`\`\`diff\n+ Accessing ${username}'s IP Address...\n\`\`\``,
    ];
    const process1 = [
      `\`\`\`diff\n- [#_________] 14% complete\n\`\`\``,
      `\`\`\`diff\n- [##________] 26% complete\n\`\`\``,
      `\`\`\`diff\n- [###_______] 32% complete\n\`\`\``,
    ];
    const process2 = [
      `\`\`\`diff\n- [####______] 41% complete\n\`\`\``,
      `\`\`\`diff\n- [#####_____] 53% complete\n\`\`\``,
      `\`\`\`diff\n- [######____] 67% complete\n\`\`\``,
    ];
    const process3 = [
      `\`\`\`diff\n- [#######___] 72% complete\n\`\`\``,
      `\`\`\`diff\n- [########__] 84% complete\n\`\`\``,
      `\`\`\`diff\n- [#########_] 93% complete\n\`\`\``,
    ];
    const processEnd = `\`\`\`diff\n- [##########] 100% complete\n\`\`\``;
    const endText = `\`\`\`diff\n+ Process exited [exit code 0]\n\`\`\``;
    const result = `\`\`\`diff\n+ Final hacking report have been generated for ${target.user.tag}, Exiting System.\n\`\`\``;
    function randomPass(len) {
      let chars = "abcdefghijklmnopqrstuvwxynz0123456789"
      let pwd = "";
      let n = chars.length
      for (let i = 0; i < len; i++) {
        let pos = Math.floor(Math.random() * n + 1);
        pwd += chars.charAt(pos)

      }
      return pwd;
    } pwd = randomPass(10)
    const randomIp = () => Array(4).fill(0).map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)).join('.');
    let ip = randomIp()
    let money = generate(100, 10000)
    let virus = generate(1, 10)
    let name = await generateName()
    let colro = await target.user.fetch().accentColor
    if (colro === undefined || null) {
      colro = '#000000'.replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
      });
    }
    const randomNum = (min, max) =>
      Math.floor(Math.random() * (max - min) + min);

    const randomArr = (length = 10) =>
      Array.from({ length }, () => randomNum(0, 9));

    const formatPhoneNumber = (num) =>
      num.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    var string = target.user.username;
    let email = string + "@gmail.com";


    let disname = target.user.username
    let embed = new EmbedBuilder()
      .setTitle(`Hacking result for ${username}`)
      .setDescription("Finished hacking, By passing 2FA")
      .addFields(
        { name: `Password`, value: `${pwd}`, inline: true },
        { name: `IP address:`, value: ip, inline: true },
        { name: `Address`, value: `${address}`, inline: true },
        { name: `Virus Ejected`, value: `${virus}`, inline: true },
        { name: `Data Sold for:`, value: `${money}$`, inline: true },
        { name: `Real name:`, value: `${name}`, inline: true },
        { name: `Username:`, value: `${target.user.username}`, inline: true },
        { name: `Phone number:`, value: `${formatPhoneNumber(randomArr().join(''))}`, inline: true },
        { name: `Email:`, value: `${email}`, inline: true },
        //{name: `Username:`, value: }
      )
      .setColor(colro)
      .setAuthor({
        name: target.user.tag,
        iconURL: target.user.displayAvatarURL(),
      })
      .setThumbnail(target.user.displayAvatarURL())
      .setFooter({ text: `${target.user.tag} was hacked by ${message.author.tag}` })
      .setTimestamp()

    function generate(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }




    const randomText = Math.floor(Math.random() * text.length);
    const randomProcess1 = Math.floor(Math.random() * process1.length);
    const randomProcess2 = Math.floor(Math.random() * process2.length);
    const randomProcess3 = Math.floor(Math.random() * process3.length);

    const msg = await message.reply(text[randomText]);
    await setTimeout(() => {
      msg.edit(process1[randomProcess1]);
    }, 1500);
    await setTimeout(() => {
      msg.edit(process2[randomProcess2]);
    }, 2500);
    await setTimeout(() => {
      msg.edit(process3[randomProcess3]);
    }, 3500);
    await setTimeout(() => {
      msg.edit(processEnd);
    }, 4500);
    await setTimeout(() => {
      msg.edit(endText);
    }, 5500);
    await setTimeout(() => {
      msg.edit({ content: result, embeds: [embed] });
    }, 6000);
    await setTimeout(() => {
      msg.delete()
    }, 100000)
  }
}