Rails.application.routes.draw do
  root 'stories#index'

  resources :stories, only: [:index, :show] do
    member do
      post :save_progress
      get :get_progress
    end
  end

  resources :media_items, only: [:show] do
    resources :hotspots, only: [:index]
  end

  resources :ingredients, only: [:show] do
    member do
      get :substitutions
    end
  end

  resources :cart_items, only: [:index, :create, :destroy] do
    collection do
      delete :clear
      get :count
    end
  end

  resources :dishes, only: [] do
    member do
      get :customization_panel
    end
  end

  namespace :api do
    resources :dishes, only: [] do
      member do
        post :calculate_price
      end
    end
  end
end
