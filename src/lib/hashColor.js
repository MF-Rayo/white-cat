const COLORS = [
    "var(--color_a)",
    "var(--color_b)",
    "var(--color_c)",
    "var(--color_d)",
    "var(--color_e)",
    "var(--color_f)",
    "var(--color_g)",
];

export function hashToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
}


const SEVERITY_COLORS = {
    CRITICAL: "var(--danger-color)",
    HIGH:     "var(--warning-color)",
    MEDIUM:   "var(--info-color)",
    LOW:      "var(--success-color)",
};

const DEFAULT_SEVERITY_COLOR = "var(--text-secondary)";

export function hashToColorSeverity(severity) {
    if (typeof severity !== "string") return DEFAULT_SEVERITY_COLOR;
    return SEVERITY_COLORS[severity.toUpperCase()] ?? DEFAULT_SEVERITY_COLOR;
}