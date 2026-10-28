import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { call } from '../../services/api.service'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const esAdmin = usuario?.rol === 'admin'

  useEffect(() => {
    call('/products')
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés borrar este producto?')) return

    try {
      await call(`/products/${id}`, 'DELETE')
      setProductos((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (cargando) return <p className="p-8 text-center">Cargando productos...</p>
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-[#1f1a2e]">Productos</h1>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {productos.map((p) => (
          <div key={p._id} className="overflow-hidden rounded-xl bg-white shadow">
            <Link to={`/productos/${p._id}`}>
              <img
                src={p.images?.[0]?.url || ''}
                alt={p.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium">{p.name}</h3>
                <p className="font-bold text-[#1f1a2e]">${p.price}</p>
              </div>
            </Link>

            {esAdmin && (
              <div className="flex gap-2 border-t p-2 text-xs">
                <Link to={`/editar-producto/${p._id}`} className="text-[#a06cd5]">Editar</Link>
                <button onClick={() => handleEliminar(p._id)} className="text-red-600">Borrar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
