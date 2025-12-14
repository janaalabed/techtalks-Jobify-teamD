
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabaseClient";
import { redirectToDashboard } from "@/lib/redirectToDashboard";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        let supabase;
        try {
            supabase = getSupabase();
        } catch (err) {
            console.error(err.message);
            alert("Supabase is not configured.");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error);
                alert("Login failed: " + (error.message || JSON.stringify(error)));
                setLoading(false);
                return;
            }

            console.log("Login success:", data);

            // save session
            localStorage.setItem("token", data.user?.id || email);
            localStorage.setItem("role", data.user?.role || "job_seeker");

            alert("Logged in successfully!");
            setLoading(false);

            redirectToDashboard(data.user?.role || "job_seeker", router);

        } catch (err) {
            console.error("Unexpected error:", err);
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5", fontFamily: "Arial, sans-serif" }}>
            <div style={{ background: "#fff", padding: "40px 30px", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: 350 }}>
                <h1 style={{ textAlign: "center", marginBottom: 24, color: "#333" }}>Login</h1>
                <form onSubmit={handleLogin}>
                    <label style={{ display: "block", marginBottom: 6, color: "#555" }} htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px", marginBottom: 16, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }} />

                    <label style={{ display: "block", marginBottom: 6, color: "#555" }} htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px", marginBottom: 16, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }} />

                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer", transition: "0.3s", marginBottom: 12 }} onMouseOver={(e) => (e.target.style.background = "#4338ca")} onMouseOut={(e) => (e.target.style.background = "#4f46e5")}>{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
        </div>
    );
}
