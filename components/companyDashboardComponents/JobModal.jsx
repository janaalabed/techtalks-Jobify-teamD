"use client";
import { useEffect, useState } from "react";
import getSupabase from "../../lib/supabaseClient";
import { X, Save, Info } from "lucide-react";

export default function JobModal({ mode, jobId, onClose, onSuccess }) {
  const supabase = getSupabase();
  const isEdit = mode === "edit";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    requirements: "",
    type: "",
    paid: true,
    salary: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      setUser(userData.user);

      if (isEdit && jobId) {
        setLoading(true);
        const { data: job } = await supabase.from("jobs").select("*").eq("id", jobId).single();
        if (job) setForm({ ...job });
        setLoading(false);
      }
    };
    loadData();
  }, [isEdit, jobId, supabase]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const { data: emp } = await supabase.from("employers").select("id").eq("user_id", user.id).single();
    
    const payload = { ...form, employer_id: emp.id };
    const query = isEdit ? supabase.from("jobs").update(payload).eq("id", jobId) : supabase.from("jobs").insert([payload]);
    
    const { error } = await query;
    if (error) { setError(error.message); setSaving(false); }
    else onSuccess();
  }

  if (loading) return null;
return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#170e2c]/80 backdrop-blur-md">
    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-[#170e2c] p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3e3875] rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase tracking-tight">{isEdit ? "Update Listing" : "Post a Job"}</h2>
          <p className="text-[#7270b1] font-bold text-sm uppercase tracking-widest mt-1">Company Workspace</p>
        </div>
        <button onClick={onClose} className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#7270b1] uppercase tracking-widest ml-1">Job Title</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all" placeholder="Software Engineer" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#7270b1] uppercase tracking-widest ml-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all" placeholder="Remote / Beirut" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#7270b1] uppercase tracking-widest ml-1">Role Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all resize-none" placeholder="Tell us about the role..." />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#7270b1] uppercase tracking-widest ml-1">Requirements</label>
          <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={3}
            className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all resize-none" placeholder="Skills, years of experience..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#7270b1] uppercase tracking-widest ml-1">Job Type</label>
            <select name="type" value={form.type} onChange={handleChange} required
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none bg-white appearance-none cursor-pointer">
              <option value="">Select Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
             <span className="text-[11px] font-black text-[#3e3875] uppercase tracking-widest">Paid Position</span>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3e3875]"></div>
             </label>
          </div>
        </div>

        {form.paid && (
          <div className="bg-[#5f5aa7]/5 p-5 rounded-2xl space-y-2 border border-[#5f5aa7]/20 animate-in slide-in-from-top-2">
            <label className="text-[11px] font-black text-[#3e3875] uppercase tracking-widest ml-1">Salary Range / Amount</label>
            <input name="salary" value={form.salary} onChange={handleChange} required={form.paid}
              className="w-full border border-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3e3875] shadow-sm" placeholder="e.g. $1,200 - $1,500" />
          </div>
        )}
      </form>

      <div className="p-8 bg-slate-50 flex flex-col md:flex-row justify-end gap-3">
        <button onClick={onClose} className="px-8 py-4 rounded-2xl border border-slate-200 font-black text-slate-500 hover:bg-white transition-all uppercase text-xs tracking-widest">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className="bg-[#170e2c] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#170e2c]/20 hover:bg-[#3e3875] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest disabled:opacity-50">
          {saving ? "Processing..." : <><Save size={18} /> Save Listing</>}
        </button>
      </div>
    </div>
  </div>
);
}