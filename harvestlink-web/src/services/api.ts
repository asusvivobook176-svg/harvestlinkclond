const API_BASE_URL = "http://localhost:5000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("harvestlink_token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "An unknown error occurred" }));
        throw new Error(error.error || response.statusText);
    }

    return response.json();
}
