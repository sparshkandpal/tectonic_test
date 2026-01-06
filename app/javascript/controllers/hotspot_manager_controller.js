import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "hotspot"]

  connect() {
    this.setupBackdropHandler()
  }

  showIngredientCard(event) {
    const ingredientId = event.currentTarget.dataset.hotspotIngredientIdValue
    
    // Pause story progress
    const storyViewer = this.element.closest('[data-controller*="story-viewer"]')
    if (storyViewer) {
      const storyViewerController = this.application.getControllerForElementAndIdentifier(storyViewer, 'story-viewer')
      if (storyViewerController) {
        storyViewerController.pauseProgress()
      }
    }

    // Load ingredient card
    fetch(`/ingredients/${ingredientId}`)
      .then(response => response.text())
      .then(html => {
        const frame = this.modalTarget.querySelector('turbo-frame')
        if (frame) {
          frame.innerHTML = html
        }
        this.modalTarget.classList.add('active')
      })
      .catch(err => console.error('Failed to load ingredient:', err))
  }

  closeCard() {
    this.modalTarget.classList.remove('active')
    
    // Resume story progress
    const storyViewer = this.element.closest('[data-controller*="story-viewer"]')
    if (storyViewer && window.Stimulus) {
      try {
        const storyViewerController = window.Stimulus.getControllerForElementAndIdentifier(storyViewer, 'story-viewer')
        if (storyViewerController) {
          storyViewerController.resumeProgress()
        }
      } catch (e) {
        console.warn('Could not resume story progress:', e)
      }
    }
  }

  setupBackdropHandler() {
    this.modalTarget.addEventListener('click', (e) => {
      if (e.target === this.modalTarget) {
        this.closeCard()
      }
    })
  }

  openCustomizationPanel(event) {
    const ingredientId = event.currentTarget.dataset.hotspotManagerIngredientIdValue
    this.closeCard()
    
    // Find customization panel controller
    const panel = document.querySelector('[data-controller*="customization-panel"]')
    if (panel) {
      const panelController = this.application.getControllerForElementAndIdentifier(panel, 'customization-panel')
      if (panelController) {
        panelController.dishIdValue = panelController.dishIdValue || panel.dataset.customizationPanelDishIdValue
        panelController.openPanel(event)
      }
    }
  }

  addExtra(event) {
    this.openCustomizationPanel(event)
    // The customization panel controller will handle the increment
  }
}

