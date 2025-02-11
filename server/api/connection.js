import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    // Haal de ID uit de URL voor de PUT-aanroep
    const { id } = event.context.params;  // Dit haalt de ID op uit de URL.

    // Maak de databaseverbinding
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
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