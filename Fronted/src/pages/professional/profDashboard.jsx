import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Power,
  ToggleLeft,
  ToggleRight,
  Check,
  X,
  Briefcase,
  Calendar,
} from "lucide-react";

export default function ProfDashboard() {
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfMetrics();
  }, []);

  const fetchProfMetrics = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
      // Re-use user dashboard endpoint to gather local metrics profiles
      const res = await api.get(`/users/${user.id}/dashboard`);
      setProfile(res.data.profile);
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Error fetching provider dashboard info:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await api.put(`/professionals/${user.id}/toggle-availability`);
      alert("Availability status updated successfully.");
      fetchProfMetrics();
    } catch (err) {
      alert("Failed to modify tracking metrics switch.");
    }
  };

  const handleStatusUpdate = async (bookingId, nextStatus) => {
    try {
      await api.put(
        `/bookings/${bookingId}/status?status_string=${nextStatus}`,
      );
      alert(`Booking state successfully switched to ${nextStatus}`);
      fetchProfMetrics();
    } catch (err) {
      alert("Failed to transition status token.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-16 text-slate-400">
        Loading professional dashboard matrices...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Provider Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage job flows and platform visibility states
          </p>
        </div>
        <button
          onClick={handleToggleAvailability}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition-all shadow-sm"
        >
          <Power className="w-4 h-4 text-emerald-400" />
          Toggle Availability Live Status
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4">
          Incoming Appointment Requests
        </h3>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No incoming customer service request entries located.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{new Date(b.appointment_time).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Order ID Key:{" "}
                    <code className="bg-slate-50 border border-slate-100 px-1 py-0.5 rounded text-slate-600">
                      #HS-{b.id}
                    </code>
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Current Lifecycle:{" "}
                    <strong className="text-blue-600">
                      {b.booking_status}
                    </strong>
                  </p>
                </div>

                {b.booking_status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(b.id, "Accepted")}
                      className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(b.id, "Cancelled")}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}

                {b.booking_status === "Accepted" && (
                  <button
                    onClick={() => handleStatusUpdate(b.id, "Completed")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Mark Job as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
