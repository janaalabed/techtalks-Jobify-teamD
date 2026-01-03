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
        <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4 relative overflow-x-hidden">
            {/* Hero Background Decor */}
            <div className="bg-[#170e2c] h-64 md:h-72 w-full absolute top-0 left-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3e3875]/40 to-transparent" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors text-sm md:text-base"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>

                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-white">
                        {isEditing ? "Update" : "Create"} <span className="text-[#7270b1]">Profile</span>
                    </h1>
                    <p className="text-white/60 mt-2 md:mt-3 font-medium text-sm md:text-base px-4">Your professional identity starts here.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-6 md:space-y-8 pb-20">
                    {/* Unified Single Container */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-slate-200/50 space-y-10 md:space-y-12">

                        {/* Basic Info */}
                        <div>
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="w-10 h-10 rounded-xl bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                                    <User size={18} />
                                </div>
                                <h2 className="text-xl font-black text-[#170e2c]">Basic Information</h2>
                            </div>
                            <div className="space-y-5 md:space-y-6">
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
                                        className="input-field-balanced min-h-[120px] md:min-h-[140px] resize-none"
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
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <div className="w-10 h-10 rounded-xl bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                                    <Code2 size={18} />
                                </div>
                                <h2 className="text-xl font-black text-[#170e2c]">Expertise & Skills</h2>
                            </div>
                            <div className="w-full bg-slate-50 rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-wrap gap-2 items-center border border-slate-200 focus-within:border-[#5f5aa7] transition-all">
                                {skills.map((skill, index) => (
                                    <span key={index} className="bg-[#3e3875] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 shadow-md">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-300 transition-colors"><X size={14} /></button>
                                    </span>
                                ))}
                                <input
                                    className="flex-grow outline-none bg-transparent px-2 py-1 text-sm text-[#170e2c] font-bold min-w-[120px]"
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
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                                        <Briefcase size={18} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#170e2c]">Work Experience</h2>
                                </div>
                                <button type="button" onClick={addExperience} className="text-xs md:text-sm font-black text-[#5f5aa7] flex items-center gap-1 hover:underline"><Plus size={16} /> ADD</button>
                            </div>
                            <div className="space-y-4 md:space-y-6">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative p-5 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                                        <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                            <input className="input-field-balanced" placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} />
                                            <input className="input-field-balanced" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
                                            <div className="md:col-span-2">
                                                <input className="input-field-balanced" placeholder="Year Range (e.g. 2021 - Present)" value={exp.year} onChange={(e) => updateExperience(exp.id, "year", e.target.value)} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <textarea className="input-field-balanced min-h-[80px] md:min-h-[100px]" placeholder="Key Achievements..." value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} />
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

                    {/* Submit Button */}
                    <div className="pt-6 md:pt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#170e2c] hover:bg-[#3e3875] text-white font-black py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-[#170e2c]/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving Profile...
                                </span>
                            ) : (
                                <>{isEditing ? "Save Changes" : "Create Applicant Profile"} <CheckCircle size={20} /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .input-field-balanced {
                    width: 100%;
                    background: white;
                    border: 2px solid #f1f5f9;
                    border-radius: 1rem;
                    padding: 0.8rem 1.25rem;
                    color: #170e2c;
                    font-size: 0.9rem;
                    font-weight: 700;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @media (min-width: 768px) {
                    .input-field-balanced {
                        border-radius: 1.25rem;
                        padding: 1rem 1.5rem;
                    }
                }
                .input-field-balanced:focus {
                    border-color: #5f5aa7;
                    box-shadow: 0 10px 15px -3px rgba(95, 90, 167, 0.1);
                }
                .label-style {
                    display: block;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #7270b1;
                    margin-bottom: 6px;
                    padding-left: 4px;
                }
            `}</style>
        </div>
    );
}

function EmptyState({ text }) {
    return <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-sm font-bold tracking-tight">{text}</div>;
}
function FileUploadBox({ label, icon, fileName, onChange, accept }) {
    return (
        <div className="space-y-2">
            <label className="label-style">{label}</label>
            <label className="flex flex-col items-center justify-center w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-100 transition-all group">
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#5f5aa7] mb-3 group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    <p className="text-[11px] font-black text-[#170e2c] text-center px-2 line-clamp-1">
                        {fileName}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        Click to upload
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={onChange}
                    accept={accept}
                />
            </label>
        </div>
    );
}