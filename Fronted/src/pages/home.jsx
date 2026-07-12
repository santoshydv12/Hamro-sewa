import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Wrench,
  Car,
  HeartPulse,
} from "lucide-react";

export default function Home() {
  const [professionals, setProfessionals] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // States for the Booking Modal window
  const [selectedProf, setSelectedProf] = useState(null);
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    fetchProfessionals();
  }, [category]);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/professionals${category ? `?category=${category}` : ""}`,
      );
      setProfessionals(res.data);
    } catch (err) {
      console.error("Error retrieving professional data profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const userString = localStorage.getItem("user");
    if (!userString) {
      alert("Please authenticate or log in to complete booking requests.");
      return;
    }
    const user = JSON.parse(userString);

    try {
      await api.post(
        `/bookings/?user_id=${user.id}&professional_id=${selectedProf.id}&appt_time=${bookingTime}`,
      );
      setBookingSuccess("Booking request sent successfully to professional!");
      setTimeout(() => {
        setSelectedProf(null);
        setBookingTime("");
        setBookingSuccess("");
      }, 2500);
    } catch (err) {
      alert(err.response?.data?.detail || "Booking configuration error.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Hero Search Area */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white mb-10 shadow-lg text-center md:text-left md:flex justify-between items-center">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Find. Book. Get Help Instantly.
          </h1>
          <p className="text-blue-100 text-sm md:text-base font-light">
            Connect directly with verified local plumbers, electricians,
            mechanics, and health care providers across Nepal.
          </p>
        </div>
      </div>

      {/* Category Toggle Strip */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">
          Filter By Marketplace Sectors
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCategory("")}
            className={`px-5 py-3 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all ${!category ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            All Services
          </button>
          <button
            onClick={() => setCategory("Home")}
            className={`px-5 py-3 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all ${category === "Home" ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <Wrench className="w-4 h-4" /> Home Repair
          </button>
          <button
            onClick={() => setCategory("Vehicle")}
            className={`px-5 py-3 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all ${category === "Vehicle" ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <Car className="w-4 h-4" /> Vehicle Mechanics
          </button>
          <button
            onClick={() => setCategory("Health")}
            className={`px-5 py-3 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all ${category === "Health" ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <HeartPulse className="w-4 h-4" /> Health & Care
          </button>
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium">
          Scanning marketplace engines...
        </div>
      ) : professionals.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 text-center rounded-2xl text-slate-400">
          No active verified professionals found operating in this specific
          category loop right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {professionals.map((prof) => (
            <div
              key={prof.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow animate-scale-up"
            >
              <div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider inline-block mb-3">
                  {prof.category} Engine
                </span>
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                  {prof.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{prof.city}, Nepal</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 text-sm font-medium mb-5">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>
                    NPR{" "}
                    <strong className="text-base text-slate-900 font-black">
                      {prof.price}
                    </strong>{" "}
                    / hour base
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProf(prof)}
                disabled={!prof.is_available}
                className={`w-full text-center py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all ${
                  prof.is_available
                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {prof.is_available
                  ? "Request Booking Instantly"
                  : "Fully Booked"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Overlay Modal pop-up window */}
      {selectedProf && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-100 shadow-2xl relative animate-scale-up">
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Configure Appointment
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Filing request node targeting provider:{" "}
              <strong>{selectedProf.name}</strong>
            </p>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-medium mb-2">
                {bookingSuccess}
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Target Date & Timing
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProf(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-100"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
