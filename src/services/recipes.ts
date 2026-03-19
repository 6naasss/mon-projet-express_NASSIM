import { getDb } from "../../database.ts";
import type { DbRecipe } from "../models.ts";

// Logique pour le calcul de difficulté
export function getDifficulty(recipe: DbRecipe): string {
    const { needsOven, needsSpecificEquipment, hasExoticIngredients } = recipe;

    if (needsOven && needsSpecificEquipment && hasExoticIngredients) {
        return "Difficile";
    } else if (needsOven || needsSpecificEquipment || hasExoticIngredients) {
        return "Difficulté moyenne";
    } else {
        return "Facile";
    }
}

export async function getTopRecipes() {
    const db = await getDb();
    // Les 10 plus populaires
    // Exclusion des recettes non consultées depuis > 10 jours SAUF France
    const query = `
        SELECT * FROM recipes 
        WHERE 
            DATEDIFF(NOW(), lastViewedAt) <= 10 
            OR lastViewedAt IS NULL 
            OR originCountry = 'France'
        ORDER BY views DESC 
        LIMIT 10
    `;
    const rows = await db.query(query);
    db.end();

    return rows.map((r: any) => ({
        ...r,
        difficulty: getDifficulty(r)
    }));
}

export async function searchRecipes(query: string) {
    const db = await getDb();
    const rows = await db.query("SELECT * FROM recipes WHERE name LIKE ?", [`%${query}%`]);
    db.end();
    return rows.map((r: any) => ({ ...r, difficulty: getDifficulty(r) }));
}

export async function getRecipeById(id: number) {
    const db = await getDb();
    // Incrémenter la popularité
    await db.query("UPDATE recipes SET views = views + 1, lastViewedAt = NOW() WHERE id = ?", [id]);
    
    // Récupérer la recette
    const rows = await db.query("SELECT * FROM recipes WHERE id = ?", [id]);
    db.end();

    if (rows.length === 0) return null;
    return { ...rows[0], difficulty: getDifficulty(rows[0]) };
}

export async function createRecipe(data: Omit<DbRecipe, "id" | "createdAt" | "updatedAt" | "views" | "lastViewedAt">) {
    const db = await getDb();
    const result = await db.query(
        `INSERT INTO recipes 
        (name, ingredients, servings, needsOven, needsSpecificEquipment, hasExoticIngredients, originCountry, price, authorId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.name, 
            data.ingredients, 
            data.servings, 
            data.needsOven, 
            data.needsSpecificEquipment, 
            data.hasExoticIngredients, 
            data.originCountry, 
            data.price, 
            data.authorId
        ]
    );
    db.end();
    return result.insertId;
}

export async function updateRecipe(id: number, data: Partial<DbRecipe>) {
    const db = await getDb();
    // MàJ basique (code d'étudiant: on construit la query dynamiquement ou on update quelques champs)
    await db.query(`
        UPDATE recipes SET 
            name = COALESCE(?, name),
            ingredients = COALESCE(?, ingredients),
            servings = COALESCE(?, servings),
            needsOven = COALESCE(?, needsOven),
            needsSpecificEquipment = COALESCE(?, needsSpecificEquipment),
            hasExoticIngredients = COALESCE(?, hasExoticIngredients),
            originCountry = COALESCE(?, originCountry),
            price = COALESCE(?, price)
        WHERE id = ?
    `, [
        data.name, data.ingredients, data.servings, data.needsOven, data.needsSpecificEquipment, data.hasExoticIngredients, data.originCountry, data.price, id
    ]);
    db.end();
}

export async function deleteRecipe(id: number) {
    const db = await getDb();
    await db.query("DELETE FROM recipes WHERE id = ?", [id]);
    db.end();
}

export async function duplicateRecipe(id: number, authorId: number) {
    const db = await getDb();
    const rows = await db.query("SELECT * FROM recipes WHERE id = ?", [id]);
    if (rows.length === 0) {
        db.end();
        throw new Error("Recette introuvable");
    }
    const recipe = rows[0];
    
    // On copie la recette avec un nouveau nom
    const result = await db.query(
        `INSERT INTO recipes 
        (name, ingredients, servings, needsOven, needsSpecificEquipment, hasExoticIngredients, originCountry, price, authorId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            recipe.name + " (Copie)", 
            recipe.ingredients, 
            recipe.servings, 
            recipe.needsOven, 
            recipe.needsSpecificEquipment, 
            recipe.hasExoticIngredients, 
            recipe.originCountry, 
            recipe.price, 
            authorId
        ]
    );
    db.end();
    return result.insertId;
}
