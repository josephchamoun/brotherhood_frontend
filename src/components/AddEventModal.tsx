/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../api/api";
import type { Event } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (event: Event) => void;
  isGlobalAdmin: boolean;
}

export default function AddEventModal({
  open,
  onClose,
  onCreated,
  isGlobalAdmin,
}: Props) {
  const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    event_date: now,
    total_spent: "0",
    total_revenue: "0",
    notes: "",
    drive_link: "",
    shared_event: false,
  });

  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm({
        title: "",
        type: "",
        description: "",
        event_date: now,
        total_spent: "0",
        total_revenue: "0",
        notes: "",
        drive_link: "",
        shared_event: false,
      });
      setSelectedSections([]);
    }
  }, [open, now]);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // If admin selected "Shared", convert to all sections
      let sectionsToSend = [...selectedSections];
      if (sectionsToSend.includes(4)) {
        sectionsToSend = [1, 2, 3];
      }

      const payload = {
        title: form.title,
        type: form.type,
        description: form.description,
        event_date: form.event_date || now,
        total_spent: form.total_spent,
        total_revenue: form.total_revenue,
        notes: form.notes,
        drive_link: form.drive_link,
        shared_event: form.shared_event,
        sections: isGlobalAdmin ? sectionsToSend : undefined,
      };

      const res = await api.post("/addevent", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      onCreated(res.data.event);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4"
      >
        <h2 className="text-xl font-bold">Add Event</h2>

        {/* REQUIRED FIELDS */}
        <input
          name="title"
          placeholder="Title *"
          required
          value={form.title}
          onChange={handleFieldChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="type"
          placeholder="Type *"
          required
          value={form.type}
          onChange={handleFieldChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          name="event_date"
          value={form.event_date}
          onChange={handleFieldChange}
          className="w-full border rounded px-3 py-2"
        />

        {/* OPTIONAL FIELDS COLLAPSIBLE */}
        <details className="border rounded p-2">
          <summary className="cursor-pointer font-semibold">
            Optional Fields
          </summary>

          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleFieldChange}
            className="w-full border rounded px-3 py-2 mt-2"
          />
          <input
            type="number"
            name="total_spent"
            placeholder="Total Spent"
            value={form.total_spent}
            onChange={handleFieldChange}
            className="w-full border rounded px-3 py-2 mt-2"
          />
          <input
            type="number"
            name="total_revenue"
            placeholder="Total Revenue"
            value={form.total_revenue}
            onChange={handleFieldChange}
            className="w-full border rounded px-3 py-2 mt-2"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleFieldChange}
            className="w-full border rounded px-3 py-2 mt-2"
          />
          <input
            type="url"
            name="drive_link"
            placeholder="Google Drive link (optional)"
            value={form.drive_link}
            onChange={handleFieldChange}
            className="w-full border rounded px-3 py-2 mt-2"
          />
        </details>

        {/* Global Admin section selector */}
        {isGlobalAdmin && (
          <div>
            <label className="block mb-1 font-semibold">Select Sections</label>
            <select
              multiple
              value={selectedSections.map(String)}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions).map((o) =>
                  parseInt(o.value)
                );
                setSelectedSections(options);
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value={1}>Chabiba</option>
              <option value={2}>Tala2e3</option>
              <option value={3}>Forsan</option>
              <option value={4}>Shared (All Sections)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Cmd) to select multiple
            </p>
          </div>
        )}

        {/* SHARED EVENT */}
        {!isGlobalAdmin && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="shared_event"
              checked={form.shared_event}
              onChange={handleCheckboxChange}
            />
            Shared event
          </label>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="text-gray-500">
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition
              ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
