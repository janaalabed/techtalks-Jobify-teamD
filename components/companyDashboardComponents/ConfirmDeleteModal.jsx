"use client";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ title = "Delete Job", message = "Are you sure? This listing will be permanently removed.", onConfirm, onCancel, loading = false }) {
return (
  <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-[#170e2c]/80 backdrop-blur-md">
    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-200">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-2xl font-black text-[#170e2c] mb-2 uppercase tracking-tight">Remove Listing?</h2>
      <p className="text-[#7270b1] font-medium mb-10 leading-relaxed">This action is permanent. All applications for this role will be hidden.</p>

      <div className="flex flex-col gap-3">
        <button onClick={onConfirm} disabled={loading}
          className="w-full rounded-2xl bg-rose-600 text-white text-sm font-black py-4 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all uppercase tracking-widest">
          {loading ? "Removing..." : "Yes, Delete Job"}
        </button>
        <button onClick={onCancel} disabled={loading}
          className="w-full rounded-2xl border border-slate-100 bg-slate-50 text-sm font-black text-[#7270b1] py-4 hover:bg-white transition-all uppercase tracking-widest">
          No, Keep it
        </button>
      </div>
    </div>
  </div>
);
}