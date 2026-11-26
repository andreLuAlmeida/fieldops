import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useFlashSuccess() {
  const location = useLocation()
  const navigate = useNavigate()

  const [message] = useState<string>(
    location.state?.success ?? '',
  )

  useEffect(() => {
    if (location.state?.success) {
      const state = { ...location.state }

      delete state.success

      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        {
          replace: true,
          state,
        },
      )
    }
  }, [location, navigate])

  return message
}
