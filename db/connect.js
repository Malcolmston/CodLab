const { Sequelize } = require('sequelize');

(require('dotenv')).config()

const NAME = process.env.DB_NAME;
const USER = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(NAME, USER, PASSWORD, {
    host: 'localhost',
    dialect: "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

module.exports = sequelize;