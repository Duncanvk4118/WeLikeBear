import mysql from 'mysql2/promise';
export default defineEventHandler(async (event) => {
    // Verbinding request maken
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'BierLijst'
    });

    // SQL syntax
    const [rows] = await connection.execute('SELECT * FROM beers');

    // Verbreekt de connectie
    await connection.end();

    // Geeft het SQL resultaat terug
    return rows;
});