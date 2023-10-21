const Sequelize = require("sequelize");
require("dotenv").config();

const dbConfig = {
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  dialect: process.env.DB_DIALECT,
  host:process.env.POSTGRES_HOST
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
  },
  {
    dialectModule: require('pg')
  }
);

module.exports.config = config;
module.exports.sequelize = sequelize;
