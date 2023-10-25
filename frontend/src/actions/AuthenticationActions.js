import { json, redirect } from 'react-router-dom'

export const action = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  console.log('Mode:', searchParams.get('mode'))
  const mode = searchParams.get('mode') || 'login'

  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Invalid mode' }, { status: 422 })
  }

  const data = await request.formData()
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  }

  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST',
    body: JSON.stringify(authData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.status === 422 || response.status === 401) {
    return response
  }
  if (!response.ok) {
    throw json({ message: 'Could not authenticate user.' }, { status: 500 })
  }

  const resData = await response.json()
  const token = resData.token

  localStorage.setItem('token', token)
  const expiration = new Date(new Date().getTime() + 60 * 60 * 1000)
  localStorage.setItem('expiration', expiration.toISOString())

  return redirect('/')
}

export const logoutAction = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('expiration')
  return redirect('/')
}
