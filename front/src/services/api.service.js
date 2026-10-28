const BASE_URL = "http://localhost:3333/api";

export function call(uri, method = "GET", body) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return fetch(BASE_URL + uri, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error en la petición");
    return data;
  });
}
