import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const { name, email, password } = readBody(event);

    // Maak de databaseverbinding
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        // Controleer of de gebruiker al bestaat
        const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length > 0) {
            // Als de gebruiker al bestaat
            return { statusCode: 400, body: "User already exists" };
        }

        // Wachtwoord hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Nieuwe gebruiker aanmaken
        await connection.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        // Sluit de verbinding
        await connection.end();

        return { statusCode: 200, body: "User created successfully" };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error creating user" };
    }
});
