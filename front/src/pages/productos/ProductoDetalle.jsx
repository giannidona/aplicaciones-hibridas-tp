import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { call } from '../../services/api.service'

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [producto, setProducto] = useState(null)
  const [brand, setBrand] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const esAdmin = usuario?.rol === 'admin'

  useEffect(() => {
    setCargando(true)
    call(`/products/${id}`)
      .then((data) => {
        setProducto(data)
        if (data.brandId) {
          return call(`/brands/${data.brandId}`).then(setBrand)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [id])

  const handleEliminar = async () => {
    if (!confirm('¿Seguro que querés borrar este producto?')) return
    try {
      await call(`/products/${id}`, 'DELETE')
      navigate('/productos')
    } catch (err) {
      alert(err.message)
    }
  }

  if (cargando) return <p className="p-8 text-center">Cargando...</p>
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>
  if (!producto) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/productos" className="text-sm text-[#a06cd5]">← Volver al catálogo</Link>

      <div className="mt-4 flex flex-wrap gap-8 rounded-xl bg-white p-6 shadow">
        <img
          src={producto.images?.[0]?.url || ''}
          alt={producto.name}
          className="w-72 max-w-full rounded-lg object-cover"
        />

        <div className="min-w-[250px] flex-1">
          {brand && (
            <p className="text-xs font-semibold uppercase text-[#a06cd5]">{brand.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-[#1f1a2e]">{producto.name}</h1>
          <p className="mt-3 text-gray-600">{producto.description}</p>
          <p className="mt-4 text-2xl font-bold">${producto.price}</p>
          <p className="mt-1 text-sm text-gray-500">Stock: {producto.stock}</p>

          {esAdmin && (
            <div className="mt-5 flex gap-3 text-sm">
              <Link
                to={`/editar-producto/${producto._id}`}
                className="rounded-lg bg-[#1f1a2e] px-4 py-2 text-white"
              >
                Editar
              </Link>
              <button
                onClick={handleEliminar}
                className="rounded-lg border border-red-600 px-4 py-2 text-red-600"
              >
                Borrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
