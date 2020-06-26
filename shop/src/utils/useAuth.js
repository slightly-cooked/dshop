import { useEffect, useState } from 'react'
import { useStateValue } from 'data/state'
import _get from 'lodash/get'
import useBackendApi from 'utils/useBackendApi'

function useAuth(opts = {}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [{ auth, reload }, dispatch] = useStateValue()
  const { get, post } = useBackendApi()

  useEffect(() => {
    async function fetchAuth() {
      setLoading(true)

      get('/auth', { suppressError: true })
        .then((auth) => {
          dispatch({ type: 'setAuth', auth })
          if (_get(auth, 'success')) {
            localStorage.isAdmin = true
          }
          setLoading(false)
        })
        .catch(() => {
          setError(true)
        })
    }
    if (!auth && (opts.only === undefined || opts.only)) {
      fetchAuth()
    }
  }, [reload.auth])

  function logout() {
    localStorage.clear()
    post(`/auth/logout`).then(() => {
      dispatch({ type: 'logout' })
    })
  }

  return { auth, loading, error, logout }
}

export default useAuth
