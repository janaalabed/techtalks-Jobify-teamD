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
    Code2,
    ArrowLeft
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
    const [existingPhoto, setExistingPhoto] = useState(null);
    const [existingCv, setExistingCv] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data?.user;

            if (!user) {
                router.push("/login");
                return;
            }

            setLoadingAuth(false);

            try {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", user.id)
                    .single();

                if (profile) setName(profile.name || "");

                const { data: applicant } = await supabase
                    .from("applicants")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (applicant) {
                    const parsedSkills = typeof applicant.skills === 'string' ? JSON.parse(applicant.skills) : applicant.skills;
                    const parsedEducation = typeof applicant.education === 'string' ? JSON.parse(applicant.education) : applicant.education;
                    const parsedExperience = typeof applicant.experience === 'string' ? JSON.parse(applicant.experience) : applicant.experience;

                    const hasData = applicant.bio ||
                        (Array.isArray(parsedSkills) && parsedSkills.length > 0);

                    if (hasData) setIsEditing(true);

                    setBio(applicant.bio || "");
                    setSkills(Array.isArray(parsedSkills) ? parsedSkills : []);
                    setEducation(Array.isArray(parsedEducation) ? parsedEducation : []);
                    setExperience(Array.isArray(parsedExperience) ? parsedExperience : []);
                    setExistingPhoto(applicant.photo_url);
                    setExistingCv(applicant.cv_url);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        checkAuthAndFetchData();
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

        try {
            let profileImageUrl = existingPhoto;
            let cvUrl = existingCv;

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
            setTimeout(() => router.push("/profile/previewApplicantProfile"), 1500);
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
            <div className="flex justify-center items-center h-screen bg-[#170e2c]">
                <div className="w-10 h-10 border-4 border-[#5f5aa7]/20 border-t-[#5f5aa7] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 relative overflow-x-hidden">
            {/* Hero Background Decor */}
            <div className="bg-[#170e2c] h-72 w-full absolute top-0 left-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3e3875]/40 to-transparent" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-white">
                        {isEditing ? "Update" : "Create"} <span className="text-[#7270b1]">Profile</span>
                    </h1>
                    <p className="text-white/60 mt-3 font-medium">Your professional identity starts here.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-8 pb-20">
                    {/* Unified Single Container */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 space-y-12">

                        {/* Basic Info */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                                    <User size={18} />
                                </div>
                                <h2 className="text-xl font-black text-[#170e2c]">Basic Information</h2>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="label-style">Full Name</label>
                                    <input
                                        className="input-field-balanced"
                                        placeholder="e.g. Alex Morgan"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label-style">Professional Bio</label>
                                    <textarea
                                        className="input-field-balanced min-h-[140px] resize-none"
                                        placeholder="Share your professional journey..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Skills */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                                    <Code2 size={18} />
                                </div>
                                <h2 className="text-xl font-black text-[#170e2c]">Expertise & Skills</h2>
                            </div>
                            <div className="w-full bg-slate-50 rounded-3xl p-5 flex flex-wrap gap-2 items-center border border-slate-200 focus-within:border-[#5f5aa7] transition-all">
                                {skills.map((skill, index) => (
                                    <span key={index} className="bg-[#3e3875] text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-300 transition-colors"><X size={14} /></button>
                                    </span>
                                ))}
                                <input
                                    className="flex-grow outline-none bg-transparent px-2 py-1 text-sm text-[#170e2c] font-bold"
                                    placeholder={skills.length === 0 ? "Type skill & press Enter..." : "Add more..."}
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Experience */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                                        <Briefcase size={18} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#170e2c]">Work Experience</h2>
                                </div>
                                <button type="button" onClick={addExperience} className="text-sm font-black text-[#5f5aa7] flex items-center gap-1"><Plus size={16} /> ADD</button>
                            </div>
                            <div className="space-y-6">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <input className="input-field-balanced" placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} />
                                            <input className="input-field-balanced" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
                                            <div className="md:col-span-2">
                                                <input className="input-field-balanced" placeholder="Year Range" value={exp.year} onChange={(e) => updateExperience(exp.id, "year", e.target.value)} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <textarea className="input-field-balanced min-h-[100px]" placeholder="Key Achievements..." value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {experience.length === 0 && <EmptyState text="Add your career milestones." />}
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Assets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUploadBox
                                label="Profile Photo"
                                icon={<Upload size={18} />}
                                fileName={profileImage?.name || (existingPhoto ? "current_photo.jpg" : "No image selected")}
                                onChange={(e) => setProfileImage(e.target.files[0])}
                                accept="image/*"
                            />
                            <FileUploadBox
                                label="Resume / CV"
                                icon={<FileText size={18} />}
                                fileName={cvFile?.name || (existingCv ? "current_resume.pdf" : "No file selected")}
                                onChange={(e) => setCvFile(e.target.files[0])}
                                accept=".pdf"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-10">
                        <button
                            disabled={loading}
                            className="w-full bg-[#170e2c] hover:bg-[#3e3875] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-[#170e2c]/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Saving Profile..." : (isEditing ? "Save Changes" : "Create Applicant Profile")}
                            {/* {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={22} /> SAVE PROFILE</>} */}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .input-field-balanced {
                    width: 100%;
                    background: white;
                    border: 2px solid #f1f5f9;
                    border-radius: 1.25rem;
                    padding: 1rem 1.5rem;
                    color: #170e2c;
                    font-size: 0.9rem;
                    font-weight: 700;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-field-balanced:focus {
                    border-color: #5f5aa7;
                    background: white;
                    box-shadow: 0 10px 15px -3px rgba(95, 90, 167, 0.1);
                }
                .label-style {
                    display: block;
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #7270b1;
                    margin-bottom: 8px;
                    padding-left: 4px;
                }
            `}</style>
        </div>
    );
}

function FileUploadBox({ label, icon, fileName, onChange, accept }) {
    return (
        <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-[#7270b1] mb-5">{label}</label>
            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-[#f1f5f9] border-dashed rounded-[2rem] cursor-pointer hover:bg-[#f1f0fb] hover:border-[#5f5aa7] transition-all group overflow-hidden">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform text-[#5f5aa7] mb-3">
                        {icon}
                    </div>
                    <p className="text-xs font-black text-[#3e3875] px-4 text-center truncate max-w-[200px]">{fileName}</p>
                </div>
                <input type="file" className="hidden" accept={accept} onChange={onChange} />
            </label>
        </div>
    );
}

function EmptyState({ text }) {
    return <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-sm font-bold tracking-tight">{text}</div>;
}