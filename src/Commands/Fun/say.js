
module.exports = {
  name: "say",
  description: "Make the bot says something",
  category: 'Fun',
  run: async (client, message, args) => {
    let toSay = args.join(" ")
    if (!toSay) return message.channel.send({ content: "You have to say something" })
    message.channel.send({ content: toSay })
    message.delete()
  }
}