class HomeController < ApplicationController
  protect_from_forgery with: :null_session

  def kamiflex
    begin
      $SAFE = 4
      json = eval(params[:code])
      render json: json
    rescue Exception => error
      json = Kamiflex.hash(self) do
        bubble size: :giga do
          body do
            text error.message, size: :sm, wrap: true
          end
        end
      end
      render json: json
    end
  end
end