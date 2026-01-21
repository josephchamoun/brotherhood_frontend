/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FaGoogleDrive,
  FaTimes,
  FaEnvelope,
  FaKey,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import type { DriveAccount } from "../types";
import api from "../api/api";

interface AddDriveAccountModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (account: DriveAccount) => void;
}

export default function AddDriveAccountModal({
  open,
  onClose,
  onCreated,
}: AddDriveAccountModalProps) {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await api.post(
        "/drive-accounts",
        { title, email, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setSuccess(true);

      // Show success message briefly before closing
      setTimeout(() => {
        onCreated(res.data);
        setTitle("");
        setEmail("");
        setPassword("");
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setEmail("");
      setPassword("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl transform animate-scale-in overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative">
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="text-lg" />
          </button>

          <div className="flex items-center gap-4 text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FaGoogleDrive className="text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Add Drive Account</h2>
              <p className="text-blue-100 text-sm mt-1">
                Connect a new Google Drive
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Success Message */}
          {success && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-6 animate-scale-in">
              <div className="flex items-center gap-3 text-green-800">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-bold text-lg">Account Added!</p>
                  <p className="text-sm text-green-700">
                    Successfully connected to Google Drive
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="font-bold text-red-800 mb-1">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaTag className="text-indigo-600" />
                Account Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading || success}
                placeholder="e.g., Team Drive, Admin Account"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-indigo-600" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
                placeholder="example@gmail.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaKey className="text-indigo-600" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="Enter password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 flex items-start gap-2">
                <FaGoogleDrive className="mt-0.5 flex-shrink-0 text-blue-600" />
                <span>
                  Make sure the Google Drive account has the necessary
                  permissions enabled.
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading || success}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-105 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : success ? (
                  <>
                    <FaCheckCircle />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <FaGoogleDrive />
                    <span>Add Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
