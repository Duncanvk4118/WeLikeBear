import mysql from "mysql2/promise";

export default defineEventHandler(async (event) => {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    const [rows] = await connection.execute('SELECT * FROM likes');
    await connection.end();
    return rows;
});