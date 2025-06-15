require ('dotenv').config();
const config = {
  db: {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD, // Add your MySQL password here
    database: "testbackend",
    port: 3306
  }
};

module.exports = config;