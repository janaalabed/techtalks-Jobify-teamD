// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import getSupabase from "../../../lib/supabaseClient";

// export default function ApplicantProfilePage() {
//     const supabase = getSupabase();
//     const router = useRouter();
//     const [loadingAuth, setLoadingAuth] = useState(true);
//     const [message, setMessage] = useState("");

//     // Profile state
//     const [name, setName] = useState("");
//     const [skills, setSkills] = useState([]);
//     const [skillInput, setSkillInput] = useState("");
//     const [bio, setBio] = useState("");
//     const [education, setEducation] = useState([]);
//     const [experience, setExperience] = useState([]);
//     const [profileImage, setProfileImage] = useState(null);
//     const [cvFile, setCvFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     /* ===========================
//        AUTH CHECK
//     ============================ */
//     useEffect(() => {
//         const checkAuth = async () => {
//             const { data } = await supabase.auth.getUser();
//             if (!data.user) {
//                 router.push("/login");
//             } else {
//                 setLoadingAuth(false);
//             }
//         };
//         checkAuth();
//     }, [router, supabase]);

//     /* ===========================
//        FILE UPLOAD HELPER
//     ============================ */
//     const uploadFile = async (file, path) => {
//         const { error } = await supabase.storage
//             .from("applicant-assets")
//             .upload(path, file, { upsert: true });
//         if (error) throw error;

//         const { data } = supabase.storage.from("applicant-assets").getPublicUrl(path);
//         return data.publicUrl;
//     };

//     /* ===========================
//        PROFILE SAVE
//     ============================ */
//     const handleSave = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage("");

//         const { data } = await supabase.auth.getUser();
//         const user = data.user;

//         if (!user) {
//             setMessage("You must be logged in");
//             setLoading(false);
//             return;
//         }

//         try {
//             let profileImageUrl = null;
//             let cvUrl = null;

//             if (profileImage) {
//                 profileImageUrl = await uploadFile(
//                     profileImage,
//                     `profile-pictures/${user.id}.${profileImage.name.split(".").pop()}`
//                 );
//             }

//             if (cvFile) {
//                 cvUrl = await uploadFile(
//                     cvFile,
//                     `cvs/${user.id}.${cvFile.name.split(".").pop()}`
//                 );
//             }

//             // Update profiles
//             const { error: profileError } = await supabase
//                 .from("profiles")
//                 .update({ name })
//                 .eq("id", user.id);
//             if (profileError) throw profileError;

//             // Update applicants
//             const { error: applicantError } = await supabase
//                 .from("applicants")
//                 .update({
//                     skills,
//                     bio,
//                     education,
//                     experience,
//                     photo_url: profileImageUrl,
//                     cv_url: cvUrl,
//                 })
//                 .eq("user_id", user.id);
//             if (applicantError) throw applicantError;

//             setMessage("Profile saved successfully ✅");

//             // ✅ Redirect to dashboard after saving
//             router.push("/jobs-list");
//         } catch (err) {
//             setMessage(err.message);
//         }

//         setLoading(false);
//     };

//     /* ===========================
//        SKILLS HANDLERS
//     ============================ */
//     const handleSkillKeyDown = (e) => {
//         if (e.key === "Enter" && skillInput.trim()) {
//             e.preventDefault();
//             if (!skills.includes(skillInput.trim())) {
//                 setSkills([...skills, skillInput.trim()]);
//             }
//             setSkillInput("");
//         } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
//             setSkills(skills.slice(0, -1));
//         }
//     };

//     const removeSkill = (skillToRemove) => {
//         setSkills(skills.filter((skill) => skill !== skillToRemove));
//     };

//     /* ===========================
//        EDUCATION HANDLERS
//     ============================ */
//     const addEducation = () => {
//         setEducation([...education, { id: Date.now(), school: "", degree: "", year: "", description: "" }]);
//     };

//     const removeEducation = (id) => {
//         setEducation(education.filter((edu) => edu.id !== id));
//     };

//     const updateEducation = (id, field, value) => {
//         setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
//     };

//     /* ===========================
//        EXPERIENCE HANDLERS
//     ============================ */
//     const addExperience = () => {
//         setExperience([...experience, { id: Date.now(), company: "", role: "", year: "", description: "" }]);
//     };

//     const removeExperience = (id) => {
//         setExperience(experience.filter((exp) => exp.id !== id));
//     };

//     const updateExperience = (id, field, value) => {
//         setExperience(experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
//     };

//     /* ===========================
//        RENDER
//     ============================ */
//     if (loadingAuth) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-2xl mx-auto">
//                 <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
//                         <h1 className="text-2xl font-bold text-white tracking-tight">
//                             Applicant Profile
//                         </h1>
//                         <p className="text-blue-100 mt-2 text-sm">
//                             Complete your profile to stand out to recruiters
//                         </p>
//                     </div>

