import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyData({ data, onCopied }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(data ?? ""));
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy"}
      className="inline-flex items-center hover:text-(--primary-color) cursor-pointer bg-transparent border-0 p-0"
    >
      <Icon width={14} className={copied ? "text-(--success-color)" : undefined} />
    </button>
  );
}