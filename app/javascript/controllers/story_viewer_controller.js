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
    this.progressTimer = null
    this.isPaused = false
    // Reset progress bars
    this.resetProgressBars()
    // Start progress after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.startProgress()
    }, 100)
    
    // Listen for story-loaded event to reset when new story loads
    this.element.addEventListener('story-loaded', () => {
      console.log('Story loaded event received, resetting') // Debug log
      this.resetProgressBars()
      setTimeout(() => {
        this.startProgress()
      }, 100)
    })
  }

  disconnect() {
    this.clearProgress()
  }

  resetProgressBars() {
    // Reset all progress bars to 0
    this.progressFillTargets.forEach(fill => {
      fill.style.width = '0%'
    })
    // Reset current media index
    this.currentMediaIndexValue = 0
    // Hide all media wrappers except first
    this.mediaWrapperTargets.forEach((wrapper, index) => {
      if (index === 0) {
        wrapper.classList.add('active')
      } else {
        wrapper.classList.remove('active')
      }
    })
  }

  startProgress() {
    if (this.isPaused) return
    
    const currentMedia = this.mediaWrapperTargets[this.currentMediaIndexValue]
    if (!currentMedia) {
      console.warn('No current media found at index', this.currentMediaIndexValue)
      return
    }

    const mediaType = currentMedia.querySelector('[data-media-player-media-type-value]')?.dataset.mediaPlayerMediaTypeValue
    const duration = parseInt(currentMedia.querySelector('[data-media-player-duration-value]')?.dataset.mediaPlayerDurationValue || 5000)

    const progressFill = this.progressFillTargets[this.currentMediaIndexValue]
    if (!progressFill) {
      console.warn('No progress fill found at index', this.currentMediaIndexValue)
      return
    }

    // Reset progress fill
    progressFill.style.width = '0%'

    const startTime = Date.now()
    const progressInterval = 16 // ~60fps

    this.progressTimer = setInterval(() => {
      if (this.isPaused) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      if (progressFill) {
        progressFill.style.width = `${progress * 100}%`
      }

      if (progress >= 1) {
        this.nextMedia()
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
    this.clearProgress()
    
    if (this.currentMediaIndexValue < this.mediaWrapperTargets.length - 1) {
      this.hideCurrentMedia()
      this.currentMediaIndexValue++
      this.showCurrentMedia()
      this.saveProgress()
      this.startProgress()
    } else {
      // All media items done, move to next story
      this.nextStory()
    }
  }

  nextStory() {
    console.log('nextStory called, storyId:', this.storyIdValue) // Debug log
    // Clear progress before moving
    this.clearProgress()
    // Trigger event to move to next story - dispatch on document to ensure it's caught
    const event = new CustomEvent('story-complete', { 
      detail: { storyId: this.storyIdValue },
      bubbles: true,
      cancelable: true
    })
    // Dispatch on document to ensure story-feed controller catches it
    document.dispatchEvent(event)
    console.log('Story complete event dispatched') // Debug log
  }

  goBack() {
    // Trigger event to go to previous story
    const event = new CustomEvent('story-back', { bubbles: true })
    this.element.dispatchEvent(event)
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

