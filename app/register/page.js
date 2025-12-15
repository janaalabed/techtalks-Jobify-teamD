
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabaseClient";
import { redirectToDashboard } from "@/lib/redirectToDashboardPlaceholder";

export default function Register() {
    const router = useRouter();
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
        const supabase = getSupabase();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        localStorage.setItem("token", data.user?.id || email);
        localStorage.setItem("role", role);
        redirectToDashboard(role, router);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2529a1]/10 via-white to-indigo-50 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-[#2529a1] px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">
                        Create your account
                    </h1>
                    <p className="text-indigo-100 text-sm mt-1">
                        Start your journey with Jobify
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="px-8 py-8 space-y-6">

                    {/* Email */}
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

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="••••••••"
                            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2529a1]/40"
                        />
                    </div>

                    {/* Password rules */}
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-xs">
                        {[
                            ["8+ characters", requirements.length],
                            ["Letter", requirements.letter],
                            ["Number", requirements.number],
                            ["Special char", requirements.special],
                        ].map(([text, valid]) => (
                            <div
                                key={text}
                                className={`flex items-center gap-2 ${valid ? "text-[#2529a1]" : "text-gray-400"
                                    }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${valid ? "bg-[#2529a1]" : "bg-gray-300"
                                        }`}
                                />
                                {text}
                            </div>
                        ))}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`mt-2 w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${passwordsMatch || !confirmPassword
                                    ? "border border-gray-300 focus:ring-[#2529a1]/40"
                                    : "border border-red-500 focus:ring-red-300"
                                }`}
                        />
                        {!passwordsMatch && confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            I am a
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2529a1]/40"
                        >
                            <option value="" disabled hidden>
                                Select your role
                            </option>
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full rounded-xl py-3.5 font-semibold transition-all ${isFormValid
                                ? "bg-[#2529a1] text-white hover:-translate-y-0.5 hover:shadow-xl"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Create Account
                    </button>

                    <p className="text-center text-xs text-gray-500">
                        By signing up, you agree to Jobify’s Terms & Privacy Policy
                    </p>
                </form>
            </div>
        </div>
    );
}
