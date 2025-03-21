import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const { email, password } = readBody(event);

    // Maak de databaseverbinding
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        // Haal de gebruiker op uit de database op basis van het e-mailadres
        const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            // Gebruiker bestaat niet
            return { statusCode: 404, body: "User not found" };
        }

        const user = rows[0]; // De eerste (en enige) rij die overeenkomt

        // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            // Wachtwoord komt niet overeen
            return { statusCode: 401, body: "Invalid credentials" };
        }

        // Login is succesvol, hier kun je een sessie of een token aanmaken
        // Bijvoorbeeld een JWT token:
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Sluit de verbinding
        await connection.end();

        return {
            statusCode: 200,
            body: {
                message: "Login successful",
                token: token
            }
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error during login" };
    }
});
