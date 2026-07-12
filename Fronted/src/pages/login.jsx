import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginState } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, user } = response.data;

      // Update global context state values
      loginState(user, access_token);

      // Route access shifts matching authorization flags
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "professional")
        navigate("/professional/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid email or password combination.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white border border-slate-100 max-w-md w-full p-8 rounded-2xl shadow-xl shadow-slate-100/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Access your Hamro Sewa workspace hub
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Password Matrix
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none text-sm transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 text-sm mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Authenticating..." : "Sign In Engine"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          New to the platform?{" "}
          <a
            href="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Create an Account
          </a>
        </p>
      </div>
    </div>
  );
}
