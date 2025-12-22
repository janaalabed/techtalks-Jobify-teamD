"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import { redirectToDashboard } from "../../lib/redirectToDashboard";

export default function Login() {
    const router = useRouter();
    const supabase = getSupabase();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1️⃣ Sign in user
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const user = data.user;
            if (!user) throw new Error("Login failed");

            // 2️⃣ Get role from profiles
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profileError || !profile) throw new Error("User profile not found");

            // ✅ Redirect based on role
            redirectToDashboard(profile.role, router);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };



    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email first.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            alert(error.message);
        } else {
            alert("Password reset email sent.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2529a1]/10 via-white to-indigo-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                <div className="bg-[#2529a1] px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-indigo-100 text-sm mt-1">
                        Log in to continue to Jobify
                    </p>
                </div>

                <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2529a1]/40"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2529a1]/40"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-xl py-3.5 font-semibold transition-all ${loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#2529a1] text-white hover:-translate-y-0.5 hover:shadow-xl"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="w-full text-sm text-gray-600 hover:text-[#2529a1]"
                    >
                        Forgot password?
                    </button>

                    <p className="text-center text-xs text-gray-500 pt-2">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => router.push("/register")}
                            className="text-[#2529a1] font-medium cursor-pointer hover:underline"
                        >
                            Sign up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
