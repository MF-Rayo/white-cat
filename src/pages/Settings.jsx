import { useState } from "react";
import { applyTheme } from "@/lib/themes";
import { Check } from "lucide-react";
import TerminalKitty from "@/components/ui/kitty"
import { Palette } from "lucide-react"

const themeOptions = [
  { name: "blue", label: "Blue", color: "#3066f6" },
  { name: "purple", label: "Purple", color: "#6B30F6" },
  { name: "orange", label: "Orange", color: "#f6752b" },
  { name: "green", label: "Green", color: "#20c96b" },
  { name: "black", label: "Black", color: "#4b5563" },
];

export default function Color() {
  const [selected, setSelected] = useState(
    localStorage.getItem("app-theme") || "blue"
  );

  const handleSelect = (themeName) => {
    applyTheme(themeName);
    setSelected(themeName);
  };

  return (
    <TerminalKitty
      path="~/Settings"
    >
      <div style={{ padding: "2rem" }}>
  
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-color)",
            marginBottom: "1.5rem",
          }}
        >
          <Palette /> Select Color
        </h3>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {themeOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={() => handleSelect(opt.name)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "var(--radius-card, 14px)",
                border:
                  selected === opt.name
                    ? `2px solid ${opt.color}`
                    : "2px solid var(--border-color)",
                background: "var(--card-bg)",
                color: "var(--text-color)",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: opt.color,
                  display: "inline-block",
                }}
              />
              {opt.label}
              {selected === opt.name && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>
    </TerminalKitty>
  );
}