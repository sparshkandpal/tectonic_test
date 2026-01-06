import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    storyId: Number,
    currentMediaIndex: Number
  }
  static targets = [
    "progressSegment",
    "progressFill",
    "mediaWrapper",
    "prevZone",
    "nextZone"
  ]

  connect() {
    console.log('Story viewer controller connected, storyId:', this.storyIdValue) // Debug log
    console.log('Media wrappers count:', this.mediaWrapperTargets.length) // Debug log
    this.progressTimer = null
    this.isPaused = false
    // Reset progress bars
    this.resetProgressBars()
    // Start progress after a short delay to ensure DOM is ready
    setTimeout(() => {
      console.log('Starting progress after connect delay') // Debug log
      this.startProgress()
    }, 300)
    
    // Listen for story-loaded event to reset when new story loads
    this.element.addEventListener('story-loaded', () => {
      console.log('Story loaded event received, resetting story viewer') // Debug log
      this.clearProgress()
      this.isPaused = false
      this.resetProgressBars()
      setTimeout(() => {
        console.log('Starting progress after story-loaded event') // Debug log
        this.startProgress()
      }, 300)
    })
    
    // Listen for media-ended event from video player
    this.element.addEventListener('media-ended', (e) => {
      console.log('Media ended event received') // Debug log
      e.stopPropagation()
      this.nextMedia()
    })
  }

  disconnect() {
    this.clearProgress()
  }

  resetProgressBars() {
    console.log('Resetting progress bars, media wrappers count:', this.mediaWrapperTargets.length) // Debug log
    // Reset all progress bars to 0
    this.progressFillTargets.forEach((fill, index) => {
      fill.style.width = '0%'
      fill.style.transition = 'width 0.1s linear'
    })
    // Reset current media index
    this.currentMediaIndexValue = 0
    // Hide all media wrappers except first
    this.mediaWrapperTargets.forEach((wrapper, index) => {
      if (index === 0) {
        wrapper.classList.add('active')
        wrapper.style.opacity = '1'
      } else {
        wrapper.classList.remove('active')
        wrapper.style.opacity = '0'
      }
    })
    console.log('Progress bars reset, current media index:', this.currentMediaIndexValue) // Debug log
  }

  startProgress() {
    if (this.isPaused) {
      console.log('Progress paused, not starting') // Debug log
      return
    }
    
    const currentMedia = this.mediaWrapperTargets[this.currentMediaIndexValue]
    if (!currentMedia) {
      console.warn('No current media found at index', this.currentMediaIndexValue, 'Total media:', this.mediaWrapperTargets.length)
      return
    }

    const mediaPlayerElement = currentMedia.querySelector('[data-controller*="media-player"]')
    if (!mediaPlayerElement) {
      console.warn('No media player element found')
      return
    }
    
    const durationAttr = mediaPlayerElement.dataset.mediaPlayerDurationValue
    const duration = parseInt(durationAttr || 5000)

    console.log('Starting progress for media index:', this.currentMediaIndexValue, 'Duration:', duration, 'ms', 'Element:', mediaPlayerElement) // Debug log

    const progressFill = this.progressFillTargets[this.currentMediaIndexValue]
    if (!progressFill) {
      console.warn('No progress fill found at index', this.currentMediaIndexValue, 'Total fills:', this.progressFillTargets.length)
      return
    }

    // Reset progress fill
    progressFill.style.width = '0%'
    progressFill.style.transition = 'width 0.1s linear'

    const startTime = Date.now()
    const progressInterval = 16 // ~60fps

    // Clear any existing timer first
    this.clearProgress()

    console.log('Setting up progress timer, will complete in', duration, 'ms') // Debug log

    this.progressTimer = setInterval(() => {
      if (this.isPaused) {
        console.log('Progress paused during interval') // Debug log
        return
      }

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      if (progressFill) {
        progressFill.style.width = `${progress * 100}%`
      }

      if (progress >= 1) {
        console.log('Media progress completed! Elapsed:', elapsed, 'ms, Duration:', duration, 'ms, Progress:', progress) // Debug log
        this.clearProgress() // Clear timer before calling nextMedia
        // Use setTimeout to ensure the interval is fully cleared before calling nextMedia
        setTimeout(() => {
          console.log('Calling nextMedia after progress completion') // Debug log
          this.nextMedia()
        }, 10)
      }
    }, progressInterval)
  }

  pauseProgress() {
    this.isPaused = true
    this.clearProgress()
  }

  resumeProgress() {
    this.isPaused = false
    this.startProgress()
  }

  clearProgress() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
  }

  nextMedia() {
    console.log('nextMedia called, current index:', this.currentMediaIndexValue, 'total media:', this.mediaWrapperTargets.length) // Debug log
    this.clearProgress()
    
    if (this.currentMediaIndexValue < this.mediaWrapperTargets.length - 1) {
      console.log('Moving to next media item') // Debug log
      this.hideCurrentMedia()
      this.currentMediaIndexValue++
      this.showCurrentMedia()
      this.saveProgress()
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.startProgress()
      }, 100)
    } else {
      // All media items done, move to next story
      console.log('All media items completed, moving to next story') // Debug log
      // Clear progress and immediately trigger next story
      this.clearProgress()
      this.nextStory()
    }
  }

  nextStory() {
    console.log('nextStory called, storyId:', this.storyIdValue) // Debug log
    // Clear progress before moving
    this.clearProgress()
    // Immediately trigger event to move to next story
    const event = new CustomEvent('story-complete', { 
      detail: { storyId: this.storyIdValue },
      bubbles: true,
      cancelable: false
    })
    // Dispatch on document to ensure story-feed controller catches it
    document.dispatchEvent(event)
    console.log('Story complete event dispatched on document') // Debug log
  }

  goBack() {
    console.log('goBack called') // Debug log
    // Trigger event to go to previous story - dispatch on document to ensure it's caught
    const event = new CustomEvent('story-back', { 
      bubbles: true,
      cancelable: true
    })
    // Dispatch on document to ensure story-feed controller catches it
    document.dispatchEvent(event)
    console.log('Story back event dispatched') // Debug log
  }

  closeStory() {
    // Close story viewer
    window.location.href = '/stories'
  }

  prevMedia() {
    this.clearProgress()
    
    if (this.currentMediaIndexValue > 0) {
      this.hideCurrentMedia()
      this.currentMediaIndexValue--
      this.showCurrentMedia()
      this.saveProgress()
      this.startProgress()
    }
  }

  hideCurrentMedia() {
    const currentMedia = this.mediaWrapperTargets[this.currentMediaIndexValue]
    if (currentMedia) {
      currentMedia.classList.remove('active')
      const progressFill = this.progressFillTargets[this.currentMediaIndexValue]
      if (progressFill) {
        progressFill.style.width = '0%'
      }
    }
  }

  showCurrentMedia() {
    const currentMedia = this.mediaWrapperTargets[this.currentMediaIndexValue]
    if (currentMedia) {
      currentMedia.classList.add('active')
    }
  }

  saveProgress() {
    fetch(`/stories/${this.storyIdValue}/save_progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        media_index: this.currentMediaIndexValue
      })
    }).catch(err => console.error('Failed to save progress:', err))
  }
}

