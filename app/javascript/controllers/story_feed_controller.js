import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { currentIndex: Number }

  connect() {
    this.setupSwipeHandlers()
  }

  setupSwipeHandlers() {
    let startY = null
    let startX = null

    this.element.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY
      startX = e.touches[0].clientX
    })

    this.element.addEventListener('touchend', (e) => {
      if (!startY || !startX) return

      const endY = e.changedTouches[0].clientY
      const endX = e.changedTouches[0].clientX
      const diffY = startY - endY
      const diffX = Math.abs(startX - endX)

      // Only trigger if vertical swipe is more significant than horizontal
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        if (diffY > 0) {
          this.swipeUp()
        } else {
          this.swipeDown()
        }
      }

      startY = null
      startX = null
    })
  }

  swipeDown() {
    // Load next story
    const nextIndex = this.currentIndexValue + 1
    // This would be handled by Turbo Frame navigation
    console.log('Swipe down - next story')
  }

  swipeUp() {
    // Load previous story
    const prevIndex = this.currentIndexValue - 1
    // This would be handled by Turbo Frame navigation
    console.log('Swipe up - previous story')
  }
}

