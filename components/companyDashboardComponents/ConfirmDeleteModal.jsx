"use client";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ title = "Delete Job", message = "Are you sure? This listing will be permanently removed.", onConfirm, onCancel, loading = false }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-[#170e2c]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 mb-8">{message}</p>

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 py-3 hover:bg-slate-50 transition">
            Keep Job
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 rounded-xl bg-rose-600 text-white text-sm font-bold py-3 hover:bg-rose-700 shadow-lg shadow-rose-200 transition">
            {loading ? "Deleting..." : "Delete Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}