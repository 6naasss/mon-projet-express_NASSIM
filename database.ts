import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { hash } from "bcrypt"

let dbInstance: Database | null = null;

export async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });
    }
    
    return {
        query: async (sql: string, params: any[] = []): Promise<any> => {
            const isSelect = sql.trim().toUpperCase().startsWith("SELECT") || sql.trim().toUpperCase().startsWith("SHOW");
            if (isSelect) {
                if (sql.trim().toUpperCase() === "SHOW TABLES") {
                    const tables = await dbInstance!.all("SELECT name FROM sqlite_master WHERE type='table'");
                    return tables.map(t => ({ [`Tables_in_${process.env.DB_NAME || 'database'}`]: t.name }));
                }
                return await dbInstance!.all(sql, params);
            } else {
                const result = await dbInstance!.run(sql, params);
                return {
                    insertId: result.lastID,
                    affectedRows: result.changes
                };
            }
        },
        end: () => {
            // Keep connection alive or fake close
        }
    };
}

export async function schemaExist() {
    const connection = await getDb();
    const tables = await connection.query("SHOW TABLES");
    const usersTableExists = tables.some((table: any) => {
        const key = Object.keys(table)[0];
        return table[key] === "users";
    });
    connection.end();
    return usersTableExists;
}

export async function createSchema() {
    const connection = await getDb()
    await connection.query("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) UNIQUE, email VARCHAR(255) UNIQUE, passwordHash VARCHAR(255), avatar VARCHAR(255))")
    await connection.query("INSERT INTO users(name,email,passwordHash) VALUES ('remy','remy@example.com','" + (await hash("ioupi", 10)) + "')")

    await connection.query(`CREATE TABLE recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        ingredients TEXT,
        servings INTEGER,
        needsOven INTEGER,
        needsSpecificEquipment INTEGER,
        hasExoticIngredients INTEGER,
        originCountry VARCHAR(255),
        price INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        authorId INTEGER,
        views INTEGER DEFAULT 0,
        lastViewedAt DATETIME,
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
    )`)
    connection.end()
}

export async function deleteSchema() {
    const connection = await getDb()
    await connection.query("DROP TABLE IF EXISTS recipes")
    await connection.query("DROP TABLE IF EXISTS users")
    connection.end()
}