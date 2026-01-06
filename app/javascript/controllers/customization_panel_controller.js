import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    dishId: Number,
    ingredientId: Number
  }
  static targets = [
    "panel",
    "item",
    "quantityDisplay",
    "priceDisplay",
    "adjustments",
    "adjustmentsValue",
    "totalValue"
  ]

  connect() {
    this.customizations = {}
    this.debounceTimer = null
  }

  openPanel(event) {
    const ingredientId = event.currentTarget.dataset.customizationPanelIngredientIdValue || this.ingredientIdValue
    
    fetch(`/dishes/${this.dishIdValue}/customization_panel`)
      .then(response => response.text())
      .then(html => {
        const frame = this.panelTarget.querySelector('turbo-frame')
        if (frame) {
          frame.innerHTML = html
        }
        this.panelTarget.classList.add('active')
      })
      .catch(err => console.error('Failed to load customization panel:', err))
  }

  closePanel() {
    this.panelTarget.classList.remove('active')
  }

  updateQuantity(event) {
    const ingredientId = event.currentTarget.dataset.customizationPanelIngredientIdValue
    const delta = parseInt(event.currentTarget.dataset.delta)

    if (!this.customizations[ingredientId]) {
      this.customizations[ingredientId] = { quantity: 1 }
    }

    this.customizations[ingredientId].quantity = Math.max(0, 
      (this.customizations[ingredientId].quantity || 1) + delta
    )

    this.updateQuantityDisplay(ingredientId)
    this.calculatePrice()
  }

  updateQuantityDisplay(ingredientId) {
    const display = this.quantityDisplayTargets.find(
      el => el.dataset.ingredientId === ingredientId.toString()
    )
    if (display) {
      display.textContent = this.customizations[ingredientId].quantity
    }
  }

  selectSubstitution(event) {
    const ingredientId = event.currentTarget.dataset.customizationPanelIngredientIdValue
    const substitutionId = event.currentTarget.value

    if (!this.customizations[ingredientId]) {
      this.customizations[ingredientId] = {}
    }

    if (substitutionId) {
      this.customizations[ingredientId].substitution_id = substitutionId
    } else {
      delete this.customizations[ingredientId].substitution_id
    }

    this.calculatePrice()
  }

  calculatePrice() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      fetch(`/api/dishes/${this.dishIdValue}/calculate_price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          customizations: this.customizations
        })
      })
      .then(response => response.json())
      .then(data => {
        this.updatePriceDisplay(data)
      })
      .catch(err => console.error('Failed to calculate price:', err))
    }, 300)
  }

  updatePriceDisplay(priceData) {
    if (this.hasTotalValueTarget) {
      this.totalValueTarget.textContent = `$${priceData.total.toFixed(2)}`
    }

    if (priceData.adjustments !== 0 && this.hasAdjustmentsTarget) {
      this.adjustmentsTarget.style.display = 'block'
      if (this.hasAdjustmentsValueTarget) {
        this.adjustmentsValueTarget.textContent = 
          `${priceData.adjustments >= 0 ? '+' : ''}$${priceData.adjustments.toFixed(2)}`
      }
    } else if (this.hasAdjustmentsTarget) {
      this.adjustmentsTarget.style.display = 'none'
    }
  }

  resetToDefault() {
    this.customizations = {}
    this.calculatePrice()
    // Reset quantity displays
    this.quantityDisplayTargets.forEach(display => {
      const ingredientId = display.dataset.ingredientId
      // Would need to get default from server or store in data attribute
    })
  }

  applyChanges() {
    // Store customizations in controller state
    // Update hotspot badges
    const hotspots = document.querySelectorAll('[data-hotspot-ingredient-id-value]')
    hotspots.forEach(hotspot => {
      const ingredientId = hotspot.dataset.hotspotIngredientIdValue
      if (this.customizations[ingredientId]) {
        hotspot.classList.add('modified')
      }
    })
    
    this.closePanel()
  }

  addExtra(event) {
    const ingredientId = event.currentTarget.dataset.customizationPanelIngredientIdValue
    this.openPanel(event)
    // Auto-increment quantity when adding extra
    setTimeout(() => {
      const plusBtn = this.panelTarget.querySelector(
        `[data-customization-panel-ingredient-id-value="${ingredientId}"][data-delta="1"]`
      )
      if (plusBtn) {
        plusBtn.click()
      }
    }, 100)
  }
}

