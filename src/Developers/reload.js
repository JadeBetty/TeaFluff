const { EmbedBuilder, ActivityType } = require("discord.js");
const path = require("path");
const exec = require("child_process").exec;
const fs = require("fs");

module.exports = {
	name: "reload",
	category: "Developers",
	devsOnly: true,
    deleteTrigger: true,
	description: "Reload all the events and commands.",
	aliases: ["reloadall", "restart"],
	disabledChannel: [],
	run: async (client, message, args ) => {
		let msg = await message.author.send({
			embeds: [
				new EmbedBuilder()
                .setTitle("Restarting")
                .setDescription("The bot is now restarting.")
                .setColor("#f09999"),
			],
		});

		client.user.setPresence({
			activities: [{
				name: "Restarting",
				type: ActivityType.Custom
			}],
			status: "idle"
		});


		setTimeout(async () => {
			await msg.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle("Stopped")
						.setDescription("The bot has finally completed stopped.")
						.setColor("#f09999")
						.setFooter({
							text: "The bot shall be back within 10-20 seconds.",
						}),
				],
			});

            const file = path.join(__dirname, "../../restart.txt")
			let data = `${msg.id},${Date.now()},${message.author.id}`;
			fs.writeFileSync(file, data);

			const configPath = path.join(__dirname, "../../config.json");
			fs.readFile(configPath, 'utf-8', (err, data) => {
				if (err) return console.log(err);
				data = data.toString()
				fs.writeFile(configPath, data.replace("\"maintainence\": true", "\"maintainence\": false"), (err) => { console.log(err) });
			});
			exec("pkill -f -SIGHUP nodemon");
		}, 1000); 
	},
};