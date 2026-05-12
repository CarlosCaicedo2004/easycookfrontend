const BASE_URL = 'http://localhost:3000'

// ─── helpers ────────────────────────────────────────────────
const getToken = () => localStorage.getItem('token')

const headers = (auth = false) => {
  const h = { 'Content-Type': 'application/json' }
  if (auth) h['Authorization'] = `Bearer ${getToken()}`
  return h
}

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud')
  return data
}

// ─── AUTH ────────────────────────────────────────────────────
export const apiLogin = (email, password) =>
  fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  }).then(handle)

export const apiRegistrar = (nombre, email, password) =>
  fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ nombre, email, password }),
  }).then(handle)

export const apiLogout = (userId) =>
  fetch(`${BASE_URL}/usuarios/logout`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ userId }),
  }).then(handle)

export const apiCambiarPassword = (email, password, newPassword) =>
  fetch(`${BASE_URL}/usuarios/change-password`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ email, password, newPassword }),
  }).then(handle)

// ─── USUARIOS ────────────────────────────────────────────────
export const apiGetHistorial = (userId) =>
  fetch(`${BASE_URL}/usuarios/${userId}/historial`, {
    headers: headers(true),
  }).then(handle)

export const apiGetUsuario = (id) =>
  fetch(`${BASE_URL}/usuarios/${id}`, {
    headers: headers(true),
  }).then(handle)

// ─── RECETAS ─────────────────────────────────────────────────
export const apiGetRecetas = () =>
  fetch(`${BASE_URL}/recetas`).then(handle)

export const apiGetReceta = (id, userId = null) => {
  const url = userId
    ? `${BASE_URL}/recetas/${id}?userId=${userId}`
    : `${BASE_URL}/recetas/${id}`
  return fetch(url, { headers: headers(true) }).then(handle)
}

export const apiCrearReceta = (data) =>
  fetch(`${BASE_URL}/recetas`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(data),
  }).then(handle)

export const apiEliminarReceta = (id) =>
  fetch(`${BASE_URL}/recetas/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  }).then(handle)

export const apiBuscarPorIngrediente = (ing) =>
  fetch(`${BASE_URL}/recetas/ingrediente/${ing}`).then(handle)

export const apiBuscarPorTiempo = (tiempo) =>
  fetch(`${BASE_URL}/recetas/tiempo/${tiempo}`).then(handle)

export const apiBuscarPorTipo = (tipo) =>
  fetch(`${BASE_URL}/recetas/tipo/${tipo}`).then(handle)

export const apiGetRecomendadas = (tipo, ingrediente) => {
  const params = new URLSearchParams()
  if (tipo) params.append('tipo', tipo)
  if (ingrediente) params.append('ingrediente', ingrediente)
  return fetch(`${BASE_URL}/recetas/recomendadas/filtro?${params}`).then(handle)
}

// ─── VALORACIONES ────────────────────────────────────────────
export const apiGetValoraciones = () =>
  fetch(`${BASE_URL}/valoraciones`).then(handle)

export const apiGetValoracionesPorReceta = (recetaId) =>
  fetch(`${BASE_URL}/valoraciones/receta/${recetaId}`).then(handle)

export const apiCrearValoracion = (receta_id, puntuacion, comentario) =>
  fetch(`${BASE_URL}/valoraciones`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ receta_id, puntuacion, comentario }),
  }).then(handle)

export const apiEliminarValoracion = (id) =>
  fetch(`${BASE_URL}/valoraciones/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  }).then(handle)
