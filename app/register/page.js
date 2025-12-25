"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import { redirectAfterRegister } from "../../lib/redirectAfterRegister";
import { Mail, Lock, CheckCircle2, Circle, ArrowRight } from "lucide-react";

export default function Register() {
    const router = useRouter();
    const supabase = getSupabase();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");

    const [requirements, setRequirements] = useState({
        length: false,
        letter: false,
        number: false,
        special: false,
    });

    
    const handlePasswordChange = (value) => {
        setPassword(value);
        setRequirements({
            length: value.length >= 8,
            letter: /[A-Za-z]/.test(value),
            number: /[0-9]/.test(value),
            special: /[!@#$%^&*]/.test(value),
        });
    };

    const allRequirementsMet = useMemo(
        () => Object.values(requirements).every(Boolean),
        [requirements]
    );

    const passwordsMatch = password === confirmPassword && confirmPassword !== "";
    const isFormValid = allRequirementsMet && passwordsMatch && email && role;


    const handleRegister = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) { alert(error.message); return; }
        const user = data.user;
        if (!user) return;

        const { error: profileError } = await supabase
            .from("profiles")
            .insert({ id: user.id, role });

        if (profileError) { alert(profileError.message); return; }

        if (role === "applicant") {
            await supabase.from("applicants").insert({ user_id: user.id });
        } else if (role === "employer") {
            await supabase.from("employers").insert({ user_id: user.id });
        }

        redirectAfterRegister(role, router);
    };

    return (
        <div className="min-h-screen bg-white relative flex items-center justify-center px-4 py-12 overflow-hidden">
            {/* Background Subtle Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#5f5aa7]/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7270b1]/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#170e2c] tracking-tight">
                        Join <span className="text-[#5f5aa7]">Jobify</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Create your account to start your journey.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
                    <form onSubmit={handleRegister} className="space-y-5">

                        {/* Role Selection Blocks */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setRole("applicant")}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === "applicant"
                                        ? "border-[#5f5aa7] bg-[#5f5aa7]/5 text-[#5f5aa7]"
                                        : "border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">Applicant</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("employer")}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === "employer"
                                        ? "border-[#5f5aa7] bg-[#5f5aa7]/5 text-[#5f5aa7]"
                                        : "border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">Employer</span>
                            </button>
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5f5aa7]/20 transition-all outline-none"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                placeholder="Create password"
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5f5aa7]/20 transition-all outline-none"
                            />
                        </div>

                        {/* Password Requirements Grid */}
                        <div className="grid grid-cols-2 gap-2 px-2 py-2">
                            {[
                                { label: "8+ characters", met: requirements.length },
                                { label: "One letter", met: requirements.letter },
                                { label: "One number", met: requirements.number },
                                { label: "Special char", met: requirements.special },
                            ].map((req) => (
                                <div key={req.label} className={`flex items-center gap-2 text-[11px] font-medium ${req.met ? "text-emerald-600" : "text-slate-400"}`}>
                                    {req.met ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                    {req.label}
                                </div>
                            ))}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 transition-all outline-none ${passwordsMatch ? "focus:ring-emerald-500/20" : "focus:ring-[#5f5aa7]/20"
                                    }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full bg-[#170e2c] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#3e3875] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#170e2c]/10 active:scale-[0.98] mt-4"
                        >
                            Create Account
                            <ArrowRight size={18} />
                        </button>

                        <p className="text-center text-sm text-slate-500 mt-8">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="text-[#5f5aa7] font-bold hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}