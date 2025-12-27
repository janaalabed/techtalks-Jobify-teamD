"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import { redirectToDashboard } from "../../lib/redirectToDashboard";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

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
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const user = data.user;
            if (!user) throw new Error("Login failed");

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profileError || !profile) throw new Error("User profile not found");

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
        <div className="min-h-screen bg-white relative flex items-center justify-center px-4 py-12 overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5f5aa7]/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#7270b1]/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-lg relative z-10">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#170e2c] tracking-tight">
                        Welcome <span className="text-[#5f5aa7]">Back</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Log in to continue to your Jobify dashboard.</p>
                </div>

                
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
                    <form onSubmit={handleLogin} className="space-y-6">

                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5f5aa7]/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs font-bold text-[#5f5aa7] hover:underline"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5f5aa7]/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#170e2c] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#3e3875] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#170e2c]/10 active:scale-[0.98] mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        
                        <div className="pt-4 text-center">
                            <p className="text-sm text-slate-500">
                                Don’t have an account yet?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/register")}
                                    className="text-[#5f5aa7] font-bold hover:underline"
                                >
                                    Create one now
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}