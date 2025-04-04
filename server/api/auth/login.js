import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event);

    // Maak de databaseverbinding
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return { statusCode: 404, body: "User not found" };
        }

        const user = rows[0];

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return { statusCode: 401, body: "Invalid credentials" };
        }

        // Create tooken
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
