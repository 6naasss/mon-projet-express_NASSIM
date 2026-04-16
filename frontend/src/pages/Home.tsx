import { useEffect, useState } from "react";
import { fetchApi } from "../api";
import type { DbRecipe } from "../types";
import { RecipeCard } from "../components/RecipeCard";

export function Home() {
    // État pour stocker la liste des recettes venant du backend
    const [recipes, setRecipes] = useState<DbRecipe[]>([]);
    // État pour la recherche locale
    const [searchTerm, setSearchTerm] = useState("");

    // Utilisation de useEffect pour charger les recettes au montage de la page
    useEffect(() => {
        const loadRecipes = async () => {
            try {
                // Par défaut, notre API sur "/" renvoie le TOP 10 (getTopRecipes)
                const res = await fetchApi("/recipes");
                if (res.ok) {
                    const data = await res.json();
                    setRecipes(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement", error);
            }
        };
        loadRecipes();
    }, []);

    // Fonction pour chercher depuis le backend (si l'utilisateur tape et valide)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Notre backend a une route /search/:query
            const res = await fetchApi(`/recipes/search/${searchTerm}`);
            if (res.ok) {
                const data = await res.json();
                setRecipes(data);
            }
        } catch (error) {
            console.error("Erreur recherche", error);
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "2.5rem" }}>
                Trouvez la recette parfaite 🍽️
            </h1>
            
            {/* Barre de recherche */}
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Chercher une recette (ex: Pizza)..." 
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            {/* Grille affichant les recettes */}
            <div className="grid">
                {recipes.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", gridColumn: "1 / -1" }}>
                        Aucune recette trouvée... N'hésitez pas à en ajouter !
                    </p>
                ) : (
                    recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                )}
            </div>
        </div>
    );
}
