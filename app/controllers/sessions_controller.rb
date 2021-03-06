require 'scirate/logging'

class SessionsController < ApplicationController
  def new
  end

  def create
    user = SessionsController.user_from_omniauth(env['omniauth.auth'])
    session[:user_id] = user[:id]

    Logging::log_event('server/login', user, {:provider => params[:provider]})

    redirect_to root_url + '#'  # ensure there is no hash from the provider
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: 'Signed out.'
  end

  def failure
    redirect_to root_url, alert: 'Authentication failed. Please try again.'
  end

  def self.user_from_omniauth(auth)
    user = User.find_by_email(auth['info']['email'])
    if not user
      user = User.new(:email => auth['info']['email'],
          :name => auth['info']['name'])
      user.save!
    end
    return user
  end
end
