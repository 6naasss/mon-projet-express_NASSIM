import { useForm } from "react-hook-form";
import { fetchApi } from "../api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DbRecipe } from "../types";

export function RecipeForm() {
    const { id } = useParams(); // S'il y a un ID dans l'URL, c'est une modification !
    const isEditMode = Boolean(id);
    const { register, handleSubmit, reset } = useForm<DbRecipe>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Au chargement, si on est en mode édition, on va chercher la recette existante
    useEffect(() => {
        if (isEditMode) {
            fetchApi(`/recipes/${id}`).then(async res => {
                if (res.ok) {
                    const data = await res.json();
                    reset(data); // Remplit le formulaire magiquement avec react-hook-form
                }
            });
        }
    }, [id, isEditMode, reset]);

    const onSubmit = async (data: DbRecipe) => {
        try {
            // Conversion des checkbox (vrai/faux) en entiers (1/0) pour SQLite
            const payload = {
                ...data,
                needsOven: data.needsOven ? 1 : 0,
                needsSpecificEquipment: data.needsSpecificEquipment ? 1 : 0,
                hasExoticIngredients: data.hasExoticIngredients ? 1 : 0,
                servings: Number(data.servings),
                price: Number(data.price)
            };

            const url = isEditMode ? `/recipes/${id}` : "/recipes";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetchApi(url, {
                method,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const text = await res.text();
                // Redirige vers la page d'accueil ou la recette
                navigate("/");
            } else {
                setError(await res.text());
            }
        } catch (err) {
            setError("Erreur serveur inattendue");
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: "700px" }}>
            <h1>{isEditMode ? "Modifier la recette ✏️" : "Nouvelle Recette 🍳"}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Nom du plat</label>
                    <input {...register("name", { required: true })} />
                </div>
                
                <div className="form-group">
                    <label>Ingrédients & Préparation</label>
                    <textarea rows={5} {...register("ingredients", { required: true })} />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Nombre de personnes</label>
                        <input type="number" {...register("servings", { required: true, min: 1 })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Prix estimé (€)</label>
                        <input type="number" {...register("price", { required: true, min: 0 })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Pays d'origine</label>
                        <input {...register("originCountry", { required: true })} />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                        <input type="checkbox" {...register("needsOven")} /> Besoin d'un Four ?
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                        <input type="checkbox" {...register("needsSpecificEquipment")} /> Équipement Spécifique ?
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                        <input type="checkbox" {...register("hasExoticIngredients")} /> Ingrédients Exotiques ?
                    </label>
                </div>

                {error && <p className="error-text">❌ {error}</p>}
                
                <button type="submit" className="btn" style={{ width: "100%" }}>
                    {isEditMode ? "Sauvegarder" : "Publier ma recette"}
                </button>
            </form>
        </div>
    );
}
