import { useEffect, useState } from "react";
import api from "../api/api";
import type { User } from "../types";
import Navbar from "../components/Navbar";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ChabibaPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );

  // Logged-in user info
  const loggedInUser = JSON.parse(localStorage.getItem("user_info") || "{}");

  // Fetch Chabiba users
  useEffect(() => {
    api
      .get("/chabiba", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete user.");
    }
  };

  // Only users in Forsan section (section_id = 1)
  const forsanUsers = users;

  // Render a user card
  const renderUser = (u: User) => {
    // Get role for Forsan
    const forsanSection = u.sections?.find((s) => s.id === 1);
    const roleName = forsanSection?.pivot?.role_id ? u.role?.name : "No role";

    return (
      <div
        key={u.id}
        className="group bg-white border border-gray-200 p-4 rounded-lg mb-3
                   shadow-sm hover:shadow-md hover:border-blue-200
                   transition flex justify-between items-center"
      >
        <div>
          <p className="font-semibold text-gray-800">{u.name}</p>
          <p className="text-sm text-gray-500">{roleName}</p>
        </div>

        {(loggedInUser?.role_id === 1 || loggedInUser?.role_id === 2) && (
          <button
            className="opacity-0 group-hover:opacity-100 transition
                       text-red-500 hover:text-red-700"
            onClick={() => handleDeleteUser(u.id)}
            title="Delete user"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Chabiba <span className="text-gray-400 text-2xl">شبيبة</span>
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Members</h2>

            {(loggedInUser?.role_id === 1 || loggedInUser?.role_id === 2) && (
              <button
                className="bg-blue-600 hover:bg-blue-700 transition
                           text-white px-4 py-1.5 rounded-md
                           text-sm font-medium"
                onClick={() => {
                  setSelectedSectionId(1);
                  setShowAddUser(true);
                }}
              >
                + Add User
              </button>
            )}
          </div>

          <div>
            {forsanUsers.length ? (
              forsanUsers.map(renderUser)
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No users in Forsan
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && selectedSectionId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm
                     flex items-center justify-center z-50"
        >
          <div className="relative animate-fadeIn">
            <button
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600
                         text-white rounded-full w-8 h-8 flex items-center
                         justify-center shadow"
              onClick={() => setShowAddUser(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
