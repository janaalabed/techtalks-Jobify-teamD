// "use client";

// import { useState, useMemo } from "react";
// import { getSupabase } from "../../lib/supabaseClient";

// export default function Register() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [role, setRole] = useState("");
//     const [requirements, setRequirements] = useState({
//         length: false,
//         letter: false,
//         number: false,
//         special: false,
//     });

//     const handlePasswordChange = (value) => {
//         setPassword(value);
//         setRequirements({
//             length: value.length >= 8,
//             letter: /[A-Za-z]/.test(value),
//             number: /[0-9]/.test(value),
//             special: /[!@#$%^&*]/.test(value),
//         });
//     };

//     const requirementLabel = (text, valid) => (
//         <div
//             style={{
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: 13,
//                 color: valid ? "#1E3A8A" : "#6B7280",
//                 marginBottom: 4,
//             }}
//         >
//             <span style={{ marginRight: 6 }}>{valid ? "✔️" : "⚪"}</span>
//             {text}
//         </div>
//     );

//     // compute derived validation state
//     const allRequirementsMet = useMemo(
//         () => Object.values(requirements).every(Boolean),
//         [requirements]
//     );
//     const passwordsMatch = password === confirmPassword && confirmPassword !== "";
//     const emailFilled = email.trim() !== "";
//     const roleSelected = role !== "";

//     const isFormValid = allRequirementsMet && passwordsMatch && emailFilled && roleSelected;

//     const handleRegister = async (e) => {
//         e.preventDefault();

//         if (!roleSelected) {
//             alert("Please select a role before registering.");
//             return;
//         }

//         if (!allRequirementsMet) {
//             alert("Password does not meet all requirements.");
//             return;
//         }

//         if (!passwordsMatch) {
//             alert("Passwords do not match.");
//             return;
//         }

//         let supabase;
//         try {
//             supabase = getSupabase();
//         } catch (err) {
//             console.error(err.message);
//             alert("Supabase is not configured. Add env vars to .env.local.");
//             return;
//         }

//         try {
//             const { data, error } = await supabase.auth.signUp({
//                 email,
//                 password,
//             });

//             if (error) {
//                 console.error("Sign up error:", error);
//                 alert("Sign up failed: " + (error.message || JSON.stringify(error)));
//                 return;
//             }

//             console.log("Sign up success:", data);
//             alert("Registered successfully! Check your email if verification is enabled.");
//         } catch (err) {
//             console.error("Unexpected error:", err);
//         }
//     };

//     // styling helper for disabled state
//     const buttonStyleBase = {
//         width: "100%",
//         padding: 12,
//         backgroundColor: "#1E3A8A",
//         color: "#fff",
//         borderRadius: 6,
//         border: "none",
//         fontWeight: 600,
//         cursor: "pointer",
//         transition: "all 0.3s ease",
//         opacity: 1,
//     };
//     const disabledButtonStyle = {
//         ...buttonStyleBase,
//         backgroundColor: "#9CA3AF",
//         cursor: "not-allowed",
//         opacity: 0.9,
//     };

//     return (
//         <div
//             style={{
//                 maxWidth: 400,
//                 margin: "40px auto",
//                 padding: 20,
//                 backgroundColor: "#f8f9fa",
//                 borderRadius: 10,
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             }}
//         >
//             <h1
//                 style={{
//                     textAlign: "center",
//                     fontWeight: "bold",
//                     marginBottom: 24,
//                     color: "#1E3A8A",
//                 }}
//             >
//                 Register
//             </h1>

