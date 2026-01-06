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
    "totalValue",
    "modificationsInfo",
    "modificationsCount",
    "modificationsPrice"
  ]

  connect() {
    console.log('Customization panel controller connected!', {
      dishId: this.dishIdValue,
      hasDishIdValue: this.hasDishIdValue,
      element: this.element,
      panelTarget: this.hasPanelTarget ? this.panelTarget : null
    }) // Debug log
    
    // Load customizations from sessionStorage to persist across media navigation
    if (this.hasDishIdValue) {
      const stored = sessionStorage.getItem(`customizations_${this.dishIdValue}`)
      this.customizations = stored ? JSON.parse(stored) : {}
    } else {
      this.customizations = {}
    }
    this.debounceTimer = null
    // Restore visual indicators
    if (this.hasDishIdValue) {
      this.updateHotspotIndicators()
    }
    
    // Listen for open panel events from buttons
    const openHandler = (e) => {
      console.log('Received customization-panel:open event', e.detail) // Debug log
      const dishId = e.detail?.dishId || this.dishIdValue
      console.log('Opening panel for dishId:', dishId) // Debug log
      if (dishId) {
        this.openPanel(null, dishId)
      } else {
        console.error('No dishId provided in event or controller')
      }
    }
    
    document.addEventListener('customization-panel:open', openHandler)
    console.log('Registered customization-panel:open event listener') // Debug log
    
    // Listen for add extra events
    const addExtraHandler = (e) => {
      console.log('Received customization-panel:addExtra event', e.detail) // Debug log
      const dishId = e.detail?.dishId || this.dishIdValue
      const ingredientId = e.detail?.ingredientId
      if (dishId) {
        this.addExtra(null, dishId, ingredientId)
      }
    }
    
    document.addEventListener('customization-panel:addExtra', addExtraHandler)
    console.log('Registered customization-panel:addExtra event listener') // Debug log
    
    // Store handlers for cleanup
    this._openHandler = openHandler
    this._addExtraHandler = addExtraHandler
  }
  
  disconnect() {
    if (this._openHandler) {
      document.removeEventListener('customization-panel:open', this._openHandler)
    }
    if (this._addExtraHandler) {
      document.removeEventListener('customization-panel:addExtra', this._addExtraHandler)
    }
  }

  openPanel(event, dishIdOverride) {
    console.log('🔵 openPanel called', { event, dishIdOverride, currentDishId: this.dishIdValue })
    
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    // Get dish ID from button, override, or controller
    const dishId = dishIdOverride || event?.currentTarget?.dataset?.customizationPanelDishIdValue || this.dishIdValue
    console.log('🔵 Resolved dishId:', dishId)
    
    if (!dishId) {
      console.error('❌ No dish ID found for customization panel')
      alert('No dish ID found. Please ensure the story has a dish associated.')
      return
    }
    
    // Find the panel element
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    console.log('🔵 Found panel element:', panel)
    
    if (!panel) {
      console.error('❌ Customization panel not found in DOM')
      alert('Customization panel element not found in DOM. Please refresh the page.')
      return
    }
    
    // Update dish ID if needed
    const dishIdNum = parseInt(dishId)
    if (this.hasDishIdValue && this.dishIdValue !== dishIdNum) {
      this.dishIdValue = dishIdNum
    } else if (!this.hasDishIdValue) {
      this.dishIdValue = dishIdNum
    }
    
    console.log('🔵 Opening customization panel for dish:', this.dishIdValue)
    console.log('🔵 Fetching from URL:', `/dishes/${this.dishIdValue}/customization_panel`)
    
    fetch(`/dishes/${this.dishIdValue}/customization_panel`)
      .then(response => {
        console.log('🔵 Fetch response:', response.status, response.ok)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then(html => {
        console.log('🔵 Received HTML, length:', html.length)
        const frame = panel.querySelector('turbo-frame')
        console.log('🔵 Found turbo-frame:', frame)
        if (frame) {
          frame.innerHTML = html
          // Restore customizations from sessionStorage after a short delay to ensure DOM is ready
          setTimeout(() => {
            this.restoreCustomizations()
          }, 100)
        }
        panel.classList.add('active')
        console.log('✅ Customization panel opened and active class added')
      })
      .catch(err => {
        console.error('❌ Failed to load customization panel:', err)
        alert(`Failed to load customization panel: ${err.message}. Please check the console for details.`)
      })
  }

  restoreCustomizations() {
    // Get the panel element
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (!panel) return
    
    // Restore quantity displays from customizations
    const quantityDisplays = panel.querySelectorAll('[data-customization-panel-target="quantityDisplay"]')
    quantityDisplays.forEach(display => {
      const ingredientId = display.dataset.ingredientId
      if (this.customizations[ingredientId] && this.customizations[ingredientId].quantity !== undefined) {
        this.updateQuantityDisplay(ingredientId)
      }
    })
    
    // Update price display
    this.calculatePrice().then(() => {
      this.updateModificationsInfo()
    })
    // Update hotspot indicators
    this.updateHotspotIndicators()
  }

  closePanel() {
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (panel) {
      panel.classList.remove('active')
    }
  }

  updateQuantity(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const ingredientId = event?.currentTarget?.dataset?.customizationPanelIngredientIdValue
    if (!ingredientId) return
    
    const delta = parseFloat(event?.currentTarget?.dataset?.delta || 0)
    
    // Find display element
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (!panel) return
    
    const display = panel.querySelector(`[data-customization-panel-target="quantityDisplay"][data-ingredient-id="${ingredientId}"]`)
    if (!display) return
    
    const defaultQuantity = parseFloat(display.dataset.defaultQuantity || 1)

    if (!this.customizations[ingredientId]) {
      this.customizations[ingredientId] = { quantity: defaultQuantity }
    }

    this.customizations[ingredientId].quantity = Math.max(0, 
      (this.customizations[ingredientId].quantity || defaultQuantity) + delta
    )

    // Remove from customizations if quantity is 0
    if (this.customizations[ingredientId].quantity === 0) {
      delete this.customizations[ingredientId]
    }

    this.updateQuantityDisplay(ingredientId)
    this.saveCustomizations()
    this.calculatePrice().then(() => {
      this.updateModificationsInfo()
    })
  }

  removeIngredient(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const ingredientId = event?.currentTarget?.dataset?.customizationPanelIngredientIdValue
    if (!ingredientId) return
    
    // Get the panel to find default quantity
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (panel) {
      const display = panel.querySelector(`[data-customization-panel-target="quantityDisplay"][data-ingredient-id="${ingredientId}"]`)
      if (display) {
        const defaultQuantity = parseFloat(display.dataset.defaultQuantity || 1)
        // Set quantity to 0 (which will remove it)
        this.customizations[ingredientId] = { quantity: 0 }
        // Update display
        this.updateQuantityDisplay(ingredientId)
        // Remove from customizations
        delete this.customizations[ingredientId]
      }
    } else {
      delete this.customizations[ingredientId]
    }
    
    this.saveCustomizations()
    this.calculatePrice().then(() => {
      this.updateModificationsInfo()
    })
    this.updateHotspotIndicators()
  }

  updateQuantityDisplay(ingredientId) {
    // Find display element - check both panel target and document
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (!panel) return
    
    const display = panel.querySelector(`[data-customization-panel-target="quantityDisplay"][data-ingredient-id="${ingredientId}"]`)
    if (display) {
      const defaultQuantity = parseFloat(display.dataset.defaultQuantity || 1)
      const quantityUnit = display.dataset.quantityUnit || 'units'
      const currentQuantity = this.customizations[ingredientId]?.quantity !== undefined 
        ? this.customizations[ingredientId].quantity 
        : defaultQuantity
      display.textContent = `${currentQuantity.toFixed(1)} ${quantityUnit}`
      
      // Add visual indicator if modified
      const item = display.closest('.customization-item')
      if (item) {
        if (this.customizations[ingredientId] && this.customizations[ingredientId].quantity !== undefined && this.customizations[ingredientId].quantity !== defaultQuantity) {
          item.classList.add('modified')
        } else {
          item.classList.remove('modified')
        }
      }
    }
  }

  selectSubstitution(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const ingredientId = event?.currentTarget?.dataset?.customizationPanelIngredientIdValue
    if (!ingredientId) return
    
    const substitutionId = event?.currentTarget?.value

    if (!this.customizations[ingredientId]) {
      this.customizations[ingredientId] = {}
    }

    if (substitutionId) {
      this.customizations[ingredientId].substitution_id = substitutionId
    } else {
      delete this.customizations[ingredientId].substitution_id
      // Remove from customizations if no other changes
      if (!this.customizations[ingredientId].quantity) {
        delete this.customizations[ingredientId]
      }
    }

    this.saveCustomizations()
    this.calculatePrice().then(() => {
      this.updateModificationsInfo()
    })
    this.updateHotspotIndicators()
  }

  calculatePrice() {
    return new Promise((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = setTimeout(() => {
        console.log('Calculating price with customizations:', this.customizations) // Debug log
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
        .then(response => {
          console.log('Price calculation response status:', response.status) // Debug log
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          console.log('Price calculation result:', data) // Debug log
          this.updatePriceDisplay(data)
          resolve(data)
        })
        .catch(err => {
          console.error('Failed to calculate price:', err)
          resolve(null)
        })
      }, 200) // Reduced debounce time for faster updates
    })
  }

  updatePriceDisplay(priceData) {
    if (!priceData) {
      console.warn('No price data provided to updatePriceDisplay') // Debug log
      return
    }
    
    console.log('Updating price display with:', priceData) // Debug log
    
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (!panel) {
      console.error('Panel not found for price display update') // Debug log
      return
    }
    
    const totalValue = panel.querySelector('[data-customization-panel-target="totalValue"]')
    if (totalValue) {
      totalValue.textContent = `$${priceData.total.toFixed(2)}`
      console.log('Updated total value:', totalValue.textContent) // Debug log
    } else {
      console.warn('Total value element not found') // Debug log
    }

    const adjustments = panel.querySelector('[data-customization-panel-target="adjustments"]')
    const adjustmentsValue = panel.querySelector('[data-customization-panel-target="adjustmentsValue"]')
    
    if (priceData.adjustments !== 0 && adjustments) {
      adjustments.style.display = 'block'
      if (adjustmentsValue) {
        adjustmentsValue.textContent = 
          `${priceData.adjustments >= 0 ? '+' : ''}$${priceData.adjustments.toFixed(2)}`
        console.log('Updated adjustments value:', adjustmentsValue.textContent) // Debug log
      }
    } else if (adjustments) {
      adjustments.style.display = 'none'
    }
  }

  resetToDefault() {
    this.customizations = {}
    this.saveCustomizations()
    
    // Reset quantity displays to defaults
    const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
    if (panel) {
      const displays = panel.querySelectorAll('[data-customization-panel-target="quantityDisplay"]')
      displays.forEach(display => {
        const defaultQuantity = parseFloat(display.dataset.defaultQuantity || 1)
        const quantityUnit = display.dataset.quantityUnit || 'units'
        display.textContent = `${defaultQuantity.toFixed(1)} ${quantityUnit}`
        const item = display.closest('.customization-item')
        if (item) {
          item.classList.remove('modified')
        }
      })
    }
    
    this.calculatePrice().then(() => {
      this.updateModificationsInfo()
    })
    this.updateHotspotIndicators()
  }

  applyChanges() {
    console.log('Applying changes, customizations:', this.customizations) // Debug log
    // Save customizations to sessionStorage
    this.saveCustomizations()
    // Update hotspot badges
    this.updateHotspotIndicators()
    // Update modifications info
    this.updateModificationsInfo()
    // Close panel
    this.closePanel()
  }

  saveCustomizations() {
    // Save to sessionStorage to persist across media navigation
    if (this.hasDishIdValue) {
      sessionStorage.setItem(`customizations_${this.dishIdValue}`, JSON.stringify(this.customizations))
    }
  }

  updateHotspotIndicators() {
    // Update visual indicators on all hotspots
    const hotspots = document.querySelectorAll('[data-hotspot-ingredient-id-value]')
    hotspots.forEach(hotspot => {
      const ingredientId = hotspot.dataset.hotspotIngredientIdValue
      if (this.customizations[ingredientId] && 
          (this.customizations[ingredientId].quantity !== undefined || 
           this.customizations[ingredientId].substitution_id)) {
        hotspot.classList.add('modified')
      } else {
        hotspot.classList.remove('modified')
      }
    })
  }

  updateModificationsInfo() {
    const modificationsCount = Object.keys(this.customizations).filter(
      key => this.customizations[key] && 
      (this.customizations[key].quantity !== undefined || this.customizations[key].substitution_id)
    ).length

    // Find modifications info in bottom action bar (not in panel)
    const modificationsInfo = document.querySelector('[data-customization-panel-target="modificationsInfo"]')
    const modificationsCountEl = document.querySelector('[data-customization-panel-target="modificationsCount"]')
    const modificationsPriceEl = document.querySelector('[data-customization-panel-target="modificationsPrice"]')

    if (modificationsCount > 0 && modificationsInfo) {
      modificationsInfo.style.display = 'block'
      if (modificationsCountEl) {
        modificationsCountEl.textContent = modificationsCount
      }
      // Calculate price difference
      this.calculatePrice().then(priceData => {
        if (modificationsPriceEl && priceData) {
          modificationsPriceEl.textContent = `$${priceData.total.toFixed(2)}`
        }
      })
    } else if (modificationsInfo) {
      modificationsInfo.style.display = 'none'
    }
  }

  addExtra(event, dishIdOverride, ingredientIdOverride) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const dishId = dishIdOverride || event?.currentTarget?.dataset?.customizationPanelDishIdValue || this.dishIdValue
    const ingredientId = ingredientIdOverride || event?.currentTarget?.dataset?.customizationPanelIngredientIdValue
    
    // First open the panel
    this.openPanel(null, dishId)
    
    // Auto-increment quantity when adding extra (if ingredient ID is provided)
    if (ingredientId) {
      setTimeout(() => {
        const panel = this.hasPanelTarget ? this.panelTarget : document.querySelector('[data-customization-panel-target="panel"]')
        if (panel) {
          const plusBtn = panel.querySelector(
            `[data-customization-panel-ingredient-id-value="${ingredientId}"][data-delta="0.1"]`
          )
          if (plusBtn) {
            plusBtn.click()
          }
        }
      }, 300)
    }
  }
}
