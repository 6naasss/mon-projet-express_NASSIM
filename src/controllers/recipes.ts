import type { Request, Response } from "express";
import * as recipeService from "#services/recipes";
import { getDb } from "../../database.ts";

// Fonction simple pour récupérer l'ID de l'auteur depuis son pseudo
async function getAuthorId(username: string) {
    const db = await getDb();
    const rows = await db.query("SELECT id FROM users WHERE name = ?", [username]);
    db.end();
    return rows.length > 0 ? rows[0].id : null;
}

export async function getHomeRecipes(req: Request, res: Response) {
    try {
        // La page d'accueil affiche les 10 recettes les plus consultées
        const recipes = await recipeService.getTopRecipes();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des recettes" });
    }
}

export async function searchRecipes(req: Request, res: Response) {
    try {
        const q = req.query.q as string || "";
        const recipes = await recipeService.searchRecipes(q);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la recherche" });
    }
}

export async function getRecipe(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string);
        const recipe = await recipeService.getRecipeById(id);
        if (!recipe) {
            return res.status(404).json({ error: "Recette introuvable" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'affichage de la recette" });
    }
}

export async function createRecipe(req: Request, res: Response) {
    try {
        const userName = (req as any).user.name;
        const authorId = await getAuthorId(userName);
        
        if (!authorId) return res.status(401).json({ error: "Utilisateur non trouvé" });

        const data = req.body;
        data.authorId = authorId;
        
        const newId = await recipeService.createRecipe(data);
        res.status(201).json({ id: newId, message: "Recette ajoutée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la recette" });
    }
}

export async function updateRecipe(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string);
        const userName = (req as any).user.name;
        const authorId = await getAuthorId(userName);
        
        const recipe = await recipeService.getRecipeById(id);
        if (!recipe) return res.status(404).json({ error: "Recette introuvable" });
        if (recipe.authorId !== authorId) return res.status(403).json({ error: "Accès refusé : vous n'êtes pas l'auteur." });

        await recipeService.updateRecipe(id, req.body);
        res.json({ message: "Recette modifiée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification" });
    }
}

export async function deleteRecipe(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string);
        const userName = (req as any).user.name;
        const authorId = await getAuthorId(userName);
        
        const recipe = await recipeService.getRecipeById(id);
        if (!recipe) return res.status(404).json({ error: "Recette introuvable" });
        if (recipe.authorId !== authorId) return res.status(403).json({ error: "Accès refusé : vous n'êtes pas l'auteur." });

        await recipeService.deleteRecipe(id);
        res.json({ message: "Recette supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
}

export async function duplicateRecipe(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string);
        const userName = (req as any).user.name;
        const authorId = await getAuthorId(userName);
        
        if (!authorId) return res.status(401).json({ error: "Utilisateur non trouvé" });

        const recipe = await recipeService.getRecipeById(id);
        if (!recipe) return res.status(404).json({ error: "Recette introuvable" });
        if (recipe.authorId !== authorId) return res.status(403).json({ error: "Accès refusé : vous n'êtes pas l'auteur." });

        const newId = await recipeService.duplicateRecipe(id, authorId);
        res.status(201).json({ id: newId, message: "Recette dupliquée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la duplication" });
    }
}
