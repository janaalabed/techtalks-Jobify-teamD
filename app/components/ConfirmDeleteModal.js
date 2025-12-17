"use client";

export default function ConfirmDeleteModal({
  title = "Delete Job",
  message = "Are you sure you want to delete this job? This action cannot be undone.",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {title}
        </h2>

        <p className="text-sm text-slate-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 py-2.5 hover:bg-slate-50 transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
