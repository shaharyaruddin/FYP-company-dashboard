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
            router.push("/welcome");
        } catch (error: any) {
            alert(error.message || "Sync failed");
            setStep('selecting');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/");
        }
    };

    if (!user) return null;

    return (
        <div className="dark">
            <div className="min-h-screen bg-slate-900 hero-gradient flex flex-col relative overflow-x-hidden">
                {/* Global Background Decorations */}
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                {/* Header */}
                <header className="sticky top-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 0 1 8.716 2.253M12 3a9.015 9.015 0 0 0-8.716 2.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-white leading-none uppercase tracking-tight">Console</h1>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Management Node</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-black text-white uppercase tracking-wider">{user.name}</span>
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-2 py-0.5 rounded-md mt-1">Admin Access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.push("/welcome")}
                                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all"
                                        title="View Sync Status"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-500 transition-all"
                                        title="Sign Out"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-16 lg:p-24 relative">
                    <div className="space-y-16 relative z-10">
                        {/* Page Intro */}
                        <div className="max-w-3xl space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">
                                    Initialization Phase {step === 'input' ? '01' : step === 'selecting' ? '02' : '03'}
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9] uppercase">
                                {step === 'input' ? 'Knowledge Core' : step === 'selecting' ? 'Data Mapping' : 'Synchronizing'}
                            </h2>
                            <p className="text-xl text-blue-100/60 font-light max-w-xl leading-relaxed">
                                {step === 'input'
                                    ? 'Connect your database cluster to begin training your custom agent.'
                                    : step === 'selecting'
                                        ? 'Map the specific datasets that will form your AI engine.'
                                        : 'Indexing and optimizing your private datasets.'}
                            </p>
                        </div>

                        {/* Action Card */}
                        <div className="glass-card rounded-[3rem] shadow-2xl p-8 sm:p-12 border border-white/10 backdrop-blur-2xl animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
                            {step === 'input' && (
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label htmlFor="dbUrl" className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                                            Cloud Connection String
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="dbUrl"
                                                placeholder="mongodb+srv://cluster.namespace.mongodb.net"
                                                value={dbUrl}
                                                onChange={(e) => setDbUrl(e.target.value)}
                                                className="input-field pl-16 py-5 text-lg font-mono focus:shadow-2xl focus:shadow-blue-500/5"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                                            </svg>
                                            Military-grade encryption applied
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleFetchCollections}
                                        disabled={loading || !dbUrl}
                                        className="btn-primary w-full py-5 text-xl tracking-tight"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-4">
                                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Accessing Cluster...
                                            </span>
                                        ) : (
                                            "Verify & Connect"
                                        )}
                                    </button>
                                </div>
                            )}

                            {step === 'selecting' && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[450px] overflow-y-auto p-4 custom-scrollbar">
                                        {collections.map(name => (
                                            <label
                                                key={name}
                                                className={`group relative flex flex-col p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden ${selectedCollections.includes(name)
                                                    ? 'border-blue-600 bg-blue-600 text-white shadow-2xl shadow-blue-500/30 -translate-y-1'
                                                    : 'border-white/5 bg-white/5 dark:bg-white/5 hover:border-blue-500/30 text-blue-100/40'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedCollections.includes(name)}
                                                    onChange={() => toggleCollection(name)}
                                                />
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedCollections.includes(name) ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-400'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75" />
                                                        </svg>
                                                    </div>
                                                    {selectedCollections.includes(name) && (
                                                        <div className="bg-white text-blue-600 rounded-full p-1 animate-scale-in">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-lg font-black tracking-tight truncate uppercase">
                                                    {name}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedCollections.includes(name) ? 'text-blue-100/60' : 'text-blue-100/20'}`}>
                                                    Collection Node
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setStep('input')}
                                            className="px-10 py-5 rounded-full border-2 border-white/5 text-blue-100/30 hover:text-white hover:border-white/10 transition-all font-black uppercase text-xs tracking-[0.2em]"
                                        >
                                            Modify Cluster
                                        </button>
                                        <button
                                            onClick={handleSync}
                                            disabled={loading || selectedCollections.length === 0}
                                            className="btn-primary flex-1 py-5 text-xl"
                                        >
                                            {loading ? "Optimizing Assets..." : `Synchronise ${selectedCollections.length} Source${selectedCollections.length !== 1 ? 's' : ''}`}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'syncing' && (
                                <div className="flex flex-col items-center justify-center py-20 space-y-12">
                                    <div className="relative">
                                        <div className="w-40 h-40 border-l-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                                        <div className="w-40 h-40 border-r-4 border-b-4 border-blue-200 dark:border-blue-900/30 rounded-full absolute top-0 left-0"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 animate-pulse">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-4">
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">Syncing Live Data</h3>
                                        <p className="text-blue-100/60 font-medium max-w-sm mx-auto">
                                            Processing knowledge blocks and training the NLP model for your specific company logic.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                </main>
            </div>
        </div>
    );
}
