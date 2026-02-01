"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiService } from "./api.service";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiService.login(email, password);
            localStorage.setItem("token", response.data!.token);
            localStorage.setItem("user", JSON.stringify(response.data));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark">
            <div className="h-screen flex items-center justify-center bg-slate-900 hero-gradient p-4 relative overflow-hidden">
                <div className="w-full max-w-md relative z-10 scale-[0.9] sm:scale-100 origin-center">
                    {/* Logo/Brand Area */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-900/50 mb-4 transform hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 0 1 8.716 2.253M12 3a9.015 9.015 0 0 0-8.716 2.253" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2 leading-none uppercase">
                            Welcome Back
                        </h1>
                        <p className="text-blue-100/70 text-sm font-light">
                            Sign in to manage your AI Assistant
                        </p>
                    </div>

                    <div className="glass-card rounded-[2rem] shadow-2xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6 flex items-center gap-3 animate-shake">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] ml-1 opacity-90">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field shadow-inner"
                                    placeholder="name@company.com"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] opacity-90">
                                        Password
                                    </label>
                                    {/* <a href="#" className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em]">
                                        Recovery
                                    </a> */}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field shadow-inner"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Connecting...
                                    </>
                                ) : (
                                    "Identify Account"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t border-white/5 text-center">
                            <p className="text-blue-100/70 text-[10px] font-black uppercase tracking-widest">
                                New user?{" "}
                                <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
            </div>
        </div>
    );
}
