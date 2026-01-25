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
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!email) throw new Error("Email not found. Please try signing up again.");

            await apiService.verify(email, otp);
            alert("Verification Successful! Please Login.");
            localStorage.removeItem("verify_email"); // Cleanup
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Verify Email</h1>
                    <p className="text-gray-500 mt-2">
                        Enter the OTP sent to {email || "your email address"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            One-Time Password
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                            placeholder="000000"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 rounded-lg transition duration-200"
                    >
                        {loading ? "Verifying..." : "Verify Account"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <button className="text-blue-600 hover:text-blue-700 font-medium" disabled={loading}>
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
}
