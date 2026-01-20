/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "../api/api";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  section: any;
  onClose: () => void;
  onSaved: (link: string) => void;
}

export default function EditMeetingLinkModal({
  open,
  section,
  onClose,
  onSaved,
}: Props) {
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(section?.driveLinks?.[0] ?? "");
  }, [section]);

  const [loading, setLoading] = useState(false);

  if (!open || !section) return null;

  const submit = async () => {
    if (!link) return;

    setLoading(true);
    try {
      await api.post(
        "/addmeetinglink",
        {
          section_id: section.id, // IMPORTANT: backend ID
          drive_link: link,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      onSaved(link);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Edit {section.title}
        </h2>

        <input
          type="url"
          placeholder="Paste Google Drive link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
