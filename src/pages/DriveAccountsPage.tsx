/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaGoogleDrive,
  FaEnvelope,
  FaKey,
  FaTrash,
  FaEye,
  FaPlus,
  FaShieldAlt,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

// Import your actual components
import Navbar from "../components/Navbar";
import AddDriveAccountModal from "../components/AddDriveAccountModal";
import api from "../api/api";

import type { DriveAccount } from "../types";

export default function DriveAccountsPage() {
  const [allAccounts, setAllAccounts] = useState<DriveAccount[]>([]);
  const [accounts, setAccounts] = useState<DriveAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [passwordModal, setPasswordModal] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = JSON.parse(localStorage.getItem("user_info") || "{}");
  const canAccess =
    user?.is_global_admin ||
    user?.roles?.some((r: any) => r.role_name === "Amin Ser");

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!canAccess) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/drive-accounts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setAllAccounts(res.data);
        setAccounts(res.data);
      } catch {
        setError("Failed to load drive accounts");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [canAccess]);

  useEffect(() => {
    const filtered = allAccounts.filter(
      (acc) =>
        acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setAccounts(filtered);
  }, [searchTerm, allAccounts]);

  const showPassword = async (id: number) => {
    setPasswordLoading(true);
    setPasswordModal("loading");

    try {
      const res = await api.get(`/drive-accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setPasswordModal(res.data.password);
    } catch {
      alert("Failed to fetch password");
      setPasswordModal(null);
    } finally {
      setPasswordLoading(false);
    }
  };

  const copyPassword = () => {
    if (passwordModal && passwordModal !== "loading") {
      navigator.clipboard.writeText(passwordModal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteAccount = async (id: number) => {
    if (!confirm("Delete this drive account?")) return;

    try {
      await api.delete(`/drive-accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setAllAccounts((prev) => prev.filter((a) => a.id !== id));
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete drive account");
    }
  };

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Access Denied
            </h2>
            <p className="text-gray-600 text-lg">
              You don't have permission to view Drive Accounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <FaGoogleDrive className="text-white text-xl" />
                </div>
                Drive Accounts
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your Google Drive credentials
              </p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaPlus className="relative z-10 text-lg" />
              <span className="relative z-10">Add Account</span>
            </button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by email or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Enhanced Grid */}
        {!loading && !error && (
          <>
            {accounts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaGoogleDrive className="text-gray-400 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No accounts found
                </h3>
                <p className="text-gray-600 text-lg">
                  {searchTerm
                    ? "Try a different search term"
                    : "Add your first Drive account to get started"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Gradient Top Bar */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <div className="p-7">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <FaGoogleDrive className="text-white text-2xl" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                              {acc.title}
                            </h2>
                            <p className="text-sm text-gray-500 truncate flex items-center gap-2">
                              <FaEnvelope className="text-gray-400 flex-shrink-0" />
                              {acc.email}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteAccount(acc.id)}
                          className="w-11 h-11 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0 ml-2"
                          title="Delete account"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Email Display Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl mb-4 border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaEnvelope className="text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-600 mb-1 font-medium">
                              Email Address
                            </p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {acc.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Show Password Button */}
                      <button
                        onClick={() => showPassword(acc.id)}
                        disabled={passwordLoading}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                      >
                        <FaEye className="text-lg" />
                        <span>View Password</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Enhanced Password Modal */}
        {passwordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform animate-scale-in overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FaKey className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Password</h2>
                    <p className="text-indigo-100 text-sm">Handle with care</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {passwordLoading || passwordModal === "loading" ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-600 text-lg font-medium">
                      Retrieving password...
                    </p>
                    <p className="text-gray-400 text-sm mt-2">Please wait</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200 mb-4 relative group">
                      <div className="flex items-center gap-3 mb-2">
                        <FaShieldAlt className="text-indigo-600" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Secure Password
                        </span>
                      </div>
                      <p className="text-xl font-mono font-bold text-gray-900 break-all leading-relaxed">
                        {passwordModal}
                      </p>

                      {/* Copy Button */}
                      <button
                        onClick={copyPassword}
                        className="absolute top-3 right-3 p-2 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 group-hover:border-indigo-300"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <FaCheck className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>

                    {copied && (
                      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                        <FaCheck />
                        <span className="font-medium">
                          Copied to clipboard!
                        </span>
                      </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-amber-800 text-sm flex items-start gap-2">
                        <FaShieldAlt className="mt-0.5 flex-shrink-0" />
                        <span>
                          Keep this password secure and never share it publicly.
                        </span>
                      </p>
                    </div>
                  </>
                )}

                {/* Close Button */}
                <button
                  onClick={() => {
                    setPasswordModal(null);
                    setCopied(false);
                  }}
                  disabled={passwordLoading}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {passwordLoading ? "Please wait..." : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddDriveAccountModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={(acc: DriveAccount) => {
          setAllAccounts([acc, ...allAccounts]);
          setAccounts([acc, ...accounts]);
        }}
      />

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
            transform: scale(0.9);
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
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
