// app/api.service.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Types ---

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        _id: string;
        name: string;
        email: string;
    };
}

export interface TokenStatus {
    success: boolean;
    tokens: number;
    maxTokens: number;
    active: boolean;
}

export const apiService = {
    async signup(name: string, email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Signup failed");
        return data;
    },

    async verify(email: string, code: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, type: "signup" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Verification failed");
        return data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        return data;
    },

    async logout(): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        // Even if the backend fails, we should proceed with local logout, so strictly throwing might be optional depending on requirement
        // But for consistency with other methods, we process the response.
        return data;
    },

    async uploadCSV(file: File, companyId: string): Promise<any> {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("companyId", companyId);

        const res = await fetch(`${API_BASE_URL}/api/csv/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        return data;
    },

    async getCollections(companyDbUrl: string): Promise<{ success: boolean; collections: string[] }> {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/dbsync/collections`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ companyDbUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch collections");
        return data;
    },

    async syncFromDB(companyDbUrl: string, collectionNames: string[]): Promise<any> {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/dbsync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ companyDbUrl, collectionNames }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "DB sync failed");
        return data;
    },

    async getTokenStatus(companyId: string): Promise<TokenStatus> {
        const res = await fetch(`${API_BASE_URL}/api/token-status/${companyId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch token status");
        return data;
    },
};
