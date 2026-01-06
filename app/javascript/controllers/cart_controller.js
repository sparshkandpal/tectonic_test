import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    dishId: Number,
    cartItemId: Number
  }
  static targets = ["badge"]

  connect() {
    this.updateCartCount()
    this.lastAddedItemId = null
    this.undoTimer = null
  }

  addToCart(event) {
    event.preventDefault()
    console.log('Add to cart clicked, dishId:', this.dishIdValue)
    const customizations = this.getCustomizations()
    console.log('Customizations:', customizations)
    
    fetch('/cart_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        dish_id: this.dishIdValue,
        customizations: customizations,
        quantity: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showSuccessToast(data.cart_item.id)
        this.updateCartCount(data.count)
        this.lastAddedItemId = data.cart_item.id
        this.setupUndo()
      }
    })
    .catch(err => console.error('Failed to add to cart:', err))
  }

  removeFromCart() {
    fetch(`/cart_items/${this.cartItemIdValue}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.updateCartCount(data.count)
      }
    })
    .catch(err => console.error('Failed to remove from cart:', err))
  }

  clearCart() {
    fetch('/cart_items/clear', {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.updateCartCount(0)
      }
    })
    .catch(err => console.error('Failed to clear cart:', err))
  }

  undo() {
    if (this.lastAddedItemId) {
      this.cartItemIdValue = this.lastAddedItemId
      this.removeFromCart()
      this.lastAddedItemId = null
      if (this.undoTimer) {
        clearTimeout(this.undoTimer)
      }
    }
  }

  updateCartCount(count) {
    fetch('/cart_items/count')
      .then(response => response.json())
      .then(data => {
        if (this.hasBadgeTarget) {
          this.badgeTarget.textContent = data.count || count || 0
        }
      })
      .catch(() => {
        if (this.hasBadgeTarget && count !== undefined) {
          this.badgeTarget.textContent = count
        }
      })
  }

  getCustomizations() {
    // Get customizations from customization panel controller
    const panel = document.querySelector('[data-controller*="customization-panel"]')
    if (panel) {
      const panelController = this.application.getControllerForElementAndIdentifier(panel, 'customization-panel')
      return panelController ? panelController.customizations : {}
    }
    return {}
  }

  showSuccessToast(cartItemId) {
    const toast = document.createElement('div')
    toast.className = 'toast success'
    toast.innerHTML = `
      <span>Added to cart</span>
      <button data-action="click->cart#undo" class="undo-btn">Undo</button>
    `
    toast.setAttribute('data-controller', 'cart')
    toast.setAttribute('data-cart-cart-item-id-value', cartItemId)
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)

    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  setupUndo() {
    if (this.undoTimer) {
      clearTimeout(this.undoTimer)
    }
    this.undoTimer = setTimeout(() => {
      this.lastAddedItemId = null
    }, 5000)
  }

  closeCart() {
    // Close cart sidebar if implemented
    const sidebar = document.querySelector('.cart-sidebar')
    if (sidebar) {
      sidebar.classList.remove('active')
    }
  }
}

