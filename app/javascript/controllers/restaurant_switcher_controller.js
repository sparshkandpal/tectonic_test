import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    currentRestaurantId: Number,
    restaurantId: Number
  }

  connect() {
    // If this is the restaurant name in header, make it clickable
    if (this.hasRestaurantIdValue) {
      this.element.style.cursor = 'pointer'
      this.element.addEventListener('click', () => {
        this.showRestaurantList()
      })
    }
  }

  switchRestaurant(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }
    
    const restaurantId = event?.currentTarget?.dataset?.restaurantSwitcherRestaurantIdValue || 
                         event?.target?.closest('[data-restaurant-switcher-restaurant-id-value]')?.dataset?.restaurantSwitcherRestaurantIdValue
    
    console.log('Switching to restaurant:', restaurantId, 'Current:', this.currentRestaurantIdValue) // Debug log
    
    if (!restaurantId) {
      console.error('No restaurant ID found')
      return
    }
    
    // Don't switch if already on this restaurant
    if (this.hasCurrentRestaurantIdValue && parseInt(restaurantId) === this.currentRestaurantIdValue) {
      console.log('Already on this restaurant, skipping switch')
      return
    }
    
    // Use Turbo.visit for smoother navigation
    if (window.Turbo) {
      window.Turbo.visit(`/stories?restaurant_id=${restaurantId}`)
    } else {
      window.location.href = `/stories?restaurant_id=${restaurantId}`
    }
  }

  showRestaurantList() {
    // Scroll to restaurant switcher or trigger dropdown
    const switcher = document.querySelector('.restaurant-switcher')
    if (switcher) {
      switcher.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

