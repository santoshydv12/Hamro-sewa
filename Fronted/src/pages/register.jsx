import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { UserPlus, User, Briefcase, MapPin, AlertCircle } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "Kathmandu",
    role: "user",
    service_category: "Home",
    base_pricing_rate: 500,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        ...formData,
        base_pricing_rate:
          formData.role === "professional"
            ? parseFloat(formData.base_pricing_rate)
            : 0.0,
      });
      setSuccess(
        "Account created successfully! Redirecting to login portal...",
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration lifecycle processing failure.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="bg-white border border-slate-100 max-w-lg w-full p-8 rounded-2xl shadow-xl shadow-slate-100/50">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Join the Hamro Sewa service network
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Split Profile Choice Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "user" })}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                formData.role === "user"
                  ? "border-blue-600 bg-blue-50/50 text-blue-600 font-bold"
                  : "border-slate-200 hover:bg-slate-50 text-slate-500"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Customer Client</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "professional" })}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                formData.role === "professional"
                  ? "border-blue-600 bg-blue-50/50 text-blue-600 font-bold"
                  : "border-slate-200 hover:bg-slate-50 text-slate-500"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs">Service Provider</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Santosh Yadav"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@domain.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                City Location
              </label>
              <select
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 appearance-none"
              >
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Pokhara">Pokhara</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password Matrix
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800"
            />
          </div>

          {/* Conditional Professional Setup Fields */}
          {formData.role === "professional" && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 animate-scale-up">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Category Type
                </label>
                <select
                  value={formData.service_category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      service_category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="Home">Home Utility (Plumbing/Electric)</option>
                  <option value="Vehicle">Vehicle Repairs</option>
                  <option value="Health">Health & Wellness</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Hourly Base Rate (NPR)
                </label>
                <input
                  type="number"
                  min="100"
                  value={formData.base_pricing_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base_pricing_rate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 text-sm mt-3"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Processing System Setup..." : "Register Profile Engine"}
          </button>
        </form>
      </div>
    </div>
  );
}
