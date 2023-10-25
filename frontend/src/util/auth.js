import { redirect } from 'react-router-dom'

export const getTokenDuration = () => {
  const expirationStored = localStorage.getItem('expiration')
  const expiration = new Date(expirationStored)
  const now = new Date()
  const expiresIn = expiration.getTime() - now.getTime()
  return expiresIn
}
export const getAuthToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }
  const tokenDuration = getTokenDuration()
  if (tokenDuration <= 0) {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    return 'EXPIRED'
  }
  return localStorage.getItem('token')
}

export const loader = () => {
  return getAuthToken()
}

export const checkAuthLoader = () => {
  const token = getAuthToken()
  if (!token) {
    return redirect('/auth?mode=login')
  }
  return null
}
