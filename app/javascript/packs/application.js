// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
import "@hotwired/turbo-rails"
import { application } from "../controllers/index"

Rails.start()
ActiveStorage.start()

// Register all Stimulus controllers
const controllers = require.context("../controllers", true, /_controller\.js$/)
controllers.keys().forEach(controllers)
