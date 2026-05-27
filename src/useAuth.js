/**
 * useAuth.js — Hook para manejar login/logout con Azure AD
 */
import { useState, useEffect, useCallback } from 'react'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { loginRequest } from './authConfig.js'

export function useAuth() {
  const { instance, accounts, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [profile, setProfile] = useState(null)

  // Cuando hay cuenta activa, extraer perfil
  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0]
      setProfile({
        nombre: account.name  || '',
        email:  (account.username || '').toLowerCase().trim(),
        // Azure devuelve el email en 'username' para cuentas organizacionales
      })
    } else {
      setProfile(null)
    }
  }, [accounts])

  const login = useCallback(async () => {
    try {
      await instance.loginPopup(loginRequest)
    } catch (e) {
      // Si el popup está bloqueado, intentar redirect
      if (e.errorCode === 'popup_window_error' || e.errorCode === 'empty_window_error') {
        await instance.loginRedirect(loginRequest)
      }
    }
  }, [instance])

  const logout = useCallback(() => {
    instance.logoutPopup({ postLogoutRedirectUri: window.location.href })
  }, [instance])

  const loading = inProgress !== InteractionStatus.None

  return { isAuthenticated, profile, login, logout, loading }
}
