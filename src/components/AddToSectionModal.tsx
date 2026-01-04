/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api/api";

interface Props {
  userId: number; // the user to add
  onClose: () => void; // close the modal
  onSuccess: () => void; // refresh users after success
  userSections: Section[];
}

interface Section {
  id: number;
  name: string;
}

export default function AddToSectionModal({
  userId,
  onClose,
  onSuccess,
}: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sections from backend
  useEffect(() => {
    api
      .get("/sections", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => setSections(res.data))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_err) => setError("Failed to fetch sections"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return setError("Please select a section");

    setLoading(true);
    setError(null);

    try {
      await api.post(
        `/user/${userId}/add-to-section`,
        { section_id: selectedSection },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add user to section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Add User to Section</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <select
          value={selectedSection ?? ""}
          onChange={(e) => setSelectedSection(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select a Section --</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="text-gray-500">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add to Section"}
          </button>
        </div>
      </form>
    </div>
  );
}
