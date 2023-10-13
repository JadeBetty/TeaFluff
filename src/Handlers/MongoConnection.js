const { logger } = require("console-wizard");
const { connection, connect, default: mongoose } = require("mongoose");

module.exports = (client) => {
  let Connect = process.env.mongo;
  const HOSTS_REGEX =
    /^(?<protocol>[^/]+):\/\/(?:(?<username>[^:@]*)(?::(?<password>[^@]*))?@)?(?<hosts>(?!:)[^/?@]*)(?<rest>.*)/;
  const match = Connect.match(HOSTS_REGEX);
  if (!match) {
    return logger.error(`DataBase: Invalid Connection String.`);
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
    logger.info("DataBase: Mongoose is connecting...");
  });

  connect(Connect, dbOptions);
  Promise = Promise;

  connection.on("connected", () => {
    logger.success(`DataBase: Mongoose has successfully connected!`)
  });

  connection.on("err", (err) => {
    logger.error(`DataBase: Mongoose connection error: \n ${er.stack}`)
  });

  connection.on("disconnected", () => {
    logger.warn("DataBase: Mongoose connection lost.")
  });
};