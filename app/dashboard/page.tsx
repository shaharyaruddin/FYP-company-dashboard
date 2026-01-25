"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "../api.service";

export default function DashboardPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Auth Check
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/");
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;
        setUploading(true);

        try {
            await apiService.uploadCSV(file, user._id);
            alert(`File "${file.name}" uploaded successfully!`);
            setFile(null);
        } catch (error: any) {
            alert(error.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    if (!user) return null; // or loading spinner

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Company Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Welcome, {user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Upload Knowledge Base</h2>
                        <p className="text-gray-500 mt-2">
                            Upload a CSV file to train your AI assistant with company data.
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 transition duration-200">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="csv-upload"
                            className={`cursor-pointer flex flex-col items-center justify-center gap-4 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                            </div>
                            <div className="text-gray-600">
                                <span className="font-semibold text-blue-600">Click to upload</span>{" "}
                                or drag and drop
                                <div className="text-xs text-gray-400 mt-1">
                                    CSV files only (MAX. 5MB)
                                </div>
                            </div>
                        </label>
                    </div>

                    {file && (
                        <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg text-left">
                            <span className="text-sm font-medium text-blue-900 truncate">
                                {file.name}
                            </span>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md transition"
                            >
                                {uploading ? "Uploading..." : "Upload Now"}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
