import mysql from "mysql2/promise";

export default defineEventHandler(async (event) => {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    const queries = {
        beers: "SELECT * FROM likes ORDER BY rating DESC LIMIT 10",
        brewers: `
            SELECT b.brewer, COALESCE(AVG(l.rating), 0) as average_rating
            FROM beers b
                     LEFT JOIN likes l ON l.bier_id = b.id
            GROUP BY b.brewer
            ORDER BY average_rating DESC
                LIMIT 10
        `,
        types: `
            SELECT b.type, COALESCE(AVG(l.rating), 0) as average_rating
            FROM beers b
                     LEFT JOIN likes l ON l.bier_id = b.id
            GROUP BY b.type
            ORDER BY average_rating DESC
                LIMIT 10
        `,
        beersMostRated: `
            SELECT b.id, b.name, COUNT(l.rating) as rating_count
            FROM likes l
                     JOIN beers b ON l.bier_id = b.id
            GROUP BY b.id, b.name
            ORDER BY rating_count DESC
                LIMIT 10
        `
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
        const [rows] = await connection.execute(query);
        results[key] = rows;
    }

    await connection.end();
    return results;
});