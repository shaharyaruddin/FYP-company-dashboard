"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiService } from "../api.service";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await apiService.signup(formData.name, formData.email, formData.password);
            localStorage.setItem("verify_email", formData.email);
            router.push("/verify");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark">
            <div className="h-screen flex items-center justify-center bg-slate-900 hero-gradient p-4 transition-all duration-500 relative overflow-hidden">
                <div className="w-full max-w-md relative z-10 scale-[0.9] sm:scale-100 origin-center">
                    {/* Brand Area */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4 transform hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 0 1 8.716 2.253M12 3a9.015 9.015 0 0 0-8.716 2.253" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2 leading-none uppercase">
                            Join the Future
                        </h1>
                        <p className="text-blue-100/70 text-sm font-light">
                            Create your corporate account in seconds
                        </p>
                    </div>

                    <div className="glass-card rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs mb-4 flex items-center gap-3 animate-shake">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] ml-1 opacity-90">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field shadow-inner py-2.5 text-sm"
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] ml-1 opacity-90">
                                    Company Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field shadow-inner py-2.5 text-sm"
                                    placeholder="john@company.com"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] ml-1 opacity-90">
                                    Secure Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field shadow-inner py-2.5 text-sm"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex items-center gap-3 px-1">
                                <input type="checkbox" required className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500" />
                                <span className="text-[10px] text-blue-100/80 font-black uppercase tracking-wider">
                                    I agree to the <a href="#" className="text-blue-400 hover:underline">Terms</a>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? "Connecting..." : "Initiate Access"}
                            </button>
                        </form>

                        <div className="mt-6 pt-4 border-t border-white/5 text-center">
                            <p className="text-blue-100/70 text-[10px] font-black uppercase tracking-widest">
                                Already a member?{" "}
                                <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                                    Sign In
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
