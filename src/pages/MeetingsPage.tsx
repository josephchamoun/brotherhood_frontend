/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaLink, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import api from "../api/api";
import EditMeetingLinkModal from "../components/EditMeetingLinkModal";

interface MeetingSection {
  id: number; // backend section ID
  key: "chabiba" | "tala2e3" | "forsan";
  title: string;
  driveLinks: string[];
}

export default function MeetingsPage() {
  const user = JSON.parse(localStorage.getItem("user_info") || "{}");

  const [sections, setSections] = useState<MeetingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<MeetingSection | null>(
    null,
  );

  /* ---------------- PERMISSIONS ---------------- */
  const canManageSection = (sectionId: number) => {
    if (user?.is_global_admin || user?.is_super_admin) return true;

    return user?.roles?.some(
      (r: any) =>
        r.section_id === sectionId &&
        ["President", "Ne2b al Ra2is", "wakil tanchi2a"].includes(r.role_name),
    );
  };

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get("/meetings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        // Transform backend sections to frontend format
        const transformed = res.data.map((section: any) => ({
          id: section.id, // 👈 IMPORTANT
          key: section.name.toLowerCase(), // optional
          title: section.name + " Meetings",
          driveLinks: section.meetings?.map((m: any) => m.drive_link) ?? [],
        }));

        setSections(transformed);
      } catch {
        // fallback if backend fails
        setSections([
          { key: "chabiba", id: 1, title: "Chabiba Meetings", driveLinks: [] },
          { key: "tala2e3", id: 2, title: "Tala2e3 Meetings", driveLinks: [] },
          { key: "forsan", id: 3, title: "Forsan Meetings", driveLinks: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">
          Meetings Archive
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => {
              const canEdit = canManageSection(section.id);

              return (
                <div
                  key={section.key}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-blue-600"
                >
                  {/* HEADER */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                        <FaUsers className="text-white text-xl" />
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-6 space-y-4">
                    {section.driveLinks?.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No meeting link added yet.
                      </p>
                    )}

                    {section.driveLinks?.map((link) => (
                      <div
                        key={link}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:bg-blue-50 transition"
                      >
                        <FaLink className="text-blue-600 shrink-0" />
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-700 truncate"
                        >
                          {link}
                        </a>
                      </div>
                    ))}

                    {canEdit && (
                      <button
                        onClick={() => {
                          setSelectedSection(section);
                          setModalOpen(true);
                        }}
                        className="mt-4 w-full text-center px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
                      >
                        Edit Meeting Link
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedSection && (
        <EditMeetingLinkModal
          open={modalOpen}
          section={selectedSection}
          onClose={() => {
            setModalOpen(false);
            setSelectedSection(null);
          }}
          onSaved={(link) => {
            setSections((prev) =>
              prev.map((s) =>
                s.key === selectedSection.key
                  ? { ...s, driveLinks: [link] }
                  : s,
              ),
            );
          }}
        />
      )}
    </div>
  );
}
