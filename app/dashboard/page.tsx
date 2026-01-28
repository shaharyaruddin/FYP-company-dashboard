"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "../api.service";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [dbUrl, setDbUrl] = useState("");
    const [collections, setCollections] = useState<string[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'selecting' | 'syncing'>('input');

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/");
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    const handleFetchCollections = async () => {
        if (!dbUrl) {
            alert("Please enter a database connection string");
            return;
        }
        setLoading(true);
        try {
            const res = await apiService.getCollections(dbUrl);
            setCollections(res.collections);
            setStep('selecting');
        } catch (error: any) {
            alert(error.message || "Failed to fetch collections");
        } finally {
            setLoading(false);
        }
    };

    const toggleCollection = (name: string) => {
        setSelectedCollections(prev =>
            prev.includes(name)
                ? prev.filter(c => c !== name)
                : [...prev, name]
        );
    };

    const handleSync = async () => {
        if (selectedCollections.length === 0) {
            alert("Please select at least one collection");
            return;
        }
        setLoading(true);
        setStep('syncing');
        try {
            await apiService.syncFromDB(dbUrl, selectedCollections);
            alert("Database synced successfully!");
            setStep('input');
            setDbUrl("");
            setCollections([]);
            setSelectedCollections([]);
        } catch (error: any) {
            alert(error.message || "Sync failed");
            setStep('selecting');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
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

            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 'input' ? 'Connect Database' : step === 'selecting' ? 'Select Collections' : 'Syncing Data'}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {step === 'input'
                                ? 'Enter your MongoDB connection string to fetch collections.'
                                : step === 'selecting'
                                    ? 'Choose the collections you want to sync with your AI assistant.'
                                    : 'Please wait while we sync your data...'}
                        </p>
                    </div>

                    {step === 'input' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="dbUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    MongoDB Connection String
                                </label>
                                <input
                                    type="text"
                                    id="dbUrl"
                                    placeholder="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
                                    value={dbUrl}
                                    onChange={(e) => setDbUrl(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <button
                                onClick={handleFetchCollections}
                                disabled={loading || !dbUrl}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition duration-200"
                            >
                                {loading ? "Fetching..." : "Fetch Collections"}
                            </button>
                        </div>
                    )}

                    {step === 'selecting' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto p-2">
                                {collections.map(name => (
                                    <label
                                        key={name}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${selectedCollections.includes(name)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedCollections.includes(name)}
                                            onChange={() => toggleCollection(name)}
                                        />
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition ${selectedCollections.includes(name) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                                            }`}>
                                            {selectedCollections.includes(name) && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 truncate">{name}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep('input')}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSync}
                                    disabled={loading || selectedCollections.length === 0}
                                    className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition"
                                >
                                    {loading ? "Syncing..." : `Sync ${selectedCollections.length} Collection${selectedCollections.length !== 1 ? 's' : ''}`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'syncing' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative w-20 h-20 mb-6">
                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-gray-600 font-medium animate-pulse">
                                Syncing data from your database...
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
