import { create } from "zustand"

/**
 * Whether the bag drawer is showing.
 *
 * The drawer used to be opened only by the navbar button, so its state lived in
 * the navbar. Reserving dates on a product page has to open it too, and passing
 * a setter down through the page to the purchase panel would tie two unrelated
 * screens together — so the one boolean lives here, and anything that puts a
 * piece in the bag can bring the bag forward.
 *
 * Deliberately not persisted: a drawer that reopened itself on every reload
 * would be a bug, not a convenience.
 */
type CartUiState = {
  open: boolean
  /**
   * Where focus should go when the drawer closes.
   *
   * Normally the drawer can just remember whatever was focused when it opened,
   * but not here: "Reserve These Dates" disables itself while the request is in
   * flight, and a disabled button drops focus to the body before the response
   * arrives. The opener therefore hands over the element it was triggered from,
   * captured while it was still focusable. A live DOM node in a store is
   * unusual — it is safe because this store is never persisted or serialised.
   */
  returnFocusTo: HTMLElement | null
  openCart: (returnFocusTo?: HTMLElement | null) => void
  closeCart: () => void
  setCartOpen: (open: boolean) => void
}

export const useCartUiStore = create<CartUiState>((set) => ({
  open: false,
  returnFocusTo: null,

  openCart: (returnFocusTo) =>
    set({ open: true, returnFocusTo: returnFocusTo ?? null }),

  closeCart: () => set({ open: false }),

  /* Opening any other way (the navbar button) clears a stale trigger, so focus
     returns to what the person actually used. */
  setCartOpen: (open) => set(open ? { open, returnFocusTo: null } : { open }),
}))
