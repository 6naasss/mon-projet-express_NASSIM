import { Link } from "react-router-dom";
import type { DbRecipe } from "../types";

interface RecipeCardProps {
    recipe: DbRecipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    // Petit utilitaire pour changer la couleur du "Badge" selon la difficulté
    const getBadgeClass = (diff: string = "Facile") => {
        if (diff === "Difficile") return "badge difficile";
        if (diff.includes("moyenne")) return "badge moyenne";
        return "badge facile";
    };

    return (
        <Link to={`/recipe/${recipe.id}`} className="card">
            {/* Zone d'image factice design */}
            <div className="card-img">
                <span style={{ fontSize: "2rem", color: "var(--text-muted)" }}>Aperçu non disponible</span>
            </div>
            
            {/* Contenu textuel */}
            <div className="card-content">
                <span className={getBadgeClass(recipe.difficulty)}>
                    {recipe.difficulty || "Facile"}
                </span>
                <h3 className="card-title">{recipe.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", flexGrow: 1 }}>
                    {recipe.originCountry ? `Origine : ${recipe.originCountry}` : "Cuisine du monde"}
                </p>
                
                <div style={{ marginTop: "1rem", fontWeight: "bold", color: "var(--primary-color)" }}>
                    {recipe.views} vues
                </div>
            </div>
        </Link>
    );
}
