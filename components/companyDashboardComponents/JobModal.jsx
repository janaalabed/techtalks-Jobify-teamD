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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#170e2c]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#3e3875] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{isEdit ? "Update Job Posting" : "Post a New Job"}</h2>
            <p className="text-indigo-200 text-sm">Fill in the details for your new opening.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Job Title</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3e3875]/20 outline-none" placeholder="Software Engineer" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Location</label>
              <input name="location" value={form.location} onChange={handleChange} required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3e3875]/20 outline-none" placeholder="Remote / Beirut" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3e3875]/20 outline-none" placeholder="Tell us about the role..." />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Requirements</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3e3875]/20 outline-none" placeholder="Skills, years of experience..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Job Type</label>
              <select name="type" value={form.type} onChange={handleChange} required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3e3875]/20 outline-none bg-white">
                <option value="">Select Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Compensation</label>
              <div className="flex items-center gap-4 mt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3e3875]"></div>
                  <span className="ml-3 text-sm font-medium text-slate-600">Paid Position</span>
                </label>
              </div>
            </div>
          </div>

          {form.paid && (
            <div className="bg-indigo-50 p-4 rounded-xl space-y-1 border border-indigo-100">
              <label className="text-sm font-semibold text-[#3e3875]">Salary Range / Amount</label>
              <input name="salary" value={form.salary} onChange={handleChange} required={form.paid}
                className="w-full border border-indigo-200 rounded-lg px-4 py-2 outline-none focus:border-[#3e3875]" placeholder="e.g. $1,200 - $1,500" />
            </div>
          )}
        </form>

        <div className="p-6 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-white transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="bg-[#3e3875] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#170e2c] transition-all flex items-center gap-2">
            {saving ? "Saving..." : <><Save size={18} /> Save Job</>}
          </button>
        </div>
      </div>
    </div>
  );
}