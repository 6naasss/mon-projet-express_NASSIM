# Projet Express API

Voici la liste des routes nécessaires pour ce projet :

### API d'Authentification
- `POST /api/auth/register` : créer un profil utilisateur (accepte aussi une image de profil via le champ `avatar`)
- `POST /api/auth/login` : authentifier un utilisateur et récupérer les tokens
- `POST /api/auth/logout` : déconnecter un utilisateur
- `POST /api/auth/refresh` : rafraîchir le jeton d'accès (access token) à l'aide d'un jeton de rafraîchissement (refresh token)

### API Utilisateurs
- `GET /api/users/` : récupérer la liste des utilisateurs (nécessite d'être authentifié avec un token valide)

### Authentification par Session (Classique)
- `POST /login` : se connecter avec le système de session
- `GET /logout` : se déconnecter de la session active
- `GET /admin-data` : accéder à des données secrètes de l'application (nécessite d'être connecté via session)

### API Recettes (Cordon Bleu)
- `GET /api/recipes/` : Récupérer les 10 recettes les plus populaires (page d'accueil)
- `GET /api/recipes/search?q=motcle` : Rechercher une recette par nom
- `GET /api/recipes/:id` : Afficher les détails d'une recette (incrémente les vues)
- `POST /api/recipes/` : Ajouter une nouvelle recette (nécessite un token)
- `POST /api/recipes/:id/duplicate` : Dupliquer une recette existante (nécessite un token)
- `PUT /api/recipes/:id` : Modifier une recette (nécessite un token)
- `DELETE /api/recipes/:id` : Supprimer une recette (nécessite un token)

