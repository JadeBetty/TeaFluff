const { Client } = require('discord.js');
const { promisify } = require('util');
const chalk = require('chalk');
const glob = require('glob');
const AsciiTable = require('ascii-table');
const fs = require("fs");
const table = new AsciiTable().setHeading('Events', 'Stats').setBorder('|', '=', "0", "0")
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const eventFiles = await globPromise(`${process.cwd().replace(/\\/g, '/')}/src/events/*.js`);
  eventFiles.forEach((ev) => {
    const event = require(ev);
    if (!event?.event || !event?.run) return table.addRow(event.event, '⛔ -> missing event/run')

    client.on(event.event, event.run);
    table.addRow(event.event, '✅')
  })

  console.log(chalk.greenBright(table.toString()));


  const waitersFiles = fs
  .readdirSync('./src/events/waiters')
  .filter(file => file.endsWith('.js'));
// So, create a setInterval() for each waiter file
if(waitersFiles === null || undefined) return;
for (const file of waitersFiles) {

  const waiter = require(`../events/waiters/${file}`);
  setInterval(() => {
    waiter.run(client);
  }, waiter.time);
}


}