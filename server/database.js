import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function getNotes()  {
    const [rows] = await pool.query("SELECT * FROM beers");
    return rows;
}

const notes = await getNotes();
console.log(notes);