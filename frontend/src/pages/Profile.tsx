import { useForm } from "react-hook-form";
import { fetchApi } from "../api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import type { DbUser } from "../types";

export function Profile() {
    const { user, setUser } = useAuth();
    // On peut utiliser une partie factice ici (Le backend n'a pas forcément de route PUT /api/users/:id)
    // S'il n'y en a pas, oklm, on met le code React pour simuler l'UI.
    const { register, handleSubmit } = useForm<DbUser>({
        defaultValues: {
            name: user?.name,
            email: user?.email
        }
    });
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data: DbUser) => {
        // Idéalement on ferait un PUT vers le backend
        // const res = await fetchApi(`/users/${user?.id}`, { method: "PUT", body: JSON.stringify(data) });
        
        // Pour la demo, juste à jourer le contexte global
        setUser({ ...user!, name: data.name, email: data.email });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Enlève le message après 3s
    };

    if (!user) return <div>Veuillez vous connecter</div>;

    return (
        <div className="form-container">
            <h1>Mon Profil</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Nouveau nom d'utilisateur</label>
                    <input {...register("name", { required: true })} />
                </div>
                
                <div className="form-group">
                    <label>Nouvelle adresse email</label>
                    <input type="email" {...register("email")} />
                </div>

                {success && <p style={{ color: "#4ade80", textAlign: "center", marginBottom: "1rem" }}>Profil mis à jour avec succès !</p>}
                
                <button type="submit" className="btn" style={{ width: "100%" }}>Sauvegarder les modifications</button>
            </form>
        </div>
    );
}
