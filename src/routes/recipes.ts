import { Router } from "express";
import { checkAuth } from "#middlewares/auth";
import * as recipeCtrl from "#controllers/recipes";

const router = Router();

// Routes publiques
router.get("/", recipeCtrl.getHomeRecipes);
router.get("/search", recipeCtrl.searchRecipes);
router.get("/:id", recipeCtrl.getRecipe);

// Routes privées (utilisateur connecté)
router.post("/", checkAuth, recipeCtrl.createRecipe);
router.post("/:id/duplicate", checkAuth, recipeCtrl.duplicateRecipe);
router.put("/:id", checkAuth, recipeCtrl.updateRecipe);
router.delete("/:id", checkAuth, recipeCtrl.deleteRecipe);

export { router as recipesRouter };
