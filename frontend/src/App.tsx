import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RecipeDetail } from "./pages/RecipeDetail";
import { RecipeForm } from "./pages/RecipeForm";
import { Profile } from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

// Composant pour protéger les routes
function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Routes privées */}
                    <Route path="/create-recipe" element={
                        <ProtectedRoute><RecipeForm /></ProtectedRoute>
                    } />
                    <Route path="/edit-recipe/:id" element={
                        <ProtectedRoute><RecipeForm /></ProtectedRoute>
                    } />
                    
                    {/* On redirige tout ailleurs vers l'accueil */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
