import mysql from "mysql2/promise";

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    const query = getQuery(event); // Voor GET parameters
    const body = method === "POST" ? await readBody(event) : {}; // Voor POST body

    const { rating, bier_id, user_id } = { ...query, ...body }; // Combineer GET en POST data

    if (!user_id) {
        return { error: "user_id is verplicht" };
    }

    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        if (method === "GET") {
            // Validate inputs
            if (!user_id) {
                return { error: "user_id is verplicht" };
            }

            // Get likes from user
            const [rows] = await connection.execute(
                "SELECT * FROM likes WHERE user_id = ?",
                [user_id]
            );
            return rows;
        }

        if (method === "POST") {
            // Validate inputs
            if (!bier_id || rating === undefined) {
                return { error: "bier_id en rating zijn verplicht" };
            }

            // Check like
            const [existingLike] = await connection.execute(
                "SELECT * FROM likes WHERE bier_id = ? AND user_id = ?",
                [bier_id, user_id]
            );

            if (existingLike.length > 0) {
                if (existingLike[0].rating === rating) {
                    // Delete like
                    await connection.execute(
                        "DELETE FROM likes WHERE bier_id = ? AND user_id = ?",
                        [bier_id, user_id]
                    );
                    return { message: "Like verwijderd" };
                }

                // Update like
                await connection.execute(
                    "UPDATE likes SET rating = ? WHERE bier_id = ? AND user_id = ?",
                    [rating, bier_id, user_id]
                );
                return { message: "Like geüpdatet" };
            } else {
                // Add like
                await connection.execute(
                    "INSERT INTO likes (rating, bier_id, user_id) VALUES (?, ?, ?)",
                    [rating, bier_id, user_id]
                );
                return { message: "Like toegevoegd" };
            }
        }

        return { error: "Ongeldige request methode" };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    } finally {
        await connection.end();
    }
});