//             <form onSubmit={handleRegister}>
//                 <label htmlFor="email" style={{ fontWeight: 500 }}>
//                     Email
//                 </label>
//                 <input
//                     id="email"
//                     required
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     style={{
//                         width: "100%",
//                         padding: 10,
//                         marginBottom: 16,
//                         borderRadius: 6,
//                         border: "1px solid #ccc",
//                     }}
//                 />

//                 <label htmlFor="password" style={{ fontWeight: 500 }}>
//                     Password
//                 </label>
//                 <input
//                     id="password"
//                     type="password"
//                     required
//                     value={password}
//                     onChange={(e) => handlePasswordChange(e.target.value)}
//                     style={{
//                         width: "100%",
//                         padding: 10,
//                         marginBottom: 12,
//                         borderRadius: 6,
//                         border: "1px solid #ccc",
//                     }}
//                 />

//                 <div style={{ marginBottom: 12 }}>
//                     {requirementLabel("At least 8 characters", requirements.length)}
//                     {requirementLabel("Contains a letter", requirements.letter)}
//                     {requirementLabel("Contains a number", requirements.number)}
//                     {requirementLabel("Contains a special character (!@#$%^&*)", requirements.special)}
//                 </div>

//                 <label htmlFor="confirmPassword" style={{ fontWeight: 500 }}>
//                     Confirm Password
//                 </label>
//                 <input
//                     id="confirmPassword"
//                     type="password"
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     style={{
//                         width: "100%",
//                         padding: 10,
//                         marginBottom: 6,
//                         borderRadius: 6,
//                         border: passwordsMatch || confirmPassword === "" ? "1px solid #ccc" : "1px solid #dc2626",
//                     }}
//                 />
//                 {/* inline mismatch message */}
//                 {!passwordsMatch && confirmPassword !== "" && (
//                     <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>Passwords do not match</div>
//                 )}

//                 <p style={{ color: "#6b7280", marginBottom: 8, fontSize: 13 }}>Choose the role that best describes you</p>
//                 <select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     required
//                     style={{
//                         width: "100%",
//                         padding: 10,
//                         marginBottom: 20,
//                         borderRadius: 6,
//                         border: "1px solid #ccc",
//                         backgroundColor: "#fff",
//                         color: "#111",
//                     }}
//                 >
//                     <option value="" disabled hidden>
//                         Select role...
//                     </option>
//                     <option value="job_seeker">Job Seeker</option>
//                     <option value="employer">Employer</option>
//                 </select>

//                 <button
//                     type="submit"
//                     disabled={!isFormValid}
//                     style={isFormValid ? buttonStyleBase : disabledButtonStyle}
//                     onMouseEnter={(e) => {
//                         if (isFormValid) e.currentTarget.style.backgroundColor = "#162f6b";
//                     }}
//                     onMouseLeave={(e) => {
//                         if (isFormValid) e.currentTarget.style.backgroundColor = "#1E3A8A";
//                     }}
//                 >
//                     Register
//                 </button>
//             </form>
//         </div>
//     );
// }
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

    const requirementLabel = (text, valid) => (
        <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: valid ? "#1E3A8A" : "#6B7280", marginBottom: 4 }}>
            <span style={{ marginRight: 6 }}>{valid ? "✔️" : "⚪"}</span>
            {text}
        </div>
    );

    const allRequirementsMet = useMemo(() => Object.values(requirements).every(Boolean), [requirements]);
    const passwordsMatch = password === confirmPassword && confirmPassword !== "";
    const emailFilled = email.trim() !== "";
    const roleSelected = role !== "";
    const isFormValid = allRequirementsMet && passwordsMatch && emailFilled && roleSelected;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!roleSelected) {
            alert("Please select a role before registering.");
            return;
        }

        if (!allRequirementsMet) {
            alert("Password does not meet all requirements.");
            return;
        }

        if (!passwordsMatch) {
            alert("Passwords do not match.");
            return;
        }

        let supabase;
        try {
            supabase = getSupabase();
        } catch (err) {
            console.error(err.message);
            alert("Supabase is not configured. Add env vars to .env.local.");
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                console.error("Sign up error:", error);
                alert("Sign up failed: " + (error.message || JSON.stringify(error)));
                return;
            }

            console.log("Sign up success:", data);

            // Save session locally
            localStorage.setItem("token", data.user?.id || email);
            localStorage.setItem("role", role);

            alert("Registered successfully!");
            redirectToDashboard(role, router);

        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    const buttonStyleBase = {
        width: "100%",
        padding: 12,
        backgroundColor: "#1E3A8A",
        color: "#fff",
        borderRadius: 6,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
        opacity: 1,
    };
    const disabledButtonStyle = {
        ...buttonStyleBase,
        backgroundColor: "#9CA3AF",
        cursor: "not-allowed",
        opacity: 0.9,
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, backgroundColor: "#f8f9fa", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <h1 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 24, color: "#1E3A8A" }}>Register</h1>
            <form onSubmit={handleRegister}>
                <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }} />

                <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => handlePasswordChange(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }} />

                <div style={{ marginBottom: 12 }}>
                    {requirementLabel("At least 8 characters", requirements.length)}
                    {requirementLabel("Contains a letter", requirements.letter)}
                    {requirementLabel("Contains a number", requirements.number)}
                    {requirementLabel("Contains a special character (!@#$%^&*)", requirements.special)}
                </div>

                <label htmlFor="confirmPassword" style={{ fontWeight: 500 }}>Confirm Password</label>
                <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 6, borderRadius: 6, border: passwordsMatch || confirmPassword === "" ? "1px solid #ccc" : "1px solid #dc2626" }} />
                {!passwordsMatch && confirmPassword !== "" && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>Passwords do not match</div>}

                <p style={{ color: "#6b7280", marginBottom: 8, fontSize: 13 }}>Choose the role that best describes you</p>
                <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ width: "100%", padding: 10, marginBottom: 20, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#fff", color: "#111" }}>
                    <option value="" disabled hidden>Select role...</option>
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                </select>

                <button type="submit" disabled={!isFormValid} style={isFormValid ? buttonStyleBase : disabledButtonStyle}>{isFormValid ? "Register" : "Fill all fields"}</button>
            </form>
        </div>
    );
}
