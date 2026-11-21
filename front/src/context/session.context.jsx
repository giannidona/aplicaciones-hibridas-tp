import { createContext, useContext, useState } from "react";

export const SessionContext = createContext();

// Hook base: da acceso a todo el contexto de sesión.
export function useSession() {
  return useContext(SessionContext);
}

// Hooks derivados: cada componente pide solo lo que necesita,
// en vez de desestructurar el contexto completo cada vez.
export function useUsuario() {
  const { usuario } = useSession();
  return usuario;
}

export function useLogin() {
  const { login } = useSession();
  return login;
}

export function useLogout() {
  const { logout } = useSession();
  return logout;
}

// Lee la sesión guardada en localStorage al cargar la app (F5, nueva pestaña, etc).
// Si no hay nada o está corrupto, arranca sin sesión en vez de romper la app.
const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
};

export function SessionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  const login = (datos) => {
    setUsuario(datos);
    localStorage.setItem("usuario", JSON.stringify(datos));
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <SessionContext.Provider value={{ usuario, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
