export type DbUser = {
    id: number;
    name: string;
    email: string | null;
    passwordHash: string;
    avatar: string | null;
};

export type LoginData = {
    name: string;
    password: string;
};

export type RegisterData = {
    name: string;
    password: string;
    confirmPassword: string;
    // L'avatar est envoyé séparément en tant que fichier (multipart/form-data) via Multer
};

export type SessionLoginData = {
    username: string;
    password: string;
};

export type DbRecipe = {
    id: number;
    name: string;
    ingredients: string; // On peut stocker un JSON stringifié
    servings: number;
    needsOven: boolean; // Ou 0/1 selon la BDD
    needsSpecificEquipment: boolean;
    hasExoticIngredients: boolean;
    originCountry: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    views: number;
    lastViewedAt: Date | null;
};
