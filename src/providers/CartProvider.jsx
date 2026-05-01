import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { addCartItem, fetchCartItems, removeCartItem, updateCartItemQuantity } from '../api/cartApi.js'
import { useAuthSession } from './AuthSessionProvider.jsx'

const CartContext = createContext(null)
const GUEST_CART_KEY = 'artisan-nut-cart'

function readGuestCart() {
  try {
    return JSON.parse(window.localStorage.getItem(GUEST_CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeGuestCart(items) {
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

function toGuestCartItem(product, quantity, variant) {
  const productId = product.id
  const itemVariant = variant ?? '250g'

  return {
    id: `${productId}:${itemVariant}`,
    productId,
    name: product.name,
    variant: itemVariant,
    price: Number(product.price ?? 0),
    quantity,
    image: product.image,
    product,
  }
}

export function CartProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuthSession()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const previousUserId = useRef(null)

  const loadCart = useCallback(async () => {
    if (isAuthLoading) return

    setIsLoading(true)
    setError('')

    try {
      if (user?.id) {
        const accountItems = await fetchCartItems(user.id)
        setItems(accountItems)
      } else {
        setItems(readGuestCart())
      }
    } catch (cartError) {
      setError(cartError.message)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthLoading, user?.id])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  useEffect(() => {
    if (isAuthLoading) return

    const nextUserId = user?.id ?? null
    const wasGuest = !previousUserId.current

    if (nextUserId && wasGuest) {
      const guestItems = readGuestCart()

      if (guestItems.length > 0) {
        setIsLoading(true)
        Promise.all(
          guestItems.map((item) =>
            addCartItem(nextUserId, item.productId, item.quantity, item.variant),
          ),
        )
          .then(() => {
            writeGuestCart([])
            return fetchCartItems(nextUserId)
          })
          .then(setItems)
          .catch((cartError) => setError(cartError.message))
          .finally(() => setIsLoading(false))
      }
    }

    previousUserId.current = nextUserId
  }, [isAuthLoading, user?.id])

  const updateGuestItems = useCallback((updater) => {
    setItems((currentItems) => {
      const nextItems = updater(currentItems)
      writeGuestCart(nextItems)
      return nextItems
    })
  }, [])

  const addToCart = useCallback(async (product, quantity = 1, variant = '250g') => {
    setError('')

    try {
      if (user?.id) {
        const updatedItem = await addCartItem(user.id, product.id, quantity, variant)
        setItems((currentItems) => {
          const exists = currentItems.some((item) => item.id === updatedItem.id)
          return exists
            ? currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            : [updatedItem, ...currentItems]
        })
        return updatedItem
      }

      const guestItem = toGuestCartItem(product, quantity, variant)
      updateGuestItems((currentItems) => {
        const exists = currentItems.some((item) => item.id === guestItem.id)
        return exists
          ? currentItems.map((item) => (
              item.id === guestItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ))
          : [guestItem, ...currentItems]
      })

      return guestItem
    } catch (cartError) {
      setError(cartError.message)
      throw cartError
    }
  }, [updateGuestItems, user?.id])

  const setItemQuantity = useCallback(async (itemId, quantity) => {
    const nextQuantity = Math.max(1, quantity)
    setError('')

    try {
      if (user?.id) {
        const updatedItem = await updateCartItemQuantity(itemId, nextQuantity)
        setItems((currentItems) => currentItems.map((item) => (item.id === itemId ? updatedItem : item)))
        return
      }

      updateGuestItems((currentItems) => currentItems.map((item) => (
        item.id === itemId ? { ...item, quantity: nextQuantity } : item
      )))
    } catch (cartError) {
      setError(cartError.message)
      throw cartError
    }
  }, [updateGuestItems, user?.id])

  const removeFromCart = useCallback(async (itemId) => {
    setError('')

    try {
      if (user?.id) {
        await removeCartItem(itemId)
        setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
        return
      }

      updateGuestItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
    } catch (cartError) {
      setError(cartError.message)
      throw cartError
    }
  }, [updateGuestItems, user?.id])

  const clearCart = useCallback(async () => {
    setError('')

    try {
      if (user?.id) {
        await Promise.all(items.map((item) => removeCartItem(item.id)))
        setItems([])
        return
      }

      writeGuestCart([])
      setItems([])
    } catch (cartError) {
      setError(cartError.message)
      throw cartError
    }
  }, [items, user?.id])

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      items,
      itemCount,
      subtotal,
      isLoading,
      error,
      addToCart,
      setItemQuantity,
      removeFromCart,
      clearCart,
      refreshCart: loadCart,
    }
  }, [addToCart, clearCart, error, isLoading, items, loadCart, removeFromCart, setItemQuantity])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.')
  }

  return context
}
