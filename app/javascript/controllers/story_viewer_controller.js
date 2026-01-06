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
    this.progressTimer = null
    this.isPaused = false
    this.startProgress()
  }

  disconnect() {
    this.clearProgress()
  }

  startProgress() {
    if (this.isPaused) return
    
    const currentMedia = this.mediaWrapperTargets[this.currentMediaIndexValue]
    if (!currentMedia) return

    const mediaType = currentMedia.querySelector('[data-media-player-media-type-value]')?.dataset.mediaPlayerMediaTypeValue
    const duration = parseInt(currentMedia.querySelector('[data-media-player-duration-value]')?.dataset.mediaPlayerDurationValue || 5000)

    const progressFill = this.progressFillTargets[this.currentMediaIndexValue]
    if (!progressFill) return

    const startTime = Date.now()
    const progressInterval = 16 // ~60fps

    this.progressTimer = setInterval(() => {
      if (this.isPaused) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      progressFill.style.width = `${progress * 100}%`

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
    }
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

