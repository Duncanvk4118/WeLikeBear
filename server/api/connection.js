import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    // Maak de databaseverbinding
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    switch (method) {
        case 'GET':
            // Haal de lijst van alle bieren op
            const [rows] = await connection.execute('SELECT * FROM beers');
            await connection.end();
            return rows;
        default:
            await connection.end();
            return { error: 'Methode niet ondersteund.' };
    }
});