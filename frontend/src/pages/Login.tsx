import { useForm } from "react-hook-form";
import { fetchApi } from "../api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { DbUser } from "../types";

export function Login() {
    const { register, handleSubmit } = useForm();
    const { setUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            setError(null);
            // On envoie name et password au backend
            const res = await fetchApi("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errJson = await res.text();
                setError(errJson || "Mauvais identifiants !");
                return;
            }

            // Si c'est ok, le serveur renvoie l'utilisateur (cookie JWT créé automatiquement par le backend)
            const userData: DbUser = await res.json();
            setUser(userData);
            
            // Redirection vers l'accueil !
            navigate("/");
            
        } catch (err) {
            setError("Erreur de réseau : Le serveur dort ?");
        }
    };

    return (
        <div className="form-container">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    <input {...register("name", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input type="password" {...register("password", { required: true })} />
                </div>

                {error && <p className="error-text">{error}</p>}
                
                <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }}>Se connecter</button>

                <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Pas encore de compte ? <Link to="/register" style={{ color: "var(--primary-color)" }}>S'inscrire</Link>
                </p>
            </form>
        </div>
    );
}
