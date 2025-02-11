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
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'BierLijst'
    });

    switch (method) {
        case 'PUT':
            if (!id) {
                return { error: 'Geen ID opgegeven voor de PUT-aanroep' };
            }

            // Haal het bier op basis van de ID
            const [row] = await connection.execute('SELECT * FROM beers WHERE id = ?', [id]);
            console.log("Oude like_count:", row[0]?.like_count);

            if (row.length > 0) {
                let newLikes = row[0].like_count;

                // Controleer het type en pas de like_count aan
                if (body === 'Like') {
                    newLikes += 1; // Verhoog de like_count
                } else if (body === 'Dislike') {
                    newLikes -= 1; // Verlaag de like_count
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