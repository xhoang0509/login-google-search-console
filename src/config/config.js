require("dotenv").config();
const loggingDev = process.env.DB_LOGGING_DEV === true;
const loggingProduction = process.env.DB_LOGGING_PRODUCTION === true;

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: loggingDev,
        seederStorage: "sequelize",
        seederStorageTableName: "SequelizeSeeder",
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: loggingDev,
        seederStorage: "sequelize",
        seederStorageTableName: "SequelizeSeeder",
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: loggingProduction,
        seederStorage: "sequelize",
        seederStorageTableName: "SequelizeSeeder",
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
    },
};
