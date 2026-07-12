import React, { useState } from "react";
import api from "../../services/api";
import { ShieldCheck, UserCheck, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [profId, setProfId] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!profId) return;

    try {
      const res = await api.put(`/admin/verify/${profId}`);
      setMessage(
        res.data.message ||
          "Professional verification status pushed live successfully.",
      );
      setProfId("");
    } catch (err) {
      setMessage(
        "Error updating registration: verify target reference identifier entry.",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
          Governance Application Control Panel
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Perform standard marketplace moderation and verify certificates manual
          loops
        </p>
      </div>

      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm max-w-md">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-slate-400" /> Verify Provider
          Credentials
        </h3>

        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Professional User ID Token
            </label>
            <input
              type="number"
              required
              placeholder="e.g., 2"
              value={profId}
              onChange={(e) => setProfId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-100"
          >
            Approve & Authorize Live Marketplace Access
          </button>
        </form>
      </div>
    </div>
  );
}
