"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";
import { getSession } from "@/lib/authPlaceholder";

export default function ApplicantProfilePage() {
    const supabase = getSupabase();
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Auth Check
    useEffect(() => {
        // START: Changed to use authPlaceholder for client-side token check
        const session = getSession();

        if (!session) {
            router.push("/login"); // Redirect if no session
        } else {
            setLoadingAuth(false);
        }
        // END: Changed to use authPlaceholder
    }, [router]);

    // Structured State
    const [name, setName] = useState("");
    const [skills, setSkills] = useState([]); // Array of strings
    const [skillInput, setSkillInput] = useState("");

    const [bio, setBio] = useState("");

    // Education: Array of objects { id, school, degree, year, description }
    const [education, setEducation] = useState([]);

    // Experience: Array of objects { id, company, role, year, description }
    const [experience, setExperience] = useState([]);

    const [profileImage, setProfileImage] = useState(null);
    const [cvFile, setCvFile] = useState(null);

    const [loading, setLoading] = useState(false);

    /* ===========================
     FILE UPLOAD HELPER
     =========================== */
    const uploadFile = async (file, path) => {
        const { error } = await supabase.storage
            .from("applicant-assets")
            .upload(path, file, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage
            .from("applicant-assets")
            .getPublicUrl(path);

        return data.publicUrl;
    };

    /* ===========================
       SAVE PROFILE
       =========================== */
    /* ===========================
       STATE MANIPULATION HELPERS
       =========================== */

    // --- SKILLS ---
    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput("");
        } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
            setSkills(skills.slice(0, -1));
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    // --- EDUCATION ---
    const addEducation = () => {
        setEducation([
            ...education,
            { id: Date.now(), school: "", degree: "", year: "", description: "" },
        ]);
    };

    const removeEducation = (id) => {
        setEducation(education.filter((edu) => edu.id !== id));
    };

    const updateEducation = (id, field, value) => {
        setEducation(
            education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
        );
    };

    // --- EXPERIENCE ---
    const addExperience = () => {
        setExperience([
            ...experience,
            { id: Date.now(), company: "", role: "", year: "", description: "" },
        ]);
    };

    const removeExperience = (id) => {
        setExperience(experience.filter((exp) => exp.id !== id));
    };

    const updateExperience = (id, field, value) => {
        setExperience(
            experience.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Get the current session
        // START: Changed to use authPlaceholder
        const session = getSession();
        const sessionError = !session;
        // END: Changed to use authPlaceholder

        if (sessionError || !session) {
            setMessage("You must be logged in");
            setLoading(false);
            return;
        }

        // user logging removed as requested

        try {
            let profileImageUrl = null;
            let cvUrl = null;

            if (profileImage) {
                profileImageUrl = await uploadFile(
                    profileImage,
                    `profile-pictures/${Date.now()}-profile.${profileImage.name.split(".").pop()}`
                );
            }

            if (cvFile) {
                cvUrl = await uploadFile(
                    cvFile,
                    `cvs/${Date.now()}-cv.${cvFile.name.split(".").pop()}`
                );
            }

            // Prepare payload with structured data (jsonb)
            const payload = {
                name,
                skills, // Array
                bio,
                education, // Array of objects (jsonb)
                experience, // Array of objects (jsonb)
                photo_url: profileImageUrl,
                cv_url: cvUrl,
            };

            const { error } = await supabase.from("applicants").insert(payload);

            if (error) throw error;

            setMessage("Profile saved successfully ✅");
        } catch (err) {
            setMessage(err.message);
        }

        setLoading(false);
    };


    /* ===========================
       UI
       =========================== */
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Applicant Profile
                        </h1>
                        <p className="text-blue-100 mt-2 text-sm">
                            Complete your profile to stand out to recruiters
                        </p>
                    </div>

                    <div className="p-8">
                        {loadingAuth ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSave} className="space-y-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            placeholder="e.g. Alex Morgan"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Skills (Tag-based) */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Skills
                                        </label>
                                        <div className="w-full border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all bg-white min-h-[50px] flex flex-wrap gap-2 items-center">
                                            {skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="text-blue-500 hover:text-blue-900 focus:outline-none"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                className="flex-grow outline-none bg-transparent min-w-[120px]"
                                                placeholder={skills.length === 0 ? "Type skill & press Enter" : ""}
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyDown={handleSkillKeyDown}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Press Enter to add a skill
                                        </p>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Professional Bio
                                        </label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                                            rows={4}
                                            placeholder="Tell us about your professional background..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>

                                    {/* Structured Education */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Education
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addEducation}
                                                className="text-sm text-blue-600 font-medium hover:text-blue-800"
                                            >
                                                + Add Education
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {education.map((edu, index) => (
                                                <div
                                                    key={edu.id}
                                                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(edu.id)}
                                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                            placeholder="School / University"
                                                            value={edu.school}
                                                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                                                        />
                                                        <input
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                            placeholder="Degree / Certificate"
                                                            value={edu.degree}
                                                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <input
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                            placeholder="Year (e.g. 2020-2024)"
                                                            value={edu.year}
                                                            onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                                                        />
                                                    </div>
                                                    <textarea
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                                                        rows={2}
                                                        placeholder="Description (optional)"
                                                        value={edu.description}
                                                        onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                            {education.length === 0 && (
                                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                                                    No education added yet. Click above to add.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Structured Experience */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Experience
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addExperience}
                                                className="text-sm text-blue-600 font-medium hover:text-blue-800"
                                            >
                                                + Add Experience
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {experience.map((exp, index) => (
                                                <div
                                                    key={exp.id}
                                                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(exp.id)}
                                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                            placeholder="Company Name"
                                                            value={exp.company}
                                                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                                        />
                                                        <input
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                            placeholder="Role / Position"
                                                            value={exp.role}
                                                            onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <input
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                            placeholder="Year (e.g. 2022-Present)"
                                                            value={exp.year}
                                                            onChange={(e) => updateExperience(exp.id, "year", e.target.value)}
                                                        />
                                                    </div>
                                                    <textarea
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                                                        rows={2}
                                                        placeholder="Key responsibilities..."
                                                        value={exp.description}
                                                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                            {experience.length === 0 && (
                                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                                                    No experience added yet. Click above to add.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        {/* Profile Picture */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Profile Picture
                                            </label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <p className="text-xs text-gray-500 group-hover:text-gray-700">
                                                        {profileImage
                                                            ? profileImage.name
                                                            : "Drop image or click"}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                                />
                                            </label>
                                        </div>

                                        {/* CV */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Curriculum Vitae
                                            </label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    <p className="text-xs text-gray-500 group-hover:text-gray-700">
                                                        {cvFile ? cvFile.name : "Drop PDF or click"}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf"
                                                    onChange={(e) => setCvFile(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-6">
                                        <button
                                            disabled={loading}
                                            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 ${loading
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                                                }`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Saving Profile...</span>
                                                </div>
                                            ) : (
                                                "Save Profile"
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Status Message */}
                                {message && (
                                    <div
                                        className={`mt-6 p-4 rounded-lg flex items-center justify-center gap-2 animate-fade-in ${message.includes("success")
                                            ? "bg-green-50 text-green-700 border border-green-100"
                                            : "bg-red-50 text-red-700 border border-red-100"
                                            }`}
                                    >
                                        {message.includes("success") ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        )}
                                        <p className="font-medium">{message}</p>
                                    </div>
                                )}
                                {/* End of loadingAuth check */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

