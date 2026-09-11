import React, { useState } from "react";
import { Home } from "lucide-react";

export default function TerminalKitty({
  children,
  path = "~",
  headerContent
}) {

  return (
    <div className="w-full h-full mx-auto flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-2xl font-mono text-sm bg-[var(--bg-color)]/60 backdrop-blur-xl">
      <div className="flex flex-row items-center justify-between gap-2 px-3 py-2 border-b border-white/5 select-none">
        
        <div className="flex items-center gap-2 shrink-0">
          <Home size={13} className="text-white/50 shrink-0" />
          <span className="text-white/40 text-xs">{path}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerContent}
        </div>

      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-gradient-to-b via-[var(--kitty)]/40 to-[var(--kitty)]/70 text-white/90">
        {children}
      </div>
    </div>
  );
}