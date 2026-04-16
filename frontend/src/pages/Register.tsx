import { useForm } from "react-hook-form";
import { fetchApi } from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
    // register permet de lier l'input au hook
    // handleSubmit s'occupe de la soumission sans recharger la page
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Pour vérifier que mot de passe == confirmation (fonction native simple)
    const password = watch("password");

    const onSubmit = async (data: any) => {
        try {
            setServerError(null);

            // Comme le backend attend le champ `data` en JSON stringifié ET un avatar, on utilise un FormData !
            const formData = new FormData();
            
            // On prépare le payload (comme sur Thunder Client !)
            const payloadArray = {
                name: data.name,
                password: data.password,
                confirmPassword: data.confirmPassword
            };
            formData.append("data", JSON.stringify(payloadArray));

            // Si un fichier avatar a été mis
            if (data.avatar && data.avatar.length > 0) {
                formData.append("avatar", data.avatar[0]);
            }

            // Appel API
            const res = await fetchApi("/auth/register", {
                method: "POST",
                body: formData,
                // ATTENTION: Pas besoin de "Content-Type" : "application/json" car avec FormData, fetch s'occupe du 'multipart/form-data' tout seul
                headers: {} // On efface le header JSON par défaut 
            });

            if (!res.ok) {
                setServerError(await res.text());
                return;
            }

            // Inscription réussie !
            alert("Compte créé avec succès ! Connecte-toi maintenant.");
            navigate("/login");
        } catch (err) {
            setServerError("Erreur du serveur !");
        }
    };

    return (
        <div className="form-container">
            <h1>S'inscrire 📝</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    {/* Exigence: minLength, required */}
                    <input {...register("name", { required: "Pseudonyme requis" })} />
                    {errors.name && <span className="error-text">{errors.name.message?.toString()}</span>}
                </div>

                <div className="form-group">
                    <label>Mot de passe</label>
                    <input type="password" {...register("password", { required: "Mot de passe requis", minLength: { value: 3, message: "Trop court" } })} />
                    {errors.password && <span className="error-text">{errors.password.message?.toString()}</span>}
                </div>

                <div className="form-group">
                    <label>Confirmation</label>
                    <input type="password" {...register("confirmPassword", { 
                        required: "Veuillez confirmer", 
                        validate: value => value === password || "Les mots de passe ne correspondent pas !" 
                    })} />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message?.toString()}</span>}
                </div>

                {serverError && <p className="error-text">❌ {serverError}</p>}
                
                <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }}>Créer mon compte</button>
            </form>
        </div>
    );
}
