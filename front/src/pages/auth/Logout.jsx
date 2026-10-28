import { Navigate } from 'react-router'

export default function Logout() {
  localStorage.removeItem('usuario')
  return <Navigate to="/login" />
}
