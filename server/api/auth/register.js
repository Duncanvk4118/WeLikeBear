import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const { email, password, username } = await readBody(event);

    // Maak de databaseverbinding
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        // Check if the email
        const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length > 0) {
            return { statusCode: 409, body: { message: "Email is already in use" } };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await connection.execute(
            "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
            [email, hashedPassword, username]
        );

        // Create token
        const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await connection.end();

        return {
            statusCode: 201,
            body: {
                message: "Registration successful",
                token: token
            }
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: { message: "Error during registration" } };
    }
});
