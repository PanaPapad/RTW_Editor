import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  /**
   * @type {{id: string, label: string, disabled?: boolean}[]}
   */
  const editors = [
    { id: "units", label: "Units" },
    { id: "buildings", label: "Buildings (coming eventually)", disabled: true },
    { id: "traits", label: "Traits (coming eventually)", disabled: true },
  ];

  return (
    <div>
      <h2>Select editor</h2>
      <p>Choose which game data you want to edit.</p>
      <div style={{ display: "flex", gap: 12 }}>
        {editors.map((e) => (
          <button
            key={e.id}
            disabled={e.disabled}
            onClick={() => navigate(`/editor/${e.id}`)}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
