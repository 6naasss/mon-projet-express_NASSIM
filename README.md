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
