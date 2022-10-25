module.exports = {
    name: 'interactionCreate',
    async run(InteractionType, interaction, client) {
        if (!interaction.type === InteractionType.ApplicationCommand) return;
        const command = InteractionType.client.slashcommands.get(InteractionType.commandName);

        if (!command) return;
    
        try {
            await command.run(InteractionType);
        } catch (error) {
            console.error(error);
            await InteractionType.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};