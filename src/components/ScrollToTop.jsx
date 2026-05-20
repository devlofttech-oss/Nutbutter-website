import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior

    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    root.style.scrollBehavior = previousScrollBehavior
  }, [pathname, search])

  return null
}
