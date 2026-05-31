import { create } from 'zustand'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem:    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, color?: string, length?: string) => void
  updateQty:  (productId: string, quantity: number, color?: string, length?: string) => void
  clearCart:  () => void
  itemCount:  () => number
  total:      () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: ({ product, quantity = 1, selectedColor, selectedLength }) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id &&
               i.selectedColor  === selectedColor &&
               i.selectedLength === selectedLength
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + quantity } : i
          ),
        }
      }
      return { items: [...state.items, { product, quantity, selectedColor, selectedLength }] }
    })
  },

  removeItem: (productId, color, length) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.id === productId && i.selectedColor === color && i.selectedLength === length)
      ),
    }))
  },

  updateQty: (productId, quantity, color, length) => {
    if (quantity <= 0) {
      get().removeItem(productId, color, length)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId &&
        i.selectedColor === color &&
        i.selectedLength === length
          ? { ...i, quantity }
          : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}))
