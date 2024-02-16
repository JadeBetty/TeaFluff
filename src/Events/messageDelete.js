const h = ["1137619631985664001"];

module.exports = {
event: "messageDelete",
run: async (message, client) => {
console.log(message)
if(h.includes(message.guild.id)) {
client.channels.cache.get("1079312331298832426").send(`message content: ${message.content} by: ${message.author.id} in: ${message.channel.name} guild: ${message.guild.name}`)
}

}
}

// BIG NOTE
// THIS IS FOR MY FRIENDS (I LOG THEIR DELETED MESSAGES FOR SOME REASON, IDK WHY BUT IDK)