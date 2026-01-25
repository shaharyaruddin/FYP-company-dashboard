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
        // type is hardcoded to "signup" as per backend requirement for registration
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
};
