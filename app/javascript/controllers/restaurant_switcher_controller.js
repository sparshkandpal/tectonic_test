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
    event.preventDefault()
    event.stopPropagation()
    
    const restaurantId = event.currentTarget.dataset.restaurantSwitcherRestaurantIdValue
    console.log('Switching to restaurant:', restaurantId) // Debug log
    
    if (restaurantId) {
      // Reload page with new restaurant
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

