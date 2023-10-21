const Sequelize = require("sequelize");
require("dotenv").config();

const dbConfig = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
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
    dialect: config.dialect,
    dialectOptions: {
      ssl: {
        require: true, // This enforces the use of SSL
      }
    }
  },
  {
    dialectModule: require('pg')
  }
);

module.exports.config = config;
module.exports.sequelize = sequelize;
