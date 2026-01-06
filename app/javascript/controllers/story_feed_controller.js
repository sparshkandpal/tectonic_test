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
    console.log('Total stories:', this.storiesValue ? this.storiesValue.length : 0) // Debug log
    
    // Ensure stories array is valid
    if (!this.storiesValue || this.storiesValue.length === 0) {
      console.warn('No stories available in feed') // Debug log
      return
    }
    
    // Ensure current index is valid
    if (this.currentIndexValue < 0 || this.currentIndexValue >= this.storiesValue.length) {
      console.warn('Invalid current index, resetting to 0') // Debug log
      this.currentIndexValue = 0
    }
    
    this.setupSwipeHandlers()
    this.setupStoryNavigation()
    this.setupTurboFrameListener()
    // Preload next story's images
    this.preloadNextStoryImages()
  }

  setupTurboFrameListener() {
    // Listen for turbo frame loads to reset story viewer
    const frame = this.element.querySelector('turbo-frame')
    if (frame) {
      frame.addEventListener('turbo:frame-load', () => {
        console.log('Turbo frame loaded, resetting story viewer') // Debug log
        // Dispatch event to reset story viewer when new story loads
        setTimeout(() => {
          const storyViewer = frame.querySelector('[data-controller*="story-viewer"]')
          if (storyViewer) {
            const resetEvent = new CustomEvent('story-loaded', { bubbles: true })
            storyViewer.dispatchEvent(resetEvent)
            console.log('Dispatched story-loaded event to reset viewer') // Debug log
          }
        }, 100)
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
    const storyCompleteHandler = (e) => {
      console.log('Story complete event received', e.detail) // Debug log
      e.stopPropagation()
      e.preventDefault()
      // Small delay to ensure smooth transition
      setTimeout(() => {
        this.loadNextStory()
      }, 100)
    }
    
    const storyBackHandler = (e) => {
      console.log('Story back event received') // Debug log
      e.stopPropagation()
      e.preventDefault()
      this.loadPreviousStory()
    }
    
    document.addEventListener('story-complete', storyCompleteHandler, true)
    document.addEventListener('story-back', storyBackHandler, true)
    
    // Store handlers for cleanup
    this._storyCompleteHandler = storyCompleteHandler
    this._storyBackHandler = storyBackHandler
  }
  
  disconnect() {
    if (this._storyCompleteHandler) {
      document.removeEventListener('story-complete', this._storyCompleteHandler, true)
    }
    if (this._storyBackHandler) {
      document.removeEventListener('story-back', this._storyBackHandler, true)
    }
  }

  swipeDown() {
    this.loadNextStory()
  }

  swipeUp() {
    this.loadPreviousStory()
  }

  loadNextStory() {
    console.log('Loading next story. Current index:', this.currentIndexValue, 'Total stories:', this.storiesValue ? this.storiesValue.length : 0) // Debug log
    
    if (!this.storiesValue || this.storiesValue.length === 0) {
      console.warn('No stories available to load') // Debug log
      return
    }
    
    // Loop back to first story if we've reached the end
    if (this.currentIndexValue >= this.storiesValue.length - 1) {
      this.currentIndexValue = 0
      console.log('Reached end, looping back to first story (index 0)') // Debug log
    } else {
      this.currentIndexValue++
    }
    
    const nextStoryId = this.storiesValue[this.currentIndexValue]
    if (!nextStoryId) {
      console.error('Invalid story ID at index:', this.currentIndexValue) // Debug log
      return
    }
    
    console.log('Loading story ID:', nextStoryId, 'at index:', this.currentIndexValue) // Debug log
    this.loadStory(nextStoryId)
  }

  loadPreviousStory() {
    if (!this.storiesValue || this.storiesValue.length === 0) {
      console.warn('No stories available to load') // Debug log
      return
    }
    
    // Loop to last story if we're at the beginning
    if (this.currentIndexValue <= 0) {
      this.currentIndexValue = this.storiesValue.length - 1
      console.log('At beginning, looping to last story (index', this.currentIndexValue, ')') // Debug log
    } else {
      this.currentIndexValue--
    }
    
    const prevStoryId = this.storiesValue[this.currentIndexValue]
    if (!prevStoryId) {
      console.error('Invalid story ID at index:', this.currentIndexValue) // Debug log
      return
    }
    
    console.log('Loading previous story ID:', prevStoryId, 'at index:', this.currentIndexValue) // Debug log
    this.loadStory(prevStoryId)
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
      // Clear the frame first to ensure clean transition
      frame.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: white;">Loading...</div>'
      frame.src = `/stories/${storyId}`
    } else {
      // Fallback: direct fetch
      console.log('Using fetch fallback to load story') // Debug log
      // Show loading state
      frame.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: white;">Loading...</div>'
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
          setTimeout(() => {
            const storyViewer = frame.querySelector('[data-controller*="story-viewer"]')
            if (storyViewer) {
              // Dispatch a custom event to reset the story viewer
              const resetEvent = new CustomEvent('story-loaded', { bubbles: true })
              storyViewer.dispatchEvent(resetEvent)
              console.log('Dispatched story-loaded event via fetch fallback') // Debug log
            }
          }, 100)
        })
        .catch(err => console.error('Failed to load story:', err))
    }
    
    // Preload next story's images after loading current story
    setTimeout(() => {
      this.preloadNextStoryImages()
    }, 500)
  }
  
  preloadNextStoryImages() {
    if (!this.storiesValue || this.storiesValue.length === 0) return
    
    // Get next story ID
    const nextIndex = (this.currentIndexValue + 1) % this.storiesValue.length
    const nextStoryId = this.storiesValue[nextIndex]
    
    if (!nextStoryId) return
    
    console.log('Preloading images for next story:', nextStoryId) // Debug log
    
    // Fetch HTML and extract image URLs for preloading
    fetch(`/stories/${nextStoryId}`, {
      headers: {
        'Accept': 'text/html',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.text())
      .then(html => {
        // Parse HTML to find image URLs
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const images = doc.querySelectorAll('img.media-image')
        
        images.forEach(img => {
          const src = img.src || img.getAttribute('src') || img.getAttribute('data-src')
          if (src && !src.includes('placeholder') && !src.includes('data:')) {
            const preloadImg = new Image()
            preloadImg.onload = () => {
              console.log('Successfully preloaded image:', src) // Debug log
            }
            preloadImg.onerror = () => {
              console.warn('Failed to preload image:', src) // Debug log
            }
            preloadImg.src = src
          }
        })
        
        // Also preload video posters if any
        const videos = doc.querySelectorAll('video.media-video')
        videos.forEach(video => {
          const poster = video.getAttribute('poster')
          if (poster) {
            const preloadImg = new Image()
            preloadImg.src = poster
          }
        })
      })
      .catch(err => {
        console.warn('Failed to preload next story images:', err)
      })
  }
}