//                     <div className="p-8">
//                         <form onSubmit={handleSave} className="space-y-6">
//                             {/* Name */}
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-semibold text-gray-700">
//                                     Full Name
//                                 </label>
//                                 <input
//                                     className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
//                                     placeholder="e.g. Alex Morgan"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                 />
//                             </div>

//                             {/* Skills */}
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-semibold text-gray-700">
//                                     Skills
//                                 </label>
//                                 <div className="w-full border border-gray-300 rounded-lg px-4 py-3 flex flex-wrap gap-2 items-center bg-white min-h-[50px]">
//                                     {skills.map((skill, index) => (
//                                         <span key={index} className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
//                                             {skill}
//                                             <button type="button" onClick={() => removeSkill(skill)} className="text-blue-500 hover:text-blue-900">×</button>
//                                         </span>
//                                     ))}
//                                     <input
//                                         className="flex-grow outline-none bg-transparent min-w-[120px]"
//                                         placeholder={skills.length === 0 ? "Type skill & press Enter" : ""}
//                                         value={skillInput}
//                                         onChange={(e) => setSkillInput(e.target.value)}
//                                         onKeyDown={handleSkillKeyDown}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Bio */}
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-semibold text-gray-700">
//                                     Professional Bio
//                                 </label>
//                                 <textarea
//                                     className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none"
//                                     rows={4}
//                                     placeholder="Tell us about your professional background..."
//                                     value={bio}
//                                     onChange={(e) => setBio(e.target.value)}
//                                 />
//                             </div>



//                             {/* Structured Education */}
//                             <div className="space-y-4"> <div className="flex items-center justify-between"> <label className="block text-sm font-semibold text-gray-700"> Education </label> <button type="button" onClick={addEducation} className="text-sm text-blue-600 font-medium hover:text-blue-800" > + Add Education </button> </div> <div className="space-y-4"> {education.map((edu, index) => (<div key={edu.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group" > <button type="button" onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove" > <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> </button> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="School / University" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} /> <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Degree / Certificate" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} /> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Year (e.g. 2020-2024)" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} /> </div> <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" rows={2} placeholder="Description (optional)" value={edu.description} onChange={(e) => updateEducation(edu.id, "description", e.target.value)} /> </div>))} {education.length === 0 && (<div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm"> No education added yet. Click above to add. </div>)} </div> </div>

//                             {/* Structured Experience */}
//                             <div className="space-y-4"> <div className="flex items-center justify-between"> <label className="block text-sm font-semibold text-gray-700"> Experience </label> <button type="button" onClick={addExperience} className="text-sm text-blue-600 font-medium hover:text-blue-800" > + Add Experience </button> </div> <div className="space-y-4"> {experience.map((exp, index) => (<div key={exp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group" > <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove" > <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> </button> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} /> <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Role / Position" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} /> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Year (e.g. 2022-Present)" value={exp.year} onChange={(e) => updateExperience(exp.id, "year", e.target.value)} /> </div> <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" rows={2} placeholder="Key responsibilities..." value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} /> </div>))} {experience.length === 0 && (<div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm"> No experience added yet. Click above to add. </div>)} </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"></div>

//                             {/* Profile Picture */}
//                             <div className="space-y-2"> <label className="block text-sm font-semibold text-gray-700"> Profile Picture </label> <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"> <div className="flex flex-col items-center justify-center pt-5 pb-6"> <svg className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg> <p className="text-xs text-gray-500 group-hover:text-gray-700"> {profileImage ? profileImage.name : "Drop image or click"} </p> </div> <input type="file" className="hidden" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} /> </label> </div>

//                             {/* CV */}
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-semibold text-gray-700">
//                                     Curriculum Vitae
//                                 </label>
//                                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
//                                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                         <svg
//                                             className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                             />
//                                         </svg>
//                                         <p className="text-xs text-gray-500 group-hover:text-gray-700">
//                                             {cvFile ? cvFile.name : "Drop PDF or click"}
//                                         </p>
//                                     </div>
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         accept=".pdf"
//                                         onChange={(e) => setCvFile(e.target.files[0])}
//                                     />
//                                 </label>
//                             </div>


//                             {/* Submit */}
//                             <div className="pt-6">
//                                 <button
//                                     disabled={loading}
//                                     className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
//                                         }`}
//                                 >
//                                     {loading ? "Saving Profile..." : "Save Profile"}
//                                 </button>
//                             </div>

//                             {message && (
//                                 <p className={`mt-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
//                                     {message}
//                                 </p>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
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