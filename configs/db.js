const Sequelize = require("sequelize");
require("dotenv").config();

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  host: process.env.DB_HOST_URI,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
};

let config = dbConfig;
console.log("dbConfig:" + JSON.stringify(config));

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect
  }
);

module.exports.config = config;
module.exports.sequelize = sequelize;
