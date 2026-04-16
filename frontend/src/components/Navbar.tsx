import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Fonction de déconnexion
    const handleLogout = async () => {
        await logout();
        navigate("/login"); // On redirige vers la page de login après déconnexion
    };

    return (
        <nav className="navbar">
            {/* Lien vers l'accueil */}
            <Link to="/" className="logo">👨‍🍳 Cordon-Bleu</Link>

            <div className="nav-links">
                {/* Si l'utilisateur est connecté, on affiche les liens privés */}
                {user ? (
                    <>
                        <span>Salut, {user.name} !</span>
                        <Link to="/create-recipe" className="btn btn-secondary">+ Nouvelle Recette</Link>
                        <button onClick={handleLogout} className="btn">Déconnexion</button>
                    </>
                ) : (
                    /* Sinon on affiche les liens publics */
                    <>
                        <Link to="/login" className="btn btn-secondary">Se connecter</Link>
                        <Link to="/register" className="btn">S'inscrire</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
