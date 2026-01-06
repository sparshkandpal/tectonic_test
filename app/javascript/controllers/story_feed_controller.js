import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    currentIndex: Number,
    stories: Array,
    restaurantId: Number
  }

  connect() {
    console.log('Story feed controller connected') // Debug log
    console.log('Stories array:', this.storiesValue) // Debug log
    console.log('Current index:', this.currentIndexValue) // Debug log
    this.setupSwipeHandlers()
    this.setupStoryNavigation()
    this.setupTurboFrameListener()
  }

  setupTurboFrameListener() {
    // Listen for turbo frame loads to reset story viewer
    const frame = this.element.querySelector('turbo-frame')
    if (frame) {
      frame.addEventListener('turbo:frame-load', () => {
        console.log('Turbo frame loaded') // Debug log
        // Don't reset index here - let the story viewer handle its own reset
      })
      
      // Also listen for turbo:before-frame-render
      frame.addEventListener('turbo:before-frame-render', (event) => {
        console.log('Turbo frame before render') // Debug log
      })
    }
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

  setupStoryNavigation() {
    // Listen for story completion events - use capture phase to ensure we catch it
    document.addEventListener('story-complete', (e) => {
      console.log('Story complete event received', e.detail) // Debug log
      e.stopPropagation()
      this.loadNextStory()
    }, true)

    document.addEventListener('story-back', (e) => {
      console.log('Story back event received') // Debug log
      e.stopPropagation()
      this.loadPreviousStory()
    }, true)
  }

  swipeDown() {
    this.loadNextStory()
  }

  swipeUp() {
    this.loadPreviousStory()
  }

  loadNextStory() {
    console.log('Loading next story. Current index:', this.currentIndexValue, 'Total stories:', this.storiesValue.length) // Debug log
    if (this.storiesValue && this.storiesValue.length > 0 && this.currentIndexValue < this.storiesValue.length - 1) {
      this.currentIndexValue++
      const nextStoryId = this.storiesValue[this.currentIndexValue]
      console.log('Loading story ID:', nextStoryId) // Debug log
      this.loadStory(nextStoryId)
    } else {
      console.log('No more stories to load') // Debug log
    }
  }

  loadPreviousStory() {
    if (this.currentIndexValue > 0) {
      this.currentIndexValue--
      this.loadStory(this.storiesValue[this.currentIndexValue])
    }
  }

  loadStory(storyId) {
    console.log('loadStory called with ID:', storyId) // Debug log
    const frame = this.element.querySelector('turbo-frame')
    if (!frame) {
      console.error('No turbo-frame found!') // Debug log
      return
    }
    
    if (window.Turbo) {
      // Use Turbo Frame to load the story
      console.log('Using Turbo Frame to load story') // Debug log
      frame.src = `/stories/${storyId}`
    } else {
      // Fallback: direct fetch
      console.log('Using fetch fallback to load story') // Debug log
      fetch(`/stories/${storyId}`, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(response => response.text())
        .then(html => {
          frame.innerHTML = html
          // Trigger reset after loading
          const storyViewer = frame.querySelector('[data-controller*="story-viewer"]')
          if (storyViewer) {
            // Dispatch a custom event to reset the story viewer
            const resetEvent = new CustomEvent('story-loaded', { bubbles: true })
            storyViewer.dispatchEvent(resetEvent)
          }
        })
        .catch(err => console.error('Failed to load story:', err))
    }
  }
}
