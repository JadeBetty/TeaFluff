module.exports = {
    event: "interactionCreate",
    async run(interaction) {
        const client = require("..");
        if (interaction.isCommand()) {
            return;
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            if (!button) {
                return await interaction.followUp({
                    content: "Button not handled. Please contact the devs!",
                    ephemeral: true,
                });
            } else if (
                button.permissions &&
                !interaction.member.permissions.has(button.permissions)
            ) {
                return await interaction.reply({
                    content:
                        "You do not have the required permissions to use this button.",
                    ephemeral: true,
                });
            } else if (
                button.devOnly &&
                !config.devs.includes(interaction.member.id)
            ) {
                return await interaction.reply({
                    content: "This button is only available for developers.",
                    ephemeral: true,
                });
            } else if (
                button.ownerOnly &&
                interaction.guild.ownerId !== interaction.member.id
            ) {
                return await interaction.reply({
                    content: "This button is only available for the guild owner.",
                    ephemeral: true,
                });
            }

            try {
                await button.run(client, interaction);
            } catch (err) {
                console.log(err);
                await interaction.reply({
                    content: `An error occured. Please contact the devs! Error: \`\`\`${err}\`\`\``,
                    ephemeral: true,
                });
            }
        }
    },
};
