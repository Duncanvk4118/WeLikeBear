import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;  // Haal de ID op uit de URL.
    const method = event.node.req.method; // Haal de HTTP-methode op (GET, PUT, enz.)

    // Haal de body op voor PUT/POST-aanroepen
    let body = {};
    if (method === 'PUT') {
        body = await readBody(event); // Hier wordt de body uit de request gehaald
    }

    console.log(body);

    // Databaseverbinding opzetten
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    switch (method) {
        case 'PUT':
            if (!id) {
                return { error: 'Geen ID opgegeven voor de PUT-aanroep' };
            }

            // Checkt of er al een like / dislike bestaat
            const [likeRow] = await connection.execute('SELECT * FROM likes WHERE bier_id = ? AND cookie_id = ?', [id, body.cookieId])

            if (likeRow.length === 0) {
                const [createLike] = await connection.execute('INSERT INTO likes (bier_id, cookie_id, dislike) VALUES (?,?,?)', [id, body.cookieId, false])
            }

            if (likeRow.length > 0) {
                if (likeRow[0].dislike && body.type === "Like") {
                    const [updateLike] = connection.execute('UPDATE likes SET dislike = ? WHERE bier_id = ? AND cookie_id = ?', [false, id, body.cookieId])
                    console.log(updateLike)
                } else if (!likeRow[0].dislike && body.type === "Dislike") {
                    const [updateLike] = connection.execute('UPDATE likes SET dislike = ? WHERE bier_id = ? AND cookie_id = ?', [true, id, body.cookieId])
                    console.log(updateLike)
                } else {
                    return false;
                }
            }

            // Haal het bier op basis van de ID
            const [row] = await connection.execute('SELECT * FROM beers WHERE id = ?', [id]);
            console.log("Oude like_count:", row[0]?.like_count);

            if (row.length > 0) {
                let newLikes = row[0].like_count;

                // Controleer het type en pas de like_count aan
                if (body.type === 'Like') {
                    newLikes ++; // Verhoog de like_count
                } else if (body === 'Dislike') {
                    newLikes.type --; // Verlaag de like_count
                } else {
                    return { error: 'Ongeldig type. Gebruik "like" of "dislike".' };
                }

                console.log("Nieuwe like_count:", newLikes);

                // Update de likes
                await connection.execute(
                    'UPDATE beers SET like_count = ? WHERE id = ?',
                    [newLikes, id]
                );

                await connection.end();
                return { message: `Je hebt het biertje met de id ${id} geliket of gedisliket, de likes bedragen nu ${newLikes}.` };
            } else {
                await connection.end();
                return { error: `Bier met id ${id} niet gevonden.` };
            }

        default:
            return { error: 'Methode niet ondersteund.' };
    }
    return true;
});