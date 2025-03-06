source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.0.beta1"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
# gem "importmap-rails"
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", ">= 2.0.0.rc2", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"
# gem 'twitter-typeahead-rails', :git => "git://github.com/yourabi/twitter-typeahead-rails.git"
gem 'handlebars_assets'
gem 'pony'
gem 'friendly_id'

gem 'activeadmin' #, '~> 1.0.0.pre5'#github: 'gregbell/active_admin'
gem 'devise'#, '~> 3.2.4'
gem "json"
# gem 'aws-sdk'
gem 'geocoder'
gem 'kaminari'
# gem "bullet" #incompatible with active_record 8.0.0.beta1
gem 'httparty'
gem 'versionist'
gem 'acts_as_votable'
gem 'make_flaggable', github: 'medihack/make_flaggable'
gem 'delayed_job_active_record'

gem "font-awesome-rails"
gem 'bootstrap'
gem "carrierwave"
# gem "fog"#, "~> 1.3.1" #threw a bunch of errors
# gem 'mini_magick', '~> 3.7.0'
# gem 'rmagick', '2.13.2', require: false

gem 'stripe'
gem 'stripe_event'
gem 'twilio-ruby'#, '~> 5.10.1'
gem 'bitly'
gem 'foundation-rails'
gem 'rails_12factor', group: :production

gem 'nokogiri'#, '1.5.0'

# AA Theme
# gem 'active_admin_flat_skin'
gem 'arctic_admin'
# gem 'activeadmin_blaze_theme'

gem 'awesome_print'

gem 'momentjs-rails', '>= 2.9.0'
# gem 'bootstrap3-datetimepicker-rails', '~> 4.17.47'
gem 'bootstrap4-datetime-picker-rails'
# gem 'pickadate-rails'

# Use SCSS for stylesheets
gem 'sassc-rails'#, '~> 4.0.3'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails'#, '~> 4.0.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer',  platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc'#, '~> 0.4.0',          group: :doc

# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
gem 'spring',        group: :development

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]

# SSL
gem 'rack-ssl-enforcer'

gem 'execjs'


group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'pry'
  gem 'minitest'
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'simplecov'
  gem 'database_cleaner', github: 'bmabey/database_cleaner'
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
end

gem "jsbundling-rails", "~> 1.3"

gem "cssbundling-rails", "~> 1.4"

gem "dockerfile-rails", ">= 1.7", :group => :development
