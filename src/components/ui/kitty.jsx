import React, { useState } from "react";
import { Home } from "lucide-react";

export default function TerminalKitty({
  children,
  path = "~",
  headerContent
}) {

  return (
    <div className="w-full h-full mx-auto flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-2xl font-mono text-sm bg-(--bg-color)/60 backdrop-blur-xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2 border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
              <Home size={13} className="text-white/50" />
              <span className="text-white/40 text-xs">{path}</span>
              <span className="w-2px h-3.5 bg-(--primary-color)-400 animate-pulse ml-0.5" />
          </div>

          <div className="hidden sm:flex flex-1" />

          <div className="flex flex-wrap items-center gap-2">
              {headerContent}
          </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-linear-to-b via-(--kitty)/40 to-(--kitty)/70 text-white/90 ">
        {children}
      </div>

    </div>
  );
}