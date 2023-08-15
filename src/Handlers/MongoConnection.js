const chalk = require("chalk");
const { connection, connect, default: mongoose } = require("mongoose");
module.exports = (client) => {
  let Connect = process.env.mongo;
  const HOSTS_REGEX =
    /^(?<protocol>[^/]+):\/\/(?:(?<username>[^:@]*)(?::(?<password>[^@]*))?@)?(?<hosts>(?!:)[^/?@]*)(?<rest>.*)/;
  const match = Connect.match(HOSTS_REGEX);
  if (!match) {
    return console.error(
      chalk.red.bold(`[DATABASE]- Invalid connection string "${Connect}"`)
    );
  }
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    connectTimeoutMS: 10000,
    family: 4,
  };
  mongoose.set('strictQuery', false);

  connection.on("connecting", () => {
    console.log(chalk.yellowBright("[DATABASE]- Mongoose is connecting..."));
  });

  connect(Connect, dbOptions);
  Promise = Promise;

  connection.on("connected", () => {
    console.log(
      chalk.greenBright("[DATABASE]- Mongoose has successfully connected!")
    );
  });

  connection.on("err", (err) => {
    console.error(
      chalk.redBright(`[DATABASE]- Mongoose connection error: \n${err.stack}`)
    );
  });

  connection.on("disconnected", () => {
    console.warn(chalk.red("[DATABASE]- Mongoose connection lost"));
  });
};