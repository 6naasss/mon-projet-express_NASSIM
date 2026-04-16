import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchApi } from "../api";
import type { DbRecipe } from "../types";
import { useAuth } from "../context/AuthContext";

export function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState<DbRecipe | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const res = await fetchApi(`/recipes/${id}`);
                if (res.ok) {
                    setRecipe(await res.json());
                } else {
                    setError("Impossible de charger cette recette.");
                }
            } catch (err) {
                setError("Erreur de connexion.");
            }
        };
        loadRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Supprimer cette recette ?")) return;
        const res = await fetchApi(`/recipes/${id}`, { method: "DELETE" });
        if (res.ok) navigate("/");
        else alert("Erreur lors de la suppression");
    };

    const handleDuplicate = async () => {
        const res = await fetchApi(`/recipes/duplicate/${id}`, { method: "POST" });
        if (res.ok) {
            const newRecipe = await res.json();
            navigate(`/recipe/${newRecipe.id}`);
        } else {
            alert("Erreur de duplication");
        }
    };

    if (error) return <div className="container" style={{ color: "red", textAlign: "center" }}><h2>{error}</h2></div>;
    if (!recipe) return <div className="container" style={{ textAlign: "center" }}><h2>Chargement de la recette...</h2></div>;

    // Est-ce qu'on est l'auteur ?
    const isOwner = user && user.id === recipe.authorId;

    return (
        <div className="form-container" style={{ maxWidth: "800px" }}>
            <div className="recipe-header">
                <div>
                    <span className="badge facile">{recipe.difficulty || "Non calculée"}</span>
                    <h1 style={{ marginBottom: "0.5rem" }}>{recipe.name}</h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Origine: {recipe.originCountry || "Inconnue"} • Prix: {recipe.price}€ • Portions: {recipe.servings} personne(s)
                    </p>
                </div>
                
                {/* Actions uniquement visibles pour l'auteur de la recette */}
                {isOwner && (
                    <div className="actions">
                        <button onClick={handleDuplicate} className="btn btn-secondary">Dupliquer</button>
                        <Link to={`/edit-recipe/${recipe.id}`} className="btn btn-secondary">Modifier</Link>
                        <button onClick={handleDelete} className="btn" style={{ background: "transparent", border: "1px solid red", color: "red" }}>Supprimer</button>
                    </div>
                )}
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h3>Ingrédients & Préparation</h3>
                <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginTop: "1rem", whiteSpace: "pre-line" }}>
                    {recipe.ingredients}
                </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                {recipe.needsOven === 1 && <span className="badge moyenne">Four Requis</span>}
                {recipe.needsSpecificEquipment === 1 && <span className="badge moyenne">Équipement Spécifique</span>}
                {recipe.hasExoticIngredients === 1 && <span className="badge moyenne">Ingrédients Exotiques</span>}
            </div>
        </div>
    );
}
