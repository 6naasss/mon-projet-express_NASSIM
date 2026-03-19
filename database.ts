import { createPool } from "mariadb";
import { hash } from "bcrypt"

const pool = createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

export function getDb() {
    return pool.getConnection();
}

export async function schemaExist() {
    const connection = await pool.getConnection()
    const tables = await connection.query("SHOW TABLES")
    const usersTableExists = tables.some((table: any) => table["Tables_in_" + process.env.DB_NAME] === "users")
    connection.end()
    return usersTableExists
}

export async function createSchema() {
    const connection = await pool.getConnection()
    await connection.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255),email VARCHAR(255), passwordHash VARCHAR(255),avatar VARCHAR(255))")
    await connection.query("ALTER TABLE users ADD CONSTRAINT users_name_unique UNIQUE (name)")
    await connection.query("ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email)")
    await connection.query("INSERT INTO users(name,email,passwordHash) VALUES ('remy','remy@example.com','" + (await hash("ioupi", 10)) + "')")

    await connection.query(`CREATE TABLE recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        ingredients TEXT,
        servings INT,
        needsOven BOOLEAN,
        needsSpecificEquipment BOOLEAN,
        hasExoticIngredients BOOLEAN,
        originCountry VARCHAR(255),
        price INT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        authorId INT,
        views INT DEFAULT 0,
        lastViewedAt DATETIME,
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
    )`)
    connection.end()
}

export async function deleteSchema() {
    const connection = await pool.getConnection()
    await connection.query("DROP TABLE IF EXISTS recipes")
    await connection.query("DROP TABLE users")
    connection.end()
}