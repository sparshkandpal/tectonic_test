Rails.application.routes.draw do
  get 'dish_ingredients/new'
  get 'dish_ingredients/create'
  get 'dish_ingredients/edit'
  get 'dish_ingredients/update'
  get 'dish_ingredients/destroy'
  root 'stories#index'

  resources :stories, only: [:index, :show, :new, :create, :edit, :update] do
    member do
      post :save_progress
      get :get_progress
    end
    resources :media_items, only: [:new, :create, :edit, :update, :destroy, :show] do
      resources :hotspots, only: [:index]
    end
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

  resources :dishes, only: [:new, :create, :edit, :update] do
    member do
      get :customization_panel
    end
    resources :dish_ingredients, only: [:new, :create, :edit, :update, :destroy]
  end

  namespace :api do
    resources :dishes, only: [] do
      member do
        post :calculate_price
      end
    end
  end
end
