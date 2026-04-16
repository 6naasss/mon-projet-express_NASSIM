export interface DbUser {
    id: number;
    name: string;
    email?: string;
    passwordHash?: string;
    avatar?: string;
}

export interface DbRecipe {
    id: number;
    name: string;
    ingredients: string;
    servings: number;
    needsOven: number;
    needsSpecificEquipment: number;
    hasExoticIngredients: number;
    originCountry: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
    authorId: number;
    views: number;
    lastViewedAt?: string;
    difficulty?: string; // Calculé par le backend
}
