export const API_URL = "http://localhost:3000/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const isFormData = options.body instanceof FormData;

    // json par défaut, sauf si c'est un FormData (pour upload d'image)
    const defaultHeaders: any = {};
    if (!isFormData) {
        defaultHeaders["Content-Type"] = "application/json";
    }

    const finalOptions: RequestInit = {
        ...options,
        credentials: "include",
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
    };
    return fetch(`${API_URL}${endpoint}`, finalOptions);
}
