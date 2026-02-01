"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "../api.service";

export default function VerifyPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("verify_email");
        if (storedEmail) setEmail(storedEmail);
        else {
            // If no email, redirect back to signup
            router.push("/signup");
        }
    }, [router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!email) throw new Error("Email context lost. Please sign up again.");
            await apiService.verify(email, otp);
            localStorage.removeItem("verify_email");
            router.push("/");
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2 uppercase leading-none">
                            Verify Access
                        </h1>
                        <p className="text-blue-100/70 text-sm font-light">
                            Secure your corporate node
                        </p>
                    </div>

                    <div className="glass-card rounded-[2rem] shadow-2xl p-6 sm:p-8 text-center border border-white/10 relative overflow-hidden">
                        <div className="mb-6">
                            <h2 className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em] opacity-60">Authentication Required</h2>
                            <p className="text-blue-100/80 text-xs mt-2 font-medium">
                                Code sent to <span className="text-blue-400 font-bold underline decoration-blue-500/30">{email || "your email"}</span>
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6 flex items-center justify-center gap-3 animate-shake">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] opacity-90">
                                    6-Digit Protection Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-5 text-center text-4xl font-mono tracking-[0.6em] bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder:text-white/10 shadow-inner"
                                    placeholder="000000"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Validating...
                                    </>
                                ) : (
                                    "Authorise Access"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t border-white/5 text-center">
                            <p className="text-blue-100/50 text-[10px] font-black uppercase tracking-widest">
                                No code?{" "}
                                <button className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4" disabled={loading}>
                                    Resend Key
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Background Decorations */}
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/4 translate-y-1/4"></div>
            </div>
        </div>
    );
}
