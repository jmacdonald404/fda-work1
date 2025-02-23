Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  devise_for :users
  devise_scope :user do
    get 'users/sign_out' => "devise/sessions#destroy"
  end
  devise_for :admin_users, ActiveAdmin::Devise.config
  post '/admin/catering_orders/cancel_order', to: 'admin/catering_orders#cancel_order', as: :admin_cancel_catering_order
  # 'orders/cancel_order', to: 'catering_orders#cancel_order', as: :cancel_catering_order
  ActiveAdmin.routes(self)
  mount StripeEvent::Engine, at: '/stripe-webhooks'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  # root 'users#new'
  root 'dashboard#catering'
  get 'phone', to: 'users#new', as: :signup_phone
  get 'verify', to: 'users#new', as: :signup_verify
  get 'profile', to: 'users#new', as: :signup_profile
  get 'location', to: 'users#new', as: :signup_location
  get 'new_apartment', to: 'users#no_apartment_found', as: :no_apartment_found
  get 'order_payment/:url_safe_token', to: 'users#order_payment', as: :order_payment

  post 'register_payment', to: 'users#register_payment', as: :register_payment
  # resources :users, only: :show
  # delete 'users/sign_out', to: 'devise/sessions#destroy'
  get 'users/:id(.:format)', to: 'users#show', as: :user

  get 'thanks', to: 'users#thankyou', as: :thankyou
  get 'cc_complete', to: 'users#cc_complete', as: :cc_thankyou

  post 'api/v1/text_response', to: 'api/v1/text_response#receive'
  
  # Orders
  get 'orders', to: 'catering_orders#index'
  get 'orders/:id(.:format)', to: 'catering_orders#show', as: :catering_order
  post 'orders/cancel_order', to: 'catering_orders#cancel_order', as: :cancel_catering_order
  post 'orders/cancel_request', to: 'catering_orders#cancel_request', as: :cancel_catering_order_request
  # Dashboard
  get 'dashboard', to: 'dashboard#catering', as: :dashboard
  get 'dashboard/order_complete', to: 'dashboard#order_complete'
  get 'dashboard/order_history', to: 'dashboard#order_history'
  get 'newsletter_subscribers', to: 'dashboard#catering'
  post 'newsletter_subscribers', to: 'dashboard#create_newsletter_subscriber'
  post 'dashboard/update_filter_selections', to: 'dashboard#update_filter_selections'
  post 'dashboard/edit_catering_item', to: 'dashboard#edit_catering_item'
  post 'dashboard/check_payment_source', to: 'dashboard#check_payment_source'
  post 'dashboard/check_dish_minimum', to: 'dashboard#check_dish_minimum'
  post 'dashboard/bulk_update_catering_dishes', to: 'dashboard#bulk_update_catering_dishes'
  post 'dashboard/preauth_payment', to: 'dashboard#preauth_payment'
  post 'dashboard/place_catering_order', to: 'dashboard#place_catering_order'
  post 'dashboard/update_sms_number', to: 'dashboard#update_sms_number'
  post 'dashboard/reset_password', to: 'dashboard#reset_password'
  delete 'dashboard/delete_catering_dish', to: 'dashboard#delete_catering_dish'

  # Dashboard Users
  post 'dashboard/sign_up', to: 'dashboard_users#sign_up'
  post 'dashboard/login', to:'dashboard_users#login'
  get 'signup', to:'dashboard_users#new'
  get 'login', to:'dashboard_users#new_session'
  patch 'users/:id', to:'dashboard_users#update'

  # Menu
  get 'm/:url_safe_token', to: 'menus#show', as: :menu_image_redirect

  # get 'restaurants/:id(.:format)', to: 'restaurants#show', as: :restaurant
  get ':slug', to: 'dashboard#catering', as: :restaurant
  resources 'pairings'

end