import React, { useState } from "react";
import { UnitParser } from "../lib/parsers/UnitParser.js";

export default function LoadModal({ open, onClose, onLoad }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  /**
   * Handle file upload event
   * @param {InputEvent} ev The file input change event
   * @returns {Promise<void>}
   */
  async function handleFile(ev) {
    setError("");
    /** @type {HTMLInputElement} */
    const input = ev.target;
    const f = input.files && input.files[0];
    if (!f) return;
    if (!f.name.endsWith(".txt")) {
      setError("Please provide a .txt file");
      return;
    }
    setLoading(true);
    try {
      const text = await f.text();
      const units = UnitParser.parse(text);
      if (!units || units.length === 0) {
        setError("Parser returned no units from the provided file.");
      } else {
        onLoad(units);
        onClose();
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
      // reset input value so same file can be re-selected if needed
      ev.target.value = "";
    }
  }

  async function handleLoadVanilla() {
    setError("");
    setLoading(true);
    try {
      // Samples must live in public/Samples/export_descr_unit.txt
      const samplePath = "/Samples/export_descr_unit.txt";
      const res = await fetch(samplePath);
      if (!res.ok) throw new Error(`Failed to fetch sample: ${res.status}`);
      const text = await res.text();
      const units = UnitParser.parse(text);
      if (!units || units.length === 0) {
        setError("No units parsed from vanilla sample.");
      } else {
        onLoad(units);
        onClose();
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 760,
          maxWidth: "95%",
          background: "#fff",
          padding: 16,
          borderRadius: 6,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          display: "flex",
          gap: 12,
        }}
      >
        <div
          style={{ flex: 1, borderRight: "1px solid #eee", paddingRight: 12 }}
        >
          <h3>Upload .txt file</h3>
          <p>
            Choose a single exported file from the game or your edited file.
          </p>
          <input type="file" accept=".txt,text/plain" onChange={handleFile} />
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>

        <div style={{ width: 260, paddingLeft: 12 }}>
          <h3>Load vanilla file</h3>
          <p>Load the bundled vanilla sample from the app (public/Samples).</p>
          <button
            onClick={handleLoadVanilla}
            disabled={loading}
            style={{ display: "block", marginBottom: 8 }}
          >
            {loading ? "Loading…" : "Load vanilla file"}
          </button>

          <div style={{ marginTop: 18 }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{ marginRight: 8 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
