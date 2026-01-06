import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    mediaType: String,
    duration: Number
  }
  static targets = ["video", "playPauseZone"]

  connect() {
    if (this.hasVideoTarget) {
      this.setupVideoHandlers()
    }
  }

  setupVideoHandlers() {
    const video = this.videoTarget
    if (!video) return

    video.addEventListener('timeupdate', () => {
      this.updateProgressBar()
    })

    video.addEventListener('ended', () => {
      this.onVideoEnded()
    })
  }

  updateProgressBar() {
    const video = this.videoTarget
    if (!video) return

    const progress = video.currentTime / video.duration
    // This would update the progress bar via story-viewer controller
    const event = new CustomEvent('video-progress', { detail: { progress } })
    this.element.dispatchEvent(event)
  }

  togglePlayPause() {
    if (!this.hasVideoTarget) return

    const video = this.videoTarget
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  onVideoEnded() {
    console.log('Video ended, triggering next media') // Debug log
    const event = new CustomEvent('media-ended', { bubbles: true })
    // Find the story-viewer controller and trigger nextMedia
    const storyViewer = this.element.closest('[data-controller*="story-viewer"]')
    if (storyViewer && window.Stimulus) {
      try {
        const storyViewerController = window.Stimulus.getControllerForElementAndIdentifier(storyViewer, 'story-viewer')
        if (storyViewerController) {
          console.log('Found story-viewer controller, calling nextMedia') // Debug log
          storyViewerController.nextMedia()
        }
      } catch (e) {
        console.warn('Could not trigger nextMedia from video end:', e)
        // Fallback: dispatch event
        document.dispatchEvent(event)
      }
    } else {
      // Fallback: dispatch event
      document.dispatchEvent(event)
    }
  }
}

