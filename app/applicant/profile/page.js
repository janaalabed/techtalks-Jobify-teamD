"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../../lib/supabaseClient";
import {
    User,
    Briefcase,
    GraduationCap,
    Plus,
    Trash2,
    Upload,
    FileText,
    CheckCircle,
    X,
    Code2
} from "lucide-react";

export default function ApplicantProfilePage() {
    const supabase = getSupabase();
    const router = useRouter();
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [bio, setBio] = useState("");
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push("/login");
            } else {
                setLoadingAuth(false);
            }
        };
        checkAuth();
    }, [router, supabase]);

    const uploadFile = async (file, path) => {
        const { error } = await supabase.storage
            .from("applicant-assets")
            .upload(path, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from("applicant-assets").getPublicUrl(path);
        return data.publicUrl;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const { data } = await supabase.auth.getUser();
        const user = data.user;

        if (!user) {
            setMessage("You must be logged in");
            setLoading(false);
            return;
        }

        try {
            let profileImageUrl = null;
            let cvUrl = null;

            if (profileImage) {
                profileImageUrl = await uploadFile(
                    profileImage,
                    `profile-pictures/${user.id}.${profileImage.name.split(".").pop()}`
                );
            }

            if (cvFile) {
                cvUrl = await uploadFile(
                    cvFile,
                    `cvs/${user.id}.${cvFile.name.split(".").pop()}`
                );
            }

            await supabase.from("profiles").update({ name }).eq("id", user.id);
            await supabase.from("applicants").update({
                skills,
                bio,
                education,
                experience,
                photo_url: profileImageUrl,
                cv_url: cvUrl,
            }).eq("user_id", user.id);

            setMessage("Profile saved successfully ✅");
            router.push("/jobs-list");
        } catch (err) {
            setMessage(err.message);
        }
        setLoading(false);
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
            setSkills(skills.slice(0, -1));
        }
    };

    const removeSkill = (skillToRemove) => setSkills(skills.filter((skill) => skill !== skillToRemove));
    const addEducation = () => setEducation([...education, { id: Date.now(), school: "", degree: "", year: "" }]);
    const removeEducation = (id) => setEducation(education.filter((edu) => edu.id !== id));
    const updateEducation = (id, field, value) => setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
    const addExperience = () => setExperience([...experience, { id: Date.now(), company: "", role: "", year: "", description: "" }]);
    const removeExperience = (id) => setExperience(experience.filter((exp) => exp.id !== id));
    const updateExperience = (id, field, value) => setExperience(experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));

    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] relative py-12 px-4 overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] -z-10" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[#1e293b]">Create Your <span className="text-indigo-600">Profile</span></h1>
                    <p className="text-slate-500 mt-3 font-medium">Complete your professional details to get noticed by top employers.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">

                    {/* Basic Info */}
                    <Section title="Basic Information" icon={<User size={18} />}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                                <input
                                    className="input-field-balanced"
                                    placeholder="e.g. Alex Morgan"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Professional Bio</label>
                                <textarea
                                    className="input-field-balanced min-h-[120px] resize-none"
                                    placeholder="Write a brief intro about your expertise..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Skills */}
                    <Section title="Key Skills" icon={<Code2 size={18} />}>
                        <div className="w-full bg-slate-50 rounded-2xl p-4 flex flex-wrap gap-2 items-center border border-slate-200 focus-within:border-indigo-400 transition-all">
                            {skills.map((skill, index) => (
                                <span key={index} className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                                </span>
                            ))}
                            <input
                                className="flex-grow outline-none bg-transparent px-2 py-1 text-sm text-slate-700 font-medium"
                                placeholder={skills.length === 0 ? "Type skill & press Enter..." : ""}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                            />
                        </div>
                    </Section>

                    {/* Education */}
                    <Section
                        title="Education"
                        icon={<GraduationCap size={18} />}
                        action={<button type="button" onClick={addEducation} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"><Plus size={14} /> Add Education</button>}
                    >
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="relative p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                                    <button type="button" onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="input-field-balanced" placeholder="University" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
                                        <input className="input-field-balanced" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
                                        <div className="md:col-span-2">
                                            <input className="input-field-balanced" placeholder="Year Range (e.g., 2018 - 2022)" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {education.length === 0 && <EmptyState text="No education records added yet." />}
                        </div>
                    </Section>

                    {/* File Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUploadBox
                            label="Profile Photo"
                            icon={<Upload size={18} />}
                            fileName={profileImage?.name}
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            accept="image/*"
                        />
                        <FileUploadBox
                            label="CV / Resume"
                            icon={<FileText size={18} />}
                            fileName={cvFile?.name}
                            onChange={(e) => setCvFile(e.target.files[0])}
                            accept=".pdf"
                        />
                    </div>

                    {/* Footer Submit */}
                    <div className="pt-6">
                        <button
                            disabled={loading}
                            className="w-full bg-[#1e293b] hover:bg-[#334155] text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-50"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><CheckCircle size={20} /> Complete My Profile</>}
                        </button>
                        {message && (
                            <p className={`mt-4 text-center text-sm font-semibold ${message.includes("success") ? "text-emerald-600" : "text-rose-500"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <style jsx>{`
                .input-field-balanced {
                    width: 100%;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 1rem;
                    padding: 0.875rem 1.25rem;
                    color: #334155;
                    font-size: 0.875rem;
                    font-weight: 500;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field-balanced:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08);
                }
                .input-field-balanced::placeholder {
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}

function Section({ title, icon, children, action }) {
    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 shadow-sm">
                        {icon}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function FileUploadBox({ label, icon, fileName, onChange, accept }) {
    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{label}</label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-100 border-dashed rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors mb-2">
                    {icon}
                </div>
                <p className="text-xs font-bold text-slate-500">{fileName ? fileName : "Choose File"}</p>
                <input type="file" className="hidden" accept={accept} onChange={onChange} />
            </label>
        </div>
    );
}

function EmptyState({ text }) {
    return <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">{text}</div>;
}