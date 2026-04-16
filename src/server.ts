import express, { type Request, type Response } from 'express';
import session from 'express-session';

const app = express();

// --- CONFIGURATION ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// 2) MISE EN PLACE DE LA SESSION
app.use(session({
    secret: 'clavier-chat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        username: string;
    }
}

// --- ROUTES D'AUTHENTIFICATION ---

// Login
app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.send("Connexion réussie !");
    } else {
        res.status(401).send("Identifiants incorrects.");
    }
});

// Logout
app.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.send("Erreur lors de la déconnexion");
        res.send("Vous êtes déconnecté.");
    });
});

// Vérification d'auth sur données à afficher
app.get('/admin-data', (req: Request, res: Response) => {
    if (req.session.isLoggedIn) {
        res.json({
            message: "Ceci sont des données secrètes",
            utilisateur: req.session.username,
            donnees: [10, 20, 30]
        });
    } else {
        res.status(403).send("Accès refusé. Veuillez vous connecter.");
    }
});

import { createApp } from '../createAPP.ts';
import { schemaExist, createSchema } from '../database.ts';

const apiApp = createApp();
app.use(apiApp);

schemaExist().then(exists => {
    if(!exists) {
        console.log("Creation du schema SQLite...");
        return createSchema();
    }
}).then(() => {
    app.listen(3000, () => console.log("Serveur prêt sur http://localhost:3000 et API disponibles"));
}).catch(console.error);