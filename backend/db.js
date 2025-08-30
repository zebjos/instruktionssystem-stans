const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "instruktionssystem.db");
const db = new Database(dbPath);

// Initialize schema if needed
const schema = fs.readFileSync(path.join(__dirname, "init.sql"), "utf-8");
db.exec(schema);

module.exports = db;