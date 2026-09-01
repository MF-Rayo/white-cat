import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

const sectionsEn = [
    {
        heading: "English",
        body: "This service is currently protected. It has not reached the public testing phase yet, and access is restricted to prevent misuse.",
    }
]

const sectionsEs = [
    {
        heading: "Español",
        body: "Este servicio se encuentra protegido. Aún no está en fase de pruebas públicas y el acceso está restringido para evitar un mal uso.",
    }
]


export default function Bash() {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();
    
    const res = await login(username, password);
    if (!res.ok) {
      showAlert({ type: "warning", message: res.error });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">

      <div className="mb-1 text-xs pb-2 select-none">
        <span className="text-(--primary-color) text-sm font-bold">$whitecat@debian: </span>
        <span className="text-(--text-color) text-sm">cat readme.md</span>
      </div>
      <div className="mb-4 text-xs pb-2 select-none">
        <div className="space-y-3">
            {sectionsEn.map((s, i) => (
                <p key={i} className="text-(--text-secondary) leading-relaxed text-sm">
                <strong className="text-(--text-secondary) text-sm">{s.heading}:</strong> {s.body}
                </p>
            ))}
        </div>
        <div className="space-y-3">
            {sectionsEs.map((s, i) => (
                <p key={i} className="text-(--text-secondary) leading-relaxed text-sm">
                <strong className="text-(--text-secondary) text-sm">{s.heading}:</strong> {s.body}
                </p>
            ))}
        </div>
      </div>
      
      <div className="mb-2 text-xs pb-2 select-none">
        <span className="text-(--primary-color) text-sm font-bold">$whitecat@debian: </span>
        <span className="text-(--text-color) text-sm">./login.sh</span>
      </div>

      <div className="mb-0">
        <div className="flex items-center gap-2">
          <span className="text-(--primary-color) font-bold select-none">username:</span>
          <input type="text" placeholder="root" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-0 rounded px-2 py-1 text-(--text-color) focus:outline-none transition-all text-sm"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-(--primary-color) font-bold select-none">password:</span>
          <input type="password" placeholder="••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-0 rounded px-2 py-1 text-(--text-color) focus:outline-none transition-all text-sm"
            autoComplete="off"
          />
        </div>
      </div>

      <button type="submit"></button>
    </form>
  );
}