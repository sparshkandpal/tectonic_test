import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = true // Enable debug mode to see controller registration
window.Stimulus = application

// Register all Stimulus controllers
const controllers = require.context(".", true, /_controller\.js$/)
controllers.keys().forEach(key => {
  try {
    const controllerModule = controllers(key)
    const controller = controllerModule.default || controllerModule
    
    // Convert file path to controller identifier
    // e.g., "./story_feed_controller.js" -> "story-feed"
    const identifier = key
      .replace(/^\.\//, "")
      .replace(/_controller\.js$/, "")
      .replace(/\//g, "--")
      .replace(/_/g, "-")
    
    if (controller) {
      application.register(identifier, controller)
      console.log(`Registered Stimulus controller: ${identifier}`)
    }
  } catch (error) {
    console.error(`Failed to register controller from ${key}:`, error)
  }
})

export { application }

