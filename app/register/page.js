"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import { redirectAfterRegister } from "../../lib/redirectAfterRegister";

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

        // 1️⃣ Sign up user (Auth)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        const user = data.user;
        if (!user) {
            alert("User creation failed");
            return;
        }

        // 2️⃣ Insert into profiles
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                role,
            });

        if (profileError) {
            alert(profileError.message);
            return;
        }

        // 3️⃣ Insert role-specific data
        if (role === "applicant") {
            await supabase.from("applicants").insert({
                user_id: user.id,
            });
        }

        if (role === "employer") {
            await supabase.from("employers").insert({
                user_id: user.id,
            });
        }

        // 4️⃣ Redirect
        redirectAfterRegister(role, router);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2529a1]/10 via-white to-indigo-50 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                <div className="bg-[#2529a1] px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">
                        Create your account
                    </h1>
                    <p className="text-indigo-100 text-sm mt-1">
                        Start your journey with Jobify
                    </p>
                </div>

                <form onSubmit={handleRegister} className="px-8 py-8 space-y-6">

                    {/* Email */}
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border px-4 py-3"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border px-4 py-3"
                    />

                    {/* Confirm Password */}
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border px-4 py-3"
                    />

                    {/* Role */}
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full rounded-xl border px-4 py-3"
                    >
                        <option value="" disabled>
                            Select role
                        </option>
                        <option value="applicant">Job Seeker</option>
                        <option value="employer">Employer</option>
                    </select>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-full bg-[#2529a1] text-white rounded-xl py-3"
                    >
                        Create Account
                    </button>

                    {/* Login link */}
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Already have an account?{" "}
                        <span
                            onClick={() => router.push("/login")}
                            className="text-blue-600 font-medium cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
