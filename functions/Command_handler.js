const fs = require('fs');
module.exports = (client, Discord) => {
    let command_folders = fr.readdirSync("./Commands").forEach(folder => {
        const command_files = fs.readdirSync("./Commands").filter(file => file.endsWith('.js'));
        command_files.forEach(f => {
            const command = require(`../Commands/${folder}/${f}`)
            client.commands.set(command.name, command)
            if(command.aliases) {
                command.aliases.forEach(alias => {
                    client.aliases.set(alias, command)
                })
            } else {
                continue;
            }
        })
    })
    console.log(`Successfully loaded ${client.commands.size} commands!`)
    
    /*
    const command_files = fs.readdirSync("./Commands").filter(file => file.endsWith('.js'));
    for(const file of command_files){
        const command = require(`../Commands/${folder}`);
        if(command.name){
            client.commands.set(command.name, command);
            if (command.aliases) {
                command.aliases.forEach(alias => {
                    client.aliases.set(alias, command);
                })
        } else {
            continue;
        }
    }
} */
}