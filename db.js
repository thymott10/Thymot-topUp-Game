const mysql = require("mysql2");

const { db } = require("./config");

const connection = mysql.createConnection(db);

connection.connect((err) => {
  if (err) throw err;
  console.log("✅ Database connected");
});

module.exports = connection;
