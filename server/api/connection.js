import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
    // Verbinding request maken
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    // SQL syntax
    const [rows] = await connection.execute('SELECT * FROM beers');

    // Verbreekt de connectie
    await connection.end();

    // Geeft het SQL resultaat terug
    return rows;
});